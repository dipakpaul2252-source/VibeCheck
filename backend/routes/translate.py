from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List
from services.rag_engine import rag_engine

router = APIRouter(prefix="/api/v1")

class TranslationRequest(BaseModel):
    text: str = Field(..., example="We need to optimize our strategy and deliver by Friday.")
    intensity: int = Field(default=3, ge=1, le=5)
    subculture: str = Field(default="universal")
    direction: str = Field(default="to_genz")

class TranslationResponse(BaseModel):
    translated_text: str
    cringe_score: float
    detected_terms: List[str]
    why_funny_breakdown: str
    irony_layer: str
    workplace_safety: str

@router.post("/translate", response_model=TranslationResponse)
async def translate(req: TranslationRequest):
    try:
        result = await rag_engine.execute_rag_translation(
            text=req.text,
            intensity=req.intensity,
            subculture=req.subculture,
            direction=req.direction
        )
        return TranslationResponse(
            translated_text=result.get("translated_text", ""),
            cringe_score=float(result.get("cringe_score", 0.0)),
            detected_terms=result.get("detected_terms", []),
            why_funny_breakdown=result.get("why_funny_breakdown", ""),
            irony_layer=result.get("irony_layer", ""),
            workplace_safety=result.get("workplace_safety", "Casual Only")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
