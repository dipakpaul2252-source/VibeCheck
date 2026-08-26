from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import Optional
import os
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

# Serve static files from the 'static' directory if it exists
if os.path.exists("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
    
    @app.get("/{catchall:path}")
    async def serve_frontend(catchall: str):
        # Prevent catching API, Docs, or Slack routes
        if catchall.startswith("api/") or catchall.startswith("health") or catchall.startswith("docs") or catchall.startswith("redoc") or catchall.startswith("openapi.json"):
            raise HTTPException(status_code=404, detail="Not Found")
            
        file_path = os.path.join("static", catchall)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        return FileResponse("static/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

