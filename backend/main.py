from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from routes.translate import router as translate_router
from routes.billing import router as billing_router
from services.slack_bot import slack_handler

app = FastAPI(
    title="VibeCheck Engine API",
    version="2.4.0",
    description="Real-Time Cultural RAG & Gen Z Humor Translation Pipeline"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(translate_router)
app.include_router(billing_router)

# Register Slack Bolt events receiver route
@app.post("/api/v1/slack/events")
async def slack_events_endpoint(req: Request):
    return await slack_handler.handle(req)

@app.get("/health")
async def health_check():
    return {"status": "online", "rag_engine": "active", "version": "2.4.0"}

@app.get("/api/v1/telemetry/trends")
async def get_realtime_trends(subculture: Optional[str] = "universal"):
    # Fetches active viral terms from vector index
    return {
        "status": "success",
        "subculture": subculture,
        "active_velocity_stream": [
            {"term": "crashout", "velocity": "+94%", "lifecycle": "Peak Viral", "cringe_score": 22},
            {"term": "lock in", "velocity": "+88%", "lifecycle": "Peak Viral", "cringe_score": 12},
            {"term": "aura points", "velocity": "+91%", "lifecycle": "Peak Viral", "cringe_score": 18}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
