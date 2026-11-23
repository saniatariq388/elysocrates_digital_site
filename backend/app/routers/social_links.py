import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import require_admin
from ..db import get_db
from ..models import SocialLink
from ..schemas import SocialLinkIn, SocialLinkOut

router = APIRouter(prefix="/social-links", tags=["social-links"])


@router.get("", response_model=list[SocialLinkOut])
def list_social_links(db: Session = Depends(get_db)) -> list[SocialLink]:
    query = select(SocialLink).order_by(SocialLink.position, SocialLink.created_at)
    return list(db.scalars(query).all())


@router.post(
    "",
    response_model=SocialLinkOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
def create_social_link(
    payload: SocialLinkIn, db: Session = Depends(get_db)
) -> SocialLink:
    link = SocialLink(**payload.model_dump())
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


@router.put(
    "/{link_id}",
    response_model=SocialLinkOut,
    dependencies=[Depends(require_admin)],
)
def update_social_link(
    link_id: uuid.UUID,
    payload: SocialLinkIn,
    db: Session = Depends(get_db),
) -> SocialLink:
    link = db.get(SocialLink, link_id)
    if link is None:
        raise HTTPException(status_code=404, detail="Social link not found")
    for field, value in payload.model_dump().items():
        setattr(link, field, value)
    db.commit()
    db.refresh(link)
    return link


@router.delete(
    "/{link_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
def delete_social_link(link_id: uuid.UUID, db: Session = Depends(get_db)) -> None:
    link = db.get(SocialLink, link_id)
    if link is None:
        raise HTTPException(status_code=404, detail="Social link not found")
    db.delete(link)
    db.commit()
