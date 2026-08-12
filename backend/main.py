from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from scripts.schemas import HealthResponse, PredictionResponse, TextInput
from scripts.api_endpoints import (
    healthcheck,
    predict_emotion,
    predict_emotion_from_image,
)
from scripts.lifespan import lifespan

app = FastAPI(lifespan=lifespan)


@app.get("/")
def greet():
    return {"message": "Emotion Prediction API is running"}


emotion_emojis = {
    "sadness": "😢",
    "joy": "😊",
    "love": "❤️",
    "anger": "😠",
    "fear": "😨",
    "surprise": "😲",
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health():
    return healthcheck()


@app.post("/predict", response_model=PredictionResponse)
def predict(text_input: TextInput):
    return predict_emotion(text_input)


@app.post("/predict-image", response_model=PredictionResponse)
def predict_image(image: UploadFile = File(...)):
    return predict_emotion_from_image(image)
