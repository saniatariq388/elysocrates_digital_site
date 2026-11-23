import uuid
from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Integer,
    JSON,
    String,
    Text,
    Uuid,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base

TagsColumn = JSON().with_variant(JSONB, "postgresql")


class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(200), unique=True)
    password_hash: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Artwork(Base):
    __tablename__ = "artworks"
    __table_args__ = (
        CheckConstraint(
            "category in ('concept-art', 'illustration')",
            name="artworks_category_check",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(200))
    detail: Mapped[str] = mapped_column(String(400), default="")
    category: Mapped[str] = mapped_column(String(32))
    image_url: Mapped[str] = mapped_column(String(500))
    position: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class WorkEntry(Base):
    __tablename__ = "work_entries"
    __table_args__ = (
        CheckConstraint(
            "column_key in ('personal', 'work', 'illustration')",
            name="work_entries_column_key_check",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    column_key: Mapped[str] = mapped_column(String(32))
    title: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(120), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    meta: Mapped[str | None] = mapped_column(String(200), nullable=True)
    made_in: Mapped[str | None] = mapped_column(String(120), nullable=True)
    tags: Mapped[list[str]] = mapped_column(TagsColumn, default=list)
    position: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class LogoItem(Base):
    __tablename__ = "logo_items"
    __table_args__ = (
        CheckConstraint(
            "kind in ('clients', 'projects')",
            name="logo_items_kind_check",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    kind: Mapped[str] = mapped_column(String(16))
    label: Mapped[str] = mapped_column(String(120))
    style: Mapped[str] = mapped_column(String(200), default="")
    position: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class SocialLink(Base):
    __tablename__ = "social_links"
    __table_args__ = (
        CheckConstraint(
            "icon in ('instagram', 'x', 'facebook', 'linkedin', 'link')",
            name="social_links_icon_check",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    label: Mapped[str] = mapped_column(String(60))
    href: Mapped[str] = mapped_column(String(500))
    icon: Mapped[str] = mapped_column(String(20), default="link")
    position: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class SiteContent(Base):
    __tablename__ = "site_content"

    key: Mapped[str] = mapped_column(String(80), primary_key=True)
    value: Mapped[str] = mapped_column(Text, default="")
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Media(Base):
    __tablename__ = "media"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    path: Mapped[str] = mapped_column(String(300), unique=True)
    url: Mapped[str] = mapped_column(String(600))
    alt: Mapped[str] = mapped_column(String(200), default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
