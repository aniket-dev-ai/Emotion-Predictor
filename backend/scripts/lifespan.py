from fastapi import FastAPI
from keras.models import load_model
import pickle
from contextlib import asynccontextmanager
import easyocr

dl_model = {}

model_path = "Artifacts/BiGru_Model.keras"
tokenizer_path = "Artifacts/tokenizer.pkl"


@asynccontextmanager
async def lifespan(app: FastAPI):
    
    
    print("Loading the Model and Tokenizer...")
    dl_model["BiGRU"] = load_model(model_path)
    with open(tokenizer_path, "rb") as file:
        dl_model["tokenizer"] = pickle.load(file)
    print("Loading OCR model...")
    dl_model["OCR"] = easyocr.Reader(["en"], gpu=False)
    
    print("All models loaded successfully.")
    try:
        yield
    finally:
        dl_model.clear()
