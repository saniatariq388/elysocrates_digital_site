import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import require_admin
from ..db import get_db
from ..models import WorkEntry
from ..schemas import WorkColumnKey, WorkEntryIn, WorkEntryOut

router = APIRouter(prefix="/work-entries", tags=["work-entries"])

COLUMN_ORDER = {"personal": 0, "work": 1, "illustration": 2}


@router.get("", response_model=list[WorkEntryOut])
def list_work_entries(
    column_key: WorkColumnKey | None = None,
    db: Session = Depends(get_db),
) -> list[WorkEntry]:
    query = select(WorkEntry).order_by(WorkEntry.position, WorkEntry.created_at)
    if column_key is not None:
        query = query.where(WorkEntry.column_key == column_key)
    entries = list(db.scalars(query).all())
    entries.sort(key=lambda entry: (COLUMN_ORDER[entry.column_key], entry.position))
    return entries


@router.post(
    "",
    response_model=WorkEntryOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
def create_work_entry(payload: WorkEntryIn, db: Session = Depends(get_db)) -> WorkEntry:
    entry = WorkEntry(**payload.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.put(
    "/{entry_id}",
    response_model=WorkEntryOut,
    dependencies=[Depends(require_admin)],
)
def update_work_entry(
    entry_id: uuid.UUID,
    payload: WorkEntryIn,
    db: Session = Depends(get_db),
) -> WorkEntry:
    entry = db.get(WorkEntry, entry_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="Work entry not found")
    for field, value in payload.model_dump().items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete(
    "/{entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
def delete_work_entry(entry_id: uuid.UUID, db: Session = Depends(get_db)) -> None:
    entry = db.get(WorkEntry, entry_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="Work entry not found")
    db.delete(entry)
    db.commit()
