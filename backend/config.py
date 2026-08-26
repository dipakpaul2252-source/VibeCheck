from pydantic import BaseSettings

class Settings(BaseSettings):
    PINECONE_API_KEY: str = "mock-pinecone-key"
    PINECONE_ENV: str = "us-east-1"
    PINECONE_INDEX: str = "vibecheck-embeddings"
    OPENAI_API_KEY: str = "mock-openai-key"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
