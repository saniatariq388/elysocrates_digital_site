from functools import lru_cache

from supabase import Client, create_client

from .config import settings


@lru_cache(maxsize=1)
def get_supabase() -> Client:
    if not settings.supabase_url or not settings.supabase_service_key:
        raise RuntimeError(
            "Supabase Storage is not configured: set SUPABASE_URL and SUPABASE_SERVICE_KEY"
        )
    return create_client(settings.supabase_url, settings.supabase_service_key)


@lru_cache(maxsize=1)
def ensure_bucket() -> None:
    client = get_supabase()
    bucket = settings.supabase_media_bucket
    try:
        client.storage.get_bucket(bucket)
    except Exception:
        client.storage.create_bucket(bucket, options={"public": True})


def public_url(path: str) -> str:
    return get_supabase().storage.from_(settings.supabase_media_bucket).get_public_url(path)


def upload_object(path: str, data: bytes, content_type: str) -> None:
    get_supabase().storage.from_(settings.supabase_media_bucket).upload(
        path, data, {"content-type": content_type}
    )


def remove_object(path: str) -> None:
    get_supabase().storage.from_(settings.supabase_media_bucket).remove([path])
