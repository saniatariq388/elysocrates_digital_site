"""Create or update a dashboard admin user with a bcrypt password hash.

Usage (from the backend folder):
    uv run python scripts/create_admin.py
    uv run python scripts/create_admin.py --email admin@elysocrates.digital
"""

import argparse
import getpass
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select  # noqa: E402

from app.auth import hash_password  # noqa: E402
from app.config import settings  # noqa: E402
from app.db import SessionLocal  # noqa: E402
from app.models import AdminUser  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--email", default=settings.admin_email)
    args = parser.parse_args()

    email = args.email.strip().lower()
    password = getpass.getpass("Admin password: ")
    if password != getpass.getpass("Confirm password: "):
        raise SystemExit("Passwords do not match")
    if len(password.encode("utf-8")) > 72:
        raise SystemExit("bcrypt only accepts passwords up to 72 bytes")

    with SessionLocal() as db:
        user = db.scalar(select(AdminUser).where(AdminUser.email == email))
        if user is None:
            db.add(AdminUser(email=email, password_hash=hash_password(password)))
            print(f"Created admin user {email}")
        else:
            user.password_hash = hash_password(password)
            print(f"Updated password for {email}")
        db.commit()


if __name__ == "__main__":
    main()
