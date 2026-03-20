import logging
import sys
from pathlib import Path

def setup_logging():
    """Configure application logging"""
    
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Configure root logger
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            # Console handler
            logging.StreamHandler(sys.stdout),
            # File handler
            logging.FileHandler(log_dir / "app.log"),
        ],
    )
    
    # Set log levels for specific modules
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("fastapi").setLevel(logging.INFO)
    
    logger = logging.getLogger(__name__)
    logger.info("Logging configured successfully")

# Get logger for use in other modules
def get_logger(name: str) -> logging.Logger:
    """Get a logger instance"""
    return logging.getLogger(name)