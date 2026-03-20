from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App
    APP_NAME: str = "GIS Automation Service"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Databases
    VAL_DATABASE_URL: str
    COL_DATABASE_URL: str = ""
    AKW_DATABASE_URL: str = ""
    BUF_DATABASE_URL: str = ""
    TARGET_DATABASE_URL: str = ""
    DB_ECHO: bool = False
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS

    # Redis
    REDIS_URL: str 
    
    # Email
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: str
    SMTP_PASSWORD: str
    
   
   
    # AWS
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    S3_BUCKET_NAME: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields in .env

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()