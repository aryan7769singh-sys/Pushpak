"""SQLAlchemy declarative base for PUSHPAK models.

In Phase 1, only the declarative base foundation is established.
No domain tables (airfares, routes, indices) are created in this phase.
Domain models will be created in future milestones after real datasets are inspected.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base declarative class for all future SQLAlchemy models."""
    pass
