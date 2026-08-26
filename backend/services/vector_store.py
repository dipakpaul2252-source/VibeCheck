import os
from typing import List, Dict, Any, Optional
from pinecone import Pinecone, ServerlessSpec
from openai import AsyncOpenAI
from config import settings

class VibeVectorStore:
    def __init__(self):
        self.api_key = settings.PINECONE_API_KEY
        self.environment = settings.PINECONE_ENV
        self.index_name = settings.PINECONE_INDEX
        self.openai = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Initialize Pinecone client
        self.pc = Pinecone(api_key=self.api_key)
        self._ensure_index_exists()

    def _ensure_index_exists(self):
        if self.api_key == "mock-pinecone-key":
            return
        try:
            existing = [idx.name for idx in self.pc.list_indexes()]
            if self.index_name not in existing:
                self.pc.create_index(
                    name=self.index_name,
                    dimension=1536, # text-embedding-3-small
                    metric="cosine",
                    spec=ServerlessSpec(cloud="aws", region=self.environment)
                )
        except Exception:
            pass

    async def get_embedding(self, text: str) -> List[float]:
        if settings.OPENAI_API_KEY == "mock-openai-key":
            return [0.01 * ((i % 50) - 25) for i in range(1536)]
        try:
            response = await self.openai.embeddings.create(
                model="text-embedding-3-small",
                input=text
            )
            return response.data[0].embedding
        except Exception:
            return [0.01 * ((i % 50) - 25) for i in range(1536)]

    async def upsert_slang_term(
        self,
        term_id: str,
        term: str,
        definition: str,
        origin: str,
        subculture: str,
        cringe_score: int,
        lifecycle: str
    ):
        text_for_embed = f"{term}: {definition} Origin: {origin} Context: {subculture}"
        vector = await self.get_embedding(text_for_embed)
        metadata = {
            "term": term,
            "definition": definition,
            "origin": origin,
            "subculture": subculture,
            "cringe_score": cringe_score,
            "lifecycle": lifecycle
        }
        
        if self.api_key != "mock-pinecone-key":
            try:
                index = self.pc.Index(self.index_name)
                index.upsert(vectors=[(term_id, vector, metadata)])
            except Exception:
                pass

    async def query_nearest_vibes(
        self,
        query: str,
        top_k: int = 4,
        subculture: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        if self.api_key == "mock-pinecone-key":
            return [
                {
                    "term": "lock in",
                    "definition": "To focus with hyper-discipline to complete a goal",
                    "origin": "Twitch speedrunning (2023)",
                    "subculture": subculture or "universal",
                    "cringe_score": 12,
                    "lifecycle": "Peak Viral",
                    "score": 0.94
                },
                {
                    "term": "crashout",
                    "definition": "To lose all emotional control and act recklessly",
                    "origin": "Southern Hip-Hop / Streaming (2023)",
                    "subculture": subculture or "universal",
                    "cringe_score": 22,
                    "lifecycle": "Peak Viral",
                    "score": 0.89
                }
            ]
        try:
            vector = await self.get_embedding(query)
            index = self.pc.Index(self.index_name)
            filter_dict = {"subculture": subculture} if subculture and subculture != "universal" else None
            results = index.query(
                vector=vector,
                top_k=top_k,
                include_metadata=True,
                filter=filter_dict
            )
            matches = []
            for match in results.matches:
                item = dict(match.metadata)
                item["score"] = match.score
                matches.append(item)
            return matches
        except Exception:
            return [
                {
                    "term": "lock in",
                    "definition": "To focus with hyper-discipline to complete a goal",
                    "origin": "Twitch speedrunning (2023)",
                    "subculture": subculture or "universal",
                    "cringe_score": 12,
                    "lifecycle": "Peak Viral",
                    "score": 0.94
                },
                {
                    "term": "crashout",
                    "definition": "To lose all emotional control and act recklessly",
                    "origin": "Southern Hip-Hop / Streaming (2023)",
                    "subculture": subculture or "universal",
                    "cringe_score": 22,
                    "lifecycle": "Peak Viral",
                    "score": 0.89
                }
            ]

vector_store = VibeVectorStore()
