-- ==============================================================================
-- Migration: Advanced Font Management & Large Media Metadata
-- ==============================================================================

-- 1. Create CUSTOM_FONTS table for uploaded webfonts (.woff2, .woff, .ttf, .otf)
create table if not exists public.custom_fonts (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    family_name text not null,
    file_url text not null,
    format text not null, -- 'woff2', 'woff', 'ttf', 'otf'
    weight text not null default '400',
    style text not null default 'normal',
    active boolean not null default true,
    storage_path text default '',
    size_bytes bigint default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.custom_fonts enable row level security;

-- Policies for custom_fonts
drop policy if exists "Public can read active custom_fonts" on public.custom_fonts;
drop policy if exists "Admins can manage custom_fonts" on public.custom_fonts;

create policy "Public can read active custom_fonts"
    on public.custom_fonts for select
    to public
    using (active = true);

create policy "Admins can manage custom_fonts"
    on public.custom_fonts for all
    to authenticated
    using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- 2. Add extra video metadata columns to MEDIA table if they do not exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'media' and column_name = 'resolution') then
    alter table public.media add column resolution text default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'media' and column_name = 'duration') then
    alter table public.media add column duration numeric default 0;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'media' and column_name = 'width') then
    alter table public.media add column width integer default 0;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'media' and column_name = 'height') then
    alter table public.media add column height integer default 0;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'media' and column_name = 'category') then
    alter table public.media add column category text default 'Other';
  end if;
end $$;

-- 3. Ensure storage policies for fonts and high-definition video assets
-- Fonts and video assets in 'portfolio-media' are publicly viewable and admin-modifiable
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view portfolio-media objects" on storage.objects;
drop policy if exists "Admins can upload to portfolio-media" on storage.objects;
drop policy if exists "Admins can update portfolio-media" on storage.objects;
drop policy if exists "Admins can delete portfolio-media" on storage.objects;

create policy "Public can view portfolio-media objects"
    on storage.objects for select
    to public
    using (bucket_id = 'portfolio-media');

create policy "Admins can upload to portfolio-media"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'portfolio-media');

create policy "Admins can update portfolio-media"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'portfolio-media');

create policy "Admins can delete portfolio-media"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'portfolio-media');

