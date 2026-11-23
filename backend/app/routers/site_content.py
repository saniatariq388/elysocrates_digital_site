from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import require_admin
from ..db import get_db
from ..models import SiteContent
from ..schemas import SiteContentField, SiteContentPayload
from ..site_fields import SITE_FIELDS, SITE_FIELD_KEYS

router = APIRouter(prefix="/site-content", tags=["site-content"])


def _serialize(stored: dict[str, str]) -> list[SiteContentField]:
    return [
        SiteContentField(
            key=str(field["key"]),
            label=str(field["label"]),
            group=str(field["group"]),
            multiline=bool(field["multiline"]),
            value=stored.get(str(field["key"]), str(field["default"])),
        )
        for field in SITE_FIELDS
    ]


def _stored_values(db: Session) -> dict[str, str]:
    return {row.key: row.value for row in db.scalars(select(SiteContent)).all()}


@router.get("", response_model=list[SiteContentField])
def get_site_content(db: Session = Depends(get_db)) -> list[SiteContentField]:
    return _serialize(_stored_values(db))


@router.put(
    "",
    response_model=list[SiteContentField],
    dependencies=[Depends(require_admin)],
)
def update_site_content(
    payload: SiteContentPayload,
    db: Session = Depends(get_db),
) -> list[SiteContentField]:
    unknown = set(payload.values) - SITE_FIELD_KEYS
    if unknown:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown content fields: {', '.join(sorted(unknown))}",
        )

    for key, value in payload.values.items():
        row = db.get(SiteContent, key)
        if row is None:
            db.add(SiteContent(key=key, value=value))
        else:
            row.value = value
    db.commit()

    return _serialize(_stored_values(db))
