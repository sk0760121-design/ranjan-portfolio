-- ==============================================================================
-- Portfolio & CMS Database Schema for Ranjan Kumar (Video Editor & Filmmaker)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ADMIN USERS (RBAC)
create table if not exists public.admin_users (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade unique,
    email text not null unique,
    role text not null default 'admin',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on admin_users
alter table public.admin_users enable row level security;

-- Policy: Only authenticated users can check if they are in admin_users
create policy "Admins can view admin_users"
    on public.admin_users for select
    to authenticated
    using (auth.uid() = user_id or exists (
        select 1 from public.admin_users au where au.user_id = auth.uid()
    ));

-- 2. SITE SETTINGS (Global Configuration, Colors, Spacing, Typography, Custom Cursor)
create table if not exists public.site_settings (
    id text primary key default 'primary_settings',
    status text not null default 'published', -- 'draft' or 'published'
    theme jsonb not null default '{
        "colors": {
            "background": "#0A0A0A",
            "secondaryBackground": "#151515",
            "primaryText": "#FFFFFF",
            "secondaryText": "#8A8A8A",
            "accent": "#FF2027",
            "border": "#262626",
            "button": "#FF2027",
            "buttonHover": "#E0181F",
            "overlay": "rgba(10, 10, 10, 0.75)"
        },
        "typography": {
            "h1": { "fontSizeDesktop": "84px", "fontSizeTablet": "60px", "fontSizeMobile": "40px", "fontWeight": "800", "lineHeight": "1.05", "letterSpacing": "-0.03em" },
            "h2": { "fontSizeDesktop": "54px", "fontSizeTablet": "42px", "fontSizeMobile": "32px", "fontWeight": "800", "lineHeight": "1.1", "letterSpacing": "-0.02em" },
            "h3": { "fontSizeDesktop": "32px", "fontSizeTablet": "26px", "fontSizeMobile": "22px", "fontWeight": "700", "lineHeight": "1.2", "letterSpacing": "-0.01em" },
            "body": { "fontSizeDesktop": "17px", "fontSizeTablet": "16px", "fontSizeMobile": "15px", "fontWeight": "400", "lineHeight": "1.6", "letterSpacing": "0" }
        },
        "design": {
            "cardRadius": "8px",
            "buttonRadius": "6px",
            "containerWidth": "1280px",
            "sectionSpacingDesktop": "120px",
            "sectionSpacingMobile": "80px",
            "grainIntensity": 3.5,
            "customCursor": true
        },
        "animations": {
            "enabled": true,
            "type": "fade",
            "duration": 0.6,
            "hoverEffects": true
        }
    }'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.site_settings enable row level security;
create policy "Public can read published site_settings" on public.site_settings for select using (true);
create policy "Admins can manage site_settings" on public.site_settings for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 3. SECTIONS CONFIGURATION (Toggles and per-section content)
create table if not exists public.sections (
    id text primary key,
    name text not null,
    enabled boolean not null default true,
    sort_order integer not null default 0,
    content jsonb not null default '{}'::jsonb,
    is_draft boolean not null default false,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.sections enable row level security;
create policy "Public can read sections" on public.sections for select using (true);
create policy "Admins can manage sections" on public.sections for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 4. PROJECTS TABLE
create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    category text not null,
    short_description text not null,
    long_description text default '',
    thumbnail text not null,
    hero_media text default '',
    video text default '',
    video_url text default '',
    instagram_url text default '',
    youtube_url text default '',
    client text default '',
    year text default '2026',
    tags text[] default array[]::text[],
    featured boolean not null default false,
    published boolean not null default true,
    sort_order integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;
create policy "Public can read published projects" on public.projects for select using (published = true);
create policy "Admins can manage projects" on public.projects for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 5. SERVICES TABLE
create table if not exists public.services (
    id uuid primary key default gen_random_uuid(),
    number text not null,
    title text not null,
    description text not null,
    enabled boolean not null default true,
    sort_order integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.services enable row level security;
create policy "Public can read services" on public.services for select using (enabled = true);
create policy "Admins can manage services" on public.services for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 6. SKILLS & SOFTWARE TABLES
create table if not exists public.skills (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text default '',
    enabled boolean not null default true,
    sort_order integer not null default 0
);
alter table public.skills enable row level security;
create policy "Public can read skills" on public.skills for select using (enabled = true);
create policy "Admins can manage skills" on public.skills for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

create table if not exists public.software (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text default '',
    logo_url text default '',
    website_url text default '',
    enabled boolean not null default true,
    sort_order integer not null default 0
);
alter table public.software enable row level security;
create policy "Public can read software" on public.software for select using (enabled = true);
create policy "Admins can manage software" on public.software for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 7. PROCESS STEPS
create table if not exists public.process_steps (
    id uuid primary key default gen_random_uuid(),
    step_number text not null,
    title text not null,
    description text not null,
    enabled boolean not null default true,
    sort_order integer not null default 0
);
alter table public.process_steps enable row level security;
create policy "Public can read process_steps" on public.process_steps for select using (enabled = true);
create policy "Admins can manage process_steps" on public.process_steps for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 8. BEFORE / AFTER COMPARISONS
create table if not exists public.before_after (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text default '',
    before_media text not null,
    after_media text not null,
    media_type text not null default 'image', -- 'image' or 'video'
    initial_slider_position integer not null default 50,
    enabled boolean not null default true,
    sort_order integer not null default 0
);
alter table public.before_after enable row level security;
create policy "Public can read before_after" on public.before_after for select using (enabled = true);
create policy "Admins can manage before_after" on public.before_after for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 9. TESTIMONIALS TABLE
create table if not exists public.testimonials (
    id uuid primary key default gen_random_uuid(),
    quote text not null,
    name text not null,
    role text not null,
    company text default '',
    profile_image text default '',
    published boolean not null default true,
    sort_order integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.testimonials enable row level security;
create policy "Public can read testimonials" on public.testimonials for select using (published = true);
create policy "Admins can manage testimonials" on public.testimonials for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 10. SOCIAL LINKS
create table if not exists public.social_links (
    id uuid primary key default gen_random_uuid(),
    platform text not null,
    label text not null,
    url text not null,
    enabled boolean not null default true,
    sort_order integer not null default 0
);
alter table public.social_links enable row level security;
create policy "Public can read social_links" on public.social_links for select using (enabled = true);
create policy "Admins can manage social_links" on public.social_links for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 11. NAVIGATION ITEMS
create table if not exists public.navigation_items (
    id uuid primary key default gen_random_uuid(),
    label text not null,
    href text not null,
    enabled boolean not null default true,
    sort_order integer not null default 0
);
alter table public.navigation_items enable row level security;
create policy "Public can read navigation_items" on public.navigation_items for select using (enabled = true);
create policy "Admins can manage navigation_items" on public.navigation_items for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 12. MEDIA ASSETS
create table if not exists public.media (
    id uuid primary key default gen_random_uuid(),
    filename text not null,
    file_type text not null, -- 'image' or 'video' or 'audio' or 'document'
    mime_type text not null,
    size_bytes bigint not null default 0,
    url text not null,
    storage_path text not null,
    alt_text text default '',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.media enable row level security;
create policy "Public can read media" on public.media for select using (true);
create policy "Admins can manage media" on public.media for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 13. CONTACT MESSAGES
create table if not exists public.contact_messages (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    project_type text not null,
    budget text default '',
    message text not null,
    status text not null default 'unread', -- 'unread', 'read', 'archived'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.contact_messages enable row level security;
-- Public can INSERT their own message, but CANNOT read others
create policy "Public can submit contact messages" on public.contact_messages for insert to public with check (true);
create policy "Admins can view and manage contact messages" on public.contact_messages for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 14. SEO SETTINGS
create table if not exists public.seo_settings (
    id text primary key default 'primary_seo',
    page_title text not null default 'Ranjan Kumar — Video Editor | Cinematic & Social Media Video Editing',
    meta_description text not null default 'Ranjan Kumar is a freelance video editor specializing in cinematic films, reels, wedding videos, brand content, color grading and sound design.',
    og_title text not null default 'Ranjan Kumar — Video Editor | Cinematic & Social Media Video Editing',
    og_description text not null default 'Ranjan Kumar is a freelance video editor specializing in cinematic films, reels, wedding videos, brand content, color grading and sound design.',
    og_image text default '',
    favicon text default '',
    robots_index boolean not null default true,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.seo_settings enable row level security;
create policy "Public can read seo_settings" on public.seo_settings for select using (true);
create policy "Admins can manage seo_settings" on public.seo_settings for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 15. REVISIONS HISTORY
create table if not exists public.revisions (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    snapshot jsonb not null,
    created_by text default 'admin',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.revisions enable row level security;
create policy "Admins can view and manage revisions" on public.revisions for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- 16. SUPABASE STORAGE BUCKET CONFIGURATION
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

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
