"""Application configuration using Pydantic Settings."""

from typing import List, Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application metadata
    app_name: str = Field(default="pushpak-api", alias="APP_NAME")
    app_version: str = Field(default="0.1.0", alias="APP_VERSION")
    environment: str = Field(default="development", alias="ENVIRONMENT")
    debug: bool = Field(default=True, alias="DEBUG")

    # Server configuration
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")

    # CORS configuration
    cors_origins: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173",
        alias="CORS_ORIGINS",
    )

    # PostgreSQL configuration (psycopg 3 dialect: postgresql+psycopg://)
    postgres_user: str = Field(default="postgres", alias="POSTGRES_USER")
    postgres_password: str = Field(default="", alias="POSTGRES_PASSWORD")
    postgres_host: str = Field(default="localhost", alias="POSTGRES_HOST")
    postgres_port: int = Field(default=5432, alias="POSTGRES_PORT")
    postgres_db: str = Field(default="pushpak_db", alias="POSTGRES_DB")

    # Optional direct database URL override
    database_url: Optional[str] = Field(default=None, alias="DATABASE_URL")

    # Connection pool options
    db_pool_size: int = Field(default=5, alias="DB_POOL_SIZE")
    db_max_overflow: int = Field(default=10, alias="DB_MAX_OVERFLOW")
    db_pool_timeout: int = Field(default=30, alias="DB_POOL_TIMEOUT")

    @property
    def cors_origins_list(self) -> List[str]:
        """Convert comma-separated CORS string to a list of allowed origins."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def sync_database_url(self) -> str:
        """Return the SQLAlchemy connection URL with psycopg 3 driver."""
        if self.database_url:
            return self.database_url

        # Build connection URL using psycopg 3
        user = self.postgres_user
        password = f":{self.postgres_password}" if self.postgres_password else ""
        host = self.postgres_host
        port = self.postgres_port
        db = self.postgres_db
        return f"postgresql+psycopg://{user}{password}@{host}:{port}/{db}"


# Singleton instance
settings = Settings()
