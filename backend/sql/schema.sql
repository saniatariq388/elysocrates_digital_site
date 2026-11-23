-- Run this in the Supabase SQL editor (or psql) once.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  detail text not null default '',
  category text not null check (category in ('concept-art', 'illustration')),
  image_url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_entries (
  id uuid primary key default gen_random_uuid(),
  column_key text not null check (column_key in ('personal', 'work', 'illustration')),
  title text not null,
  category text not null default '',
  description text not null default '',
  meta text,
  made_in text,
  tags jsonb not null default '[]'::jsonb,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artworks_category_position_idx
  on public.artworks (category, position);

create index if not exists work_entries_column_position_idx
  on public.work_entries (column_key, position);

create table if not exists public.logo_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('clients', 'projects')),
  label text not null,
  style text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  icon text not null default 'link'
    check (icon in ('instagram', 'x', 'facebook', 'linkedin', 'link')),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  url text not null,
  alt text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists logo_items_kind_position_idx
  on public.logo_items (kind, position);

create index if not exists social_links_position_idx
  on public.social_links (position);

create index if not exists media_created_at_idx
  on public.media (created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists artworks_set_updated_at on public.artworks;
create trigger artworks_set_updated_at
  before update on public.artworks
  for each row execute function public.set_updated_at();

drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at
  before update on public.admin_users
  for each row execute function public.set_updated_at();

drop trigger if exists work_entries_set_updated_at on public.work_entries;
create trigger work_entries_set_updated_at
  before update on public.work_entries
  for each row execute function public.set_updated_at();

drop trigger if exists logo_items_set_updated_at on public.logo_items;
create trigger logo_items_set_updated_at
  before update on public.logo_items
  for each row execute function public.set_updated_at();

drop trigger if exists social_links_set_updated_at on public.social_links;
create trigger social_links_set_updated_at
  before update on public.social_links
  for each row execute function public.set_updated_at();

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

-- The FastAPI backend connects with database credentials and enforces auth
-- itself, so Row Level Security is enabled without permissive policies.
alter table public.artworks enable row level security;
alter table public.admin_users enable row level security;
alter table public.work_entries enable row level security;
alter table public.logo_items enable row level security;
alter table public.social_links enable row level security;
alter table public.site_content enable row level security;
alter table public.media enable row level security;
