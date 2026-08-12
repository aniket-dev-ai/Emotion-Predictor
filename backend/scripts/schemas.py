from pydantic import BaseModel, Field


class TextInput(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="The sentance to analyse",
        json_schema_extra={"example": "I feel so happy and excited"},
    )


class PredictionResponse(BaseModel):
    text: str
    predicted_emotion: str
    confidence: float
    all_probabilities: dict[str, float]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
