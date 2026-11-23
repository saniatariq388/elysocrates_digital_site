import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

ArtworkCategory = Literal["concept-art", "illustration"]
WorkColumnKey = Literal["personal", "work", "illustration"]
LogoItemKind = Literal["clients", "projects"]
SocialIcon = Literal["instagram", "x", "facebook", "linkedin", "link"]


class LoginIn(BaseModel):
    email: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ArtworkIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    detail: str = Field(default="", max_length=400)
    category: ArtworkCategory
    image_url: str = Field(min_length=1, max_length=500)
    position: int = 0


class ArtworkOut(ArtworkIn):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class WorkEntryIn(BaseModel):
    column_key: WorkColumnKey
    title: str = Field(min_length=1, max_length=200)
    category: str = Field(default="", max_length=120)
    description: str = ""
    meta: str | None = Field(default=None, max_length=200)
    made_in: str | None = Field(default=None, max_length=120)
    tags: list[str] = Field(default_factory=list)
    position: int = 0


class WorkEntryOut(WorkEntryIn):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class LogoItemIn(BaseModel):
    kind: LogoItemKind
    label: str = Field(min_length=1, max_length=120)
    style: str = Field(default="", max_length=200)
    position: int = 0


class LogoItemOut(LogoItemIn):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class SocialLinkIn(BaseModel):
    label: str = Field(min_length=1, max_length=60)
    href: str = Field(min_length=1, max_length=500)
    icon: SocialIcon = "link"
    position: int = 0


class SocialLinkOut(SocialLinkIn):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class SiteContentField(BaseModel):
    key: str
    label: str
    group: str
    multiline: bool
    value: str


class SiteContentPayload(BaseModel):
    values: dict[str, str]


class MediaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    path: str
    url: str
    alt: str
    created_at: datetime


class MediaUpdate(BaseModel):
    alt: str = Field(default="", max_length=200)
