from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str
    jwt_secret: str
    admin_email: str
    admin_password_hash: str = ""
    allowed_origins: str = "http://localhost:3001"
    access_token_minutes: int = 480

    # Supabase Storage (image uploads)
    supabase_url: str | None = None
    supabase_service_key: str | None = None
    supabase_media_bucket: str = "media"
    max_upload_mb: int = 8

    @property
    def origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]



settings = Settings()