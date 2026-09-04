"""Database session and connection management."""

import logging
from typing import Generator, Tuple
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings

logger = logging.getLogger("pushpak.db")

# Create SQLAlchemy engine with connection pooling
# Using psycopg 3 (postgresql+psycopg://...)
engine = create_engine(
    settings.sync_database_url,
    pool_size=settings.db_pool_size,
    max_overflow=settings.db_max_overflow,
    pool_timeout=settings.db_pool_timeout,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency for obtaining a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection(timeout_seconds: float = 3.0) -> Tuple[bool, str]:
    """
    Probe the database with a lightweight query (SELECT 1).
    Returns a tuple of (is_connected: bool, message: str).
    Does not crash if the database is unreachable or credentials are not yet configured.
    """
    try:
        with engine.connect().execution_options(timeout=timeout_seconds) as connection:
            connection.execute(text("SELECT 1;"))
            return True, "connected"
    except SQLAlchemyError as exc:
        err_msg = str(exc.orig) if hasattr(exc, "orig") else str(exc)
        logger.warning(f"Database probe failed: {err_msg}")
        return False, f"unreachable: {err_msg}"
    except Exception as exc:
        logger.warning(f"Unexpected error during database probe: {exc}")
        return False, f"unreachable: {str(exc)}"
