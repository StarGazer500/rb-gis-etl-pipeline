from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from src.core.config import settings


# ---------------------------------------------------------------------------
# Factory — builds an (engine, SessionFactory) pair for any DB URL
# ---------------------------------------------------------------------------

def _make_session_factory(url: str) -> sessionmaker:
    engine = create_engine(
        url,
        echo=settings.DB_ECHO,
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW,
        pool_pre_ping=True,
        pool_recycle=300,
    )
    return sessionmaker(bind=engine, autocommit=False, autoflush=False)


# ---------------------------------------------------------------------------
# Session factories — one per database connection
# Add a new line here whenever you add a new DB
# ---------------------------------------------------------------------------

ValidationDbSession = (
    _make_session_factory(settings.VAL_DATABASE_URL)
    if settings.VAL_DATABASE_URL and settings.VAL_DATABASE_URL.startswith("postgresql")
    else None
)

ColobusDbSession = (
    _make_session_factory(settings.COL_DATABASE_URL)
    if settings.COL_DATABASE_URL and settings.COL_DATABASE_URL.startswith("postgresql")
    else None
)

AkwaabaDbSession  = (
    _make_session_factory(settings.AKW_DATABASE_URL)
    if settings.AKW_DATABASE_URL and settings.AKW_DATABASE_URL.startswith("postgresql")
    else None
)

BuffaloDbSession  = (
    _make_session_factory(settings.BUF_DATABASE_URL)
    if settings.BUF_DATABASE_URL and settings.BUF_DATABASE_URL.startswith("postgresql")
    else None
)

TargetDbSession = (
    _make_session_factory(settings.TARGET_DATABASE_URL)
    if settings.TARGET_DATABASE_URL and settings.TARGET_DATABASE_URL.startswith("postgresql")
    else None
)

# ---------------------------------------------------------------------------
# Engines — use directly in Celery tasks when you need {"sync": engine}
# ---------------------------------------------------------------------------



# ---------------------------------------------------------------------------
# Reusable session context (used inside Celery tasks)
# ---------------------------------------------------------------------------

@contextmanager
def get_db(factory: sessionmaker) -> Session:
    """
    Use inside Celery tasks or plain functions:

        with get_db(PrimarySession) as session:
            session.query(...)
    """
    session = factory()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# ---------------------------------------------------------------------------
# FastAPI dependencies — use with Depends() in route handlers
# ---------------------------------------------------------------------------

def get_val_db_session() -> Session:
    if ValidationDbSession is None:
        raise RuntimeError("VALIDATION_DATABASE_URL is not configured")
    with get_db(ValidationDbSession) as session:
        yield session


def get_col_session() -> Session:
    if ColobusDbSession is None:
        raise RuntimeError("COLOBUS_DATABASE_URL is not configured")
    with get_db(ColobusDbSession) as session:
        yield session


def get_akw_session() -> Session:
    if AkwaabaDbSession is None:
        raise RuntimeError("AKWAABA_DATABASE_URL is not configured")
    with get_db(AkwaabaDbSession) as session:
        yield session

def get_buf_session() -> Session:
    if BuffaloDbSession is None:
        raise RuntimeError("BUFFALO_DATABASE_URL is not configured")
    with get_db(BuffaloDbSession) as session:
        yield session