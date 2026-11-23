import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import require_admin
from ..db import get_db
from ..models import Artwork
from ..schemas import ArtworkCategory, ArtworkIn, ArtworkOut

router = APIRouter(prefix="/artworks", tags=["artworks"])


@router.get("", response_model=list[ArtworkOut])
def list_artworks(
    category: ArtworkCategory | None = None,
    db: Session = Depends(get_db),
) -> list[Artwork]:
    query = select(Artwork).order_by(Artwork.position, Artwork.created_at)
    if category is not None:
        query = query.where(Artwork.category == category)
    return list(db.scalars(query).all())


@router.post(
    "",
    response_model=ArtworkOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
def create_artwork(payload: ArtworkIn, db: Session = Depends(get_db)) -> Artwork:
    artwork = Artwork(**payload.model_dump())
    db.add(artwork)
    db.commit()
    db.refresh(artwork)
    return artwork


@router.put(
    "/{artwork_id}",
    response_model=ArtworkOut,
    dependencies=[Depends(require_admin)],
)
def update_artwork(
    artwork_id: uuid.UUID,
    payload: ArtworkIn,
    db: Session = Depends(get_db),
) -> Artwork:
    artwork = db.get(Artwork, artwork_id)
    if artwork is None:
        raise HTTPException(status_code=404, detail="Artwork not found")
    for field, value in payload.model_dump().items():
        setattr(artwork, field, value)
    db.commit()
    db.refresh(artwork)
    return artwork


@router.delete(
    "/{artwork_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
def delete_artwork(artwork_id: uuid.UUID, db: Session = Depends(get_db)) -> None:
    artwork = db.get(Artwork, artwork_id)
    if artwork is None:
        raise HTTPException(status_code=404, detail="Artwork not found")
    db.delete(artwork)
    db.commit()
