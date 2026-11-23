"""Generate a bcrypt hash for ADMIN_PASSWORD_HASH.

Usage:
    python scripts/hash_password.py
"""

import getpass

import bcrypt


def main() -> None:
    password = getpass.getpass("Admin password: ")
    confirm = getpass.getpass("Confirm password: ")
    if password != confirm:
        raise SystemExit("Passwords do not match")
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    print(hashed.decode("utf-8"))


if __name__ == "__main__":
    main()
