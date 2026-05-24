from contextlib import contextmanager, asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import sessionmaker, Session

from src.core.config import settings


def _to_async_url(url: str) -> str:
    return (
        url.replace("postgresql+psycopg2://", "postgresql+asyncpg://")
           .replace("postgresql://", "postgresql+asyncpg://")
    )


# ---------------------------------------------------------------------------
# Async engine + session factory — for FastAPI route handlers
# ---------------------------------------------------------------------------

async_engine = create_async_engine(
    _to_async_url(settings.DATABASE_URL),
    echo=settings.DB_ECHO,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_pre_ping=True,
    pool_recycle=300,
)

AsyncSessionFactory = async_sessionmaker(async_engine, expire_on_commit=False)


# ---------------------------------------------------------------------------
# Sync engine + session factory — for Celery tasks (Celery is not async)
# ---------------------------------------------------------------------------

sync_engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DB_ECHO,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_pre_ping=True,
    pool_recycle=300,
)

SyncSessionFactory = sessionmaker(bind=sync_engine, autocommit=False, autoflush=False)


# ---------------------------------------------------------------------------
# Context managers
# ---------------------------------------------------------------------------

@asynccontextmanager
async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionFactory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


@contextmanager
def get_db() -> Session:
    """For use inside Celery tasks."""
    session = SyncSessionFactory()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# ---------------------------------------------------------------------------
# FastAPI dependency — use with Depends() in route handlers
# ---------------------------------------------------------------------------

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with get_async_db() as session:
        yield session
