import sys
from pathlib import Path

backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from contextlib import asynccontextmanager

# from src.features.jobs.router import router as jobs_router
from src.features.manual_etl_rn.router import router as etl_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    print("Database connection ready (migrations managed by Alembic)")
    yield
    print("Shutting down...")


app = FastAPI(
    title="GIS Automation Service",
    version="1.0.0",
    lifespan=lifespan
)

# app.include_router(jobs_router)
app.include_router(etl_router)


@app.get("/")
def root():
    return {"message": "GIS Job Service"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8080, reload=True)