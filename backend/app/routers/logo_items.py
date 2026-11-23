import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import require_admin
from ..db import get_db
from ..models import LogoItem
from ..schemas import LogoItemIn, LogoItemKind, LogoItemOut

router = APIRouter(prefix="/logo-items", tags=["logo-items"])


@router.get("", response_model=list[LogoItemOut])
def list_logo_items(
    kind: LogoItemKind | None = None,
    db: Session = Depends(get_db),
) -> list[LogoItem]:
    query = select(LogoItem).order_by(LogoItem.position, LogoItem.created_at)
    if kind is not None:
        query = query.where(LogoItem.kind == kind)
    return list(db.scalars(query).all())


@router.post(
    "",
    response_model=LogoItemOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
def create_logo_item(payload: LogoItemIn, db: Session = Depends(get_db)) -> LogoItem:
    item = LogoItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put(
    "/{item_id}",
    response_model=LogoItemOut,
    dependencies=[Depends(require_admin)],
)
def update_logo_item(
    item_id: uuid.UUID,
    payload: LogoItemIn,
    db: Session = Depends(get_db),
) -> LogoItem:
    item = db.get(LogoItem, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Logo item not found")
    for field, value in payload.model_dump().items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete(
    "/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
def delete_logo_item(item_id: uuid.UUID, db: Session = Depends(get_db)) -> None:
    item = db.get(LogoItem, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Logo item not found")
    db.delete(item)
    db.commit()
