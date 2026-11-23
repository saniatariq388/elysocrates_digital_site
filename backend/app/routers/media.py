import logging
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import require_admin
from ..config import settings
from ..db import get_db
from ..models import Media
from ..schemas import MediaOut, MediaUpdate
from ..storage import ensure_bucket, public_url, remove_object, upload_object

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/media", tags=["media"])

ALLOWED_TYPES = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/avif": ".avif",
    "image/gif": ".gif",
}


@router.get("", response_model=list[MediaOut])
def list_media(db: Session = Depends(get_db)) -> list[Media]:
    query = select(Media).order_by(Media.created_at.desc())
    return list(db.scalars(query).all())


@router.post(
    "",
    response_model=MediaOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
def upload_media(
    file: UploadFile = File(...),
    alt: str = Form(""),
    db: Session = Depends(get_db),
) -> Media:
    extension = ALLOWED_TYPES.get(file.content_type or "")
    if extension is None:
        raise HTTPException(
            status_code=400,
            detail="Only PNG, JPEG, WebP, AVIF and GIF images are supported",
        )

    data = file.file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    if len(data) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"Image exceeds {settings.max_upload_mb} MB limit",
        )

    path = f"uploads/{uuid.uuid4().hex}{extension}"
    try:
        ensure_bucket()
        upload_object(path, data, file.content_type)
        url = public_url(path)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception:
        logger.exception("Supabase Storage upload failed")
        raise HTTPException(status_code=502, detail="Image upload failed")

    media = Media(path=path, url=url, alt=alt[:200])
    db.add(media)
    db.commit()
    db.refresh(media)
    return media


@router.put(
    "/{media_id}",
    response_model=MediaOut,
    dependencies=[Depends(require_admin)],
)
def update_media(
    media_id: uuid.UUID,
    payload: MediaUpdate,
    db: Session = Depends(get_db),
) -> Media:
    media = db.get(Media, media_id)
    if media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    media.alt = payload.alt
    db.commit()
    db.refresh(media)
    return media


@router.delete(
    "/{media_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
def delete_media(media_id: uuid.UUID, db: Session = Depends(get_db)) -> None:
    media = db.get(Media, media_id)
    if media is None:
        raise HTTPException(status_code=404, detail="Media not found")

    try:
        remove_object(media.path)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception:
        logger.exception("Supabase Storage delete failed")
        raise HTTPException(status_code=502, detail="Image delete failed")

    db.delete(media)
    db.commit()
