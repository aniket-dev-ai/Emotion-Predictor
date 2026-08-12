from scripts.schemas import HealthResponse, PredictionResponse, TextInput
from scripts.lifespan import dl_model
from scripts.preprocess import preprocess_text
from fastapi import HTTPException, UploadFile
from tensorflow.keras.preprocessing.sequence import pad_sequences  # type: ignore
import numpy as np
from PIL import Image
import io

max_length = 50
emotion_labels = ["sadness", "joy", "love", "anger", "fear", "surprise"]


def healthcheck():
    return HealthResponse(status="Server Is Running", model_loaded=bool(dl_model))


def predict_emotion(text_input: TextInput) -> PredictionResponse:
    BiGRU_model = dl_model.get("BiGRU")
    tokenizer_model = dl_model.get("tokenizer")
    if BiGRU_model is None or tokenizer_model is None:
        raise HTTPException(
            status_code=503, detail="Model or tokenizer isn't loaded yet"
        )

    cleaned_text = preprocess_text(text_input.text)
    tokenized_text = tokenizer_model.texts_to_sequences([cleaned_text])
    padded_sequence = pad_sequences(
        tokenized_text, maxlen=max_length, padding="post", truncating="pre"
    )

    probabilites = BiGRU_model.predict(padded_sequence)[0]
    top_emotion_index = int(np.argmax(probabilites))
    all_probabilities = {
        label: float(prob) for prob, label in zip(probabilites, emotion_labels)
    }

    return PredictionResponse(
        text=text_input.text,
        predicted_emotion=emotion_labels[top_emotion_index],
        confidence=float(probabilites[top_emotion_index]),
        all_probabilities=all_probabilities,
    )


def predict_emotion_from_image(image: UploadFile) -> PredictionResponse:

    ocr_reader = dl_model.get("OCR")

    if ocr_reader is None:
        raise HTTPException(status_code=503, detail="OCR model isn't loaded yet")

    try:
        image_bytes = image.file.read()

        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty image file")

        # Validate image
        Image.open(io.BytesIO(image_bytes))

        # EasyOCR accepts bytes
        result = ocr_reader.readtext(image_bytes)

        extracted_text = " ".join(detection[1] for detection in result)

        extracted_text = extracted_text.strip()

        if not extracted_text:
            raise HTTPException(
                status_code=400, detail="No text could be detected in the image"
            )

        # Reuse existing prediction logic
        text_input = TextInput(text=extracted_text)

        return predict_emotion(text_input)

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to process image: {str(e)}"
        )

