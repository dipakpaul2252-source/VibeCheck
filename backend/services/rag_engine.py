import os
import json
from openai import AsyncOpenAI
from typing import Dict, Any, List
from services.vector_store import vector_store
from config import settings

class SarcasticRAGEngine:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    def build_system_prompt(self, intensity: int, subculture: str, context_slang: List[Dict[str, Any]]) -> str:
        context_str = "\n".join([
            f"- '{item.get('term')}': {item.get('definition')} (Origin: {item.get('origin')}, Cringe: {item.get('cringe_score')}%)"
            for item in context_slang
        ])
        return f"""You are an elite, cynical, hyper-fluent Gen Z & Brainrot cultural linguist.
Translate the user's text into high-velocity internet vernacular at Brainrot Level {intensity}/5 using the {subculture} lens.

CURRENT REAL-TIME CONTEXTUAL SLANG FROM DISCOURSE:
{context_str}

TRANSLATION RULES:
1. Level 1 (Casual): Mild, natural slang (lowkey, bet, hits different).
2. Level 2 (Social): Mainstream discourse (delulu, side-eye, rent-free).
3. Level 3 (Hyper-Online): Extreme viral slang (lock in, cooked, crashout, aura points).
4. Level 4 (High Irony): Meta-irony (mewing streak, mogging, copium).
5. Level 5 (Terminal Brainrot): Pure surreal absurdism (skibidi, fanum tax, ohio rizz, level 10 gyatt).

OUTPUT FORMAT: Return strictly a valid JSON object with keys:
- "translated_text": string
- "cringe_score": float (0-100)
- "detected_terms": array of string keywords
- "why_funny_breakdown": string
- "irony_layer": string
- "workplace_safety": "Safe for Work" | "Casual Only" | "Instant HR Meeting" """

    async def execute_rag_translation(
        self,
        text: str,
        intensity: int = 3,
        subculture: str = "universal",
        direction: str = "to_genz"
    ) -> Dict[str, Any]:
        # 1. Retrieve real-time cultural context from Pinecone
        retrieved_context = await vector_store.query_nearest_vibes(text, top_k=3, subculture=subculture)
        
        # 2. Check for mock mode fallback
        if settings.OPENAI_API_KEY == "mock-openai-key":
            if direction == "to_corporate":
                return {
                    "translated_text": "The stakeholder exhibited acute frustration and suffered a reputational setback.",
                    "cringe_score": 15.0,
                    "detected_terms": ["crashout", "aura"],
                    "why_funny_breakdown": "De-cringed into formal corporate vocabulary.",
                    "irony_layer": "Zero irony / sanitized prose.",
                    "workplace_safety": "Safe for Work"
                }
            return {
                "translated_text": "Bro, we lowkey need to lock in on these deliverables before we get cooked no cap fr.",
                "cringe_score": 24.5,
                "detected_terms": ["lock in", "cooked", "no cap"],
                "why_funny_breakdown": "Applies hyper-online productivity imperatives to corporate deadlines.",
                "irony_layer": f"Level {intensity} hyperbolic urgency.",
                "workplace_safety": "Casual Only" if intensity < 4 else "Instant HR Meeting"
            }
            
        # 3. Call LLM with dynamic RAG context injection
        system_prompt = self.build_system_prompt(intensity, subculture, retrieved_context)
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Direction: {direction}. Input Text: '{text}'"}
                ],
                temperature=0.7 + (intensity * 0.05)
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            # Gracefully degrade to mock data in case of OpenAI credit outages
            if direction == "to_corporate":
                return {
                    "translated_text": f"Fallback: Sanitized translation for '{text}'",
                    "cringe_score": 10.0,
                    "detected_terms": [],
                    "why_funny_breakdown": f"Failed calling LLM: {str(e)}. Fallback sanitizer triggered.",
                    "irony_layer": "None.",
                    "workplace_safety": "Safe for Work"
                }
            return {
                "translated_text": f"Fallback: Bro, '{text}' is lowkey cooked.",
                "cringe_score": 40.0,
                "detected_terms": ["cooked", "lowkey"],
                "why_funny_breakdown": f"Failed calling LLM: {str(e)}. Fallback brainrot triggered.",
                "irony_layer": "Meta-irony.",
                "workplace_safety": "Casual Only"
            }

rag_engine = SarcasticRAGEngine()
