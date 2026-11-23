from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import (
    artworks,
    auth,
    logo_items,
    media,
    site_content,
    social_links,
    work_entries,
)

app = FastAPI(title="Elysocrates Content API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(artworks.router)
app.include_router(work_entries.router)
app.include_router(logo_items.router)
app.include_router(social_links.router)
app.include_router(site_content.router)
app.include_router(media.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
