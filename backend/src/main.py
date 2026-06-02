import sys
from pathlib import Path

backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.core.config import settings
from src.shared.job.router import router as jobs_router
from src.features.akwaaba.router import router as akwaaba_router
from src.features.buffalo.router import router as buffalo_router
from src.features.colobus.router import router as colobus_router
from src.features.admin.router import router as admin_router



@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    print("Database connection ready (migrations managed by Alembic)")
    yield
    print("Shutting down...")


app = FastAPI(
    title="GIS Dashboard",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs_router)
app.include_router(akwaaba_router)
app.include_router(buffalo_router)
app.include_router(colobus_router)
app.include_router(admin_router)



@app.get("/")
def root():
    return {"message": "GIS Dashboard Service"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8080, reload=True)