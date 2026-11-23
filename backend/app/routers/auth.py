import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from ..auth import create_access_token, require_admin, verify_password
from ..config import settings
from ..db import get_db
from ..models import AdminUser
from ..schemas import LoginIn, TokenOut

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


def _find_admin(db: Session, email: str) -> AdminUser | None:
    try:
        return db.scalar(select(AdminUser).where(AdminUser.email == email))
    except SQLAlchemyError as exc:
        logger.warning(
            "admin_users lookup failed (%s); falling back to ADMIN_PASSWORD_HASH",
            type(exc).__name__,
        )
        db.rollback()
        return None


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)) -> TokenOut:
    email = payload.email.strip().lower()
    user = _find_admin(db, email)

    if user is not None:
        valid = verify_password(payload.password, user.password_hash)
        subject = user.email
    else:
        valid = (
            email == settings.admin_email.strip().lower()
            and verify_password(payload.password, settings.admin_password_hash)
        )
        subject = settings.admin_email.strip().lower()

    if not valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return TokenOut(access_token=create_access_token(subject))


@router.get("/me")
def me(admin_email: str = Depends(require_admin)) -> dict[str, str]:
    return {"email": admin_email}
