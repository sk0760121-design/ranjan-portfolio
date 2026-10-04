-- ==============================================================================
-- Portfolio & CMS Database Schema for Ranjan Kumar (Video Editor & Filmmaker)
-- One Complete Script to Run in Supabase SQL Editor
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ADMIN USERS TABLE (Role-Based Access Control)
create table if not exists public.admin_users (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade unique,
    email text not null unique,
    role text not null default 'admin',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on admin_users
alter table public.admin_users enable row level security;

-- Drop existing policies if any
drop policy if exists "Admins can view admin_users" on public.admin_users;
drop policy if exists "Admins can insert admin_users" on public.admin_users;
drop policy if exists "Admins can update admin_users" on public.admin_users;
drop policy if exists "Admins can delete admin_users" on public.admin_users;

create policy "Admins can view admin_users"
    on public.admin_users for select
    to authenticated
    using (auth.uid() = user_id or exists (
        select 1 from public.admin_users au where au.user_id = auth.uid()
    ));

create policy "Admins can insert admin_users"
    on public.admin_users for insert
    to authenticated
    with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Admins can update admin_users"
    on public.admin_users for update
    to authenticated
    using (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Admins can delete admin_users"
    on public.admin_users for delete
    to authenticated
    using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Automatically grant admin privileges to owner emails upon registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if lower(new.email) in ('sk0760121@gmail.com', 'ranjan.cinematicx@gmail.com', 'admin@ranjankumar.com') then
    insert into public.admin_users (user_id, email, role)
    values (new.id, lower(new.email), 'admin')
    on conflict (email) do update set user_id = new.id, role = 'admin';
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Also link any existing auth user with owner email
insert into public.admin_users (user_id, email, role)
select id, lower(email), 'admin'
from auth.users
where lower(email) in ('sk0760121@gmail.com', 'ranjan.cinematicx@gmail.com', 'admin@ranjankumar.com')
on conflict (email) do update set user_id = excluded.user_id, role = 'admin';

-- Pre-seed admin_users with placeholder if auth user not created yet
insert into public.admin_users (id, email, role)
values 
  ('a0000000-0000-0000-0000-000000000001', 'sk0760121@gmail.com', 'admin'),
  ('a0000000-0000-0000-0000-000000000002', 'ranjan.cinematicx@gmail.com', 'admin')
on conflict (email) do nothing;


-- 2. SITE SETTINGS (Theme, Colors, Typography, Layout, Custom Cursor)
create table if not exists public.site_settings (
    id text primary key default 'primary_settings',
    status text not null default 'published',
    theme jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.site_settings enable row level security;
drop policy if exists "Public can read published site_settings" on public.site_settings;
drop policy if exists "Admins can manage site_settings" on public.site_settings;

create policy "Public can read published site_settings" on public.site_settings for select using (true);
create policy "Admins can manage site_settings" on public.site_settings for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);


-- 3. SECTIONS CONFIGURATION (15 Sections with Enabled Toggles)
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
drop policy if exists "Public can read sections" on public.sections;
drop policy if exists "Admins can manage sections" on public.sections;

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
drop policy if exists "Public can read published projects" on public.projects;
drop policy if exists "Admins can manage projects" on public.projects;

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
drop policy if exists "Public can read services" on public.services;
drop policy if exists "Admins can manage services" on public.services;

create policy "Public can read services" on public.services for select using (enabled = true);
create policy "Admins can manage services" on public.services for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);


-- 6. SKILLS & SOFTWARE
create table if not exists public.skills (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text default '',
    enabled boolean not null default true,
    sort_order integer not null default 0
);
alter table public.skills enable row level security;
drop policy if exists "Public can read skills" on public.skills;
drop policy if exists "Admins can manage skills" on public.skills;
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
drop policy if exists "Public can read software" on public.software;
drop policy if exists "Admins can manage software" on public.software;
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
drop policy if exists "Public can read process_steps" on public.process_steps;
drop policy if exists "Admins can manage process_steps" on public.process_steps;
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
    media_type text not null default 'image',
    initial_slider_position integer not null default 50,
    enabled boolean not null default true,
    sort_order integer not null default 0
);
alter table public.before_after enable row level security;
drop policy if exists "Public can read before_after" on public.before_after;
drop policy if exists "Admins can manage before_after" on public.before_after;
create policy "Public can read before_after" on public.before_after for select using (enabled = true);
create policy "Admins can manage before_after" on public.before_after for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);


-- 9. TESTIMONIALS
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
drop policy if exists "Public can read testimonials" on public.testimonials;
drop policy if exists "Admins can manage testimonials" on public.testimonials;
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
drop policy if exists "Public can read social_links" on public.social_links;
drop policy if exists "Admins can manage social_links" on public.social_links;
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
drop policy if exists "Public can read navigation_items" on public.navigation_items;
drop policy if exists "Admins can manage navigation_items" on public.navigation_items;
create policy "Public can read navigation_items" on public.navigation_items for select using (enabled = true);
create policy "Admins can manage navigation_items" on public.navigation_items for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);


-- 12. MEDIA ASSETS
create table if not exists public.media (
    id uuid primary key default gen_random_uuid(),
    filename text not null,
    file_type text not null,
    mime_type text not null,
    size_bytes bigint not null default 0,
    url text not null,
    storage_path text not null,
    alt_text text default '',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.media enable row level security;
drop policy if exists "Public can read media" on public.media;
drop policy if exists "Admins can manage media" on public.media;
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
    status text not null default 'unread',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.contact_messages enable row level security;
drop policy if exists "Public can submit contact messages" on public.contact_messages;
drop policy if exists "Admins can view and manage contact messages" on public.contact_messages;

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
drop policy if exists "Public can read seo_settings" on public.seo_settings;
drop policy if exists "Admins can manage seo_settings" on public.seo_settings;
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
drop policy if exists "Admins can view and manage revisions" on public.revisions;
create policy "Admins can view and manage revisions" on public.revisions for all to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
);


-- 16. STORAGE BUCKET CONFIGURATION (portfolio-media)
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


-- ==============================================================================
-- 17. INITIAL SEED DATA INSERTION
-- ==============================================================================

-- Site Settings
insert into public.site_settings (id, status, theme)
values (
  'primary_settings',
  'published',
  '{
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
      "h1": { "fontSizeDesktop": "84px", "fontSizeTablet": "60px", "fontSizeMobile": "40px", "fontWeight": "800", "lineHeight": "1.02", "letterSpacing": "-0.03em", "textTransform": "uppercase" },
      "h2": { "fontSizeDesktop": "52px", "fontSizeTablet": "40px", "fontSizeMobile": "30px", "fontWeight": "800", "lineHeight": "1.1", "letterSpacing": "-0.02em", "textTransform": "uppercase" },
      "h3": { "fontSizeDesktop": "28px", "fontSizeTablet": "24px", "fontSizeMobile": "20px", "fontWeight": "700", "lineHeight": "1.2", "letterSpacing": "-0.01em" },
      "h4": { "fontSizeDesktop": "20px", "fontSizeTablet": "18px", "fontSizeMobile": "16px", "fontWeight": "600", "lineHeight": "1.3", "letterSpacing": "0" },
      "body": { "fontSizeDesktop": "17px", "fontSizeTablet": "16px", "fontSizeMobile": "15px", "fontWeight": "400", "lineHeight": "1.65", "letterSpacing": "0" },
      "small": { "fontSizeDesktop": "13px", "fontSizeTablet": "12px", "fontSizeMobile": "12px", "fontWeight": "500", "lineHeight": "1.4", "letterSpacing": "0.05em", "textTransform": "uppercase" },
      "button": { "fontSizeDesktop": "14px", "fontSizeTablet": "14px", "fontSizeMobile": "13px", "fontWeight": "600", "lineHeight": "1", "letterSpacing": "0.04em", "textTransform": "uppercase" },
      "label": { "fontSizeDesktop": "12px", "fontSizeTablet": "12px", "fontSizeMobile": "11px", "fontWeight": "600", "lineHeight": "1", "letterSpacing": "0.1em", "textTransform": "uppercase" }
    },
    "design": {
      "cardRadius": "8px",
      "buttonRadius": "4px",
      "containerWidth": "1280px",
      "sectionSpacingDesktop": "110px",
      "sectionSpacingMobile": "70px",
      "grainIntensity": 3.5,
      "customCursor": true
    },
    "animations": {
      "enabled": true,
      "type": "fade",
      "duration": 0.6,
      "hoverEffects": true
    }
  }'::jsonb
)
on conflict (id) do nothing;

-- Sections
insert into public.sections (id, name, enabled, sort_order, content)
values
  ('hero', 'Hero', true, 1, '{
    "tagline": "VIDEO EDITOR · FILMMAKER · STORYTELLER",
    "headingLine1": "I EDIT",
    "headingLine2": "STORIES THAT",
    "headingLine3": "MAKE PEOPLE",
    "headingHighlight": "STOP SCROLLING.",
    "supportingCopy": "I''m Ranjan Kumar, a video editor focused on cinematic storytelling, engaging short-form content and polished visual experiences.",
    "primaryButtonText": "WATCH SHOWREEL",
    "primaryButtonUrl": "#showreel",
    "secondaryButtonText": "VIEW MY WORK",
    "secondaryButtonUrl": "#work",
    "locationText": "Based in India · Available Worldwide",
    "backgroundType": "video",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "posterUrl": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80",
    "overlayOpacity": 0.65,
    "autoplay": true,
    "muted": true,
    "loop": true
  }'::jsonb),
  ('intro', 'Intro Statement', true, 2, '{
    "label": "A LITTLE ABOUT MY WORK",
    "statement": "GOOD EDITING ISN''T ABOUT ADDING MORE.\nIT''S ABOUT KNOWING WHAT TO REMOVE.",
    "description": "From the first cut to the final sound design, I focus on pacing, emotion and visual storytelling — turning raw footage into content people actually want to watch."
  }'::jsonb),
  ('work', 'Selected Work', true, 3, '{
    "heading": "SELECTED\nWORK",
    "description": "A collection of projects I''ve edited across cinematic films, short-form content, weddings and branded videos."
  }'::jsonb),
  ('results', 'Results & Metrics', true, 4, '{
    "heading": "THE EDIT\nIS ONLY HALF\nTHE STORY.",
    "stats": [
      { "value": "100K+", "label": "Views generated", "id": "1" },
      { "value": "140K+", "label": "Highest-performing project", "id": "2" },
      { "value": "4+", "label": "Editing categories", "id": "3" },
      { "value": "∞", "label": "Frames perfected", "id": "4" }
    ]
  }'::jsonb),
  ('services', 'Services', true, 5, '{
    "heading": "SERVICES",
    "subheading": "What I bring to your visual productions"
  }'::jsonb),
  ('skills', 'Skills & Capabilities', true, 6, '{
    "heading": "CORE CAPABILITIES",
    "subheading": "Technical finesse paired with directorial intuition"
  }'::jsonb),
  ('software', 'Software Stack', true, 7, '{
    "heading": "TOOLKIT",
    "subheading": "Industry standard tools calibrated for speed and color accuracy"
  }'::jsonb),
  ('process', 'Creative Process', true, 8, '{
    "heading": "PROCESS",
    "subheading": "From raw rushes to pixel-perfect master delivery"
  }'::jsonb),
  ('before_after', 'Before / After Grade', true, 9, '{
    "heading": "COLOR & POLISH",
    "subheading": "Slide to inspect the raw camera log vs. final cinematic grade"
  }'::jsonb),
  ('testimonials', 'Testimonials', true, 10, '{
    "heading": "WHAT CREATORS SAY",
    "subheading": "Collaborations with directors, agencies and content creators"
  }'::jsonb),
  ('about', 'About Ranjan', true, 11, '{
    "heading": "HEY, I''M RANJAN.",
    "paragraph1": "I''m a video editor passionate about turning ordinary footage into engaging visual stories.",
    "paragraph2": "My approach combines clean editing, cinematic visuals, strong pacing and thoughtful sound design. Whether it''s a 30-second reel or a full wedding film, I believe every frame should have a purpose.",
    "location": "Based in India · Working Worldwide",
    "buttonText": "GET IN TOUCH",
    "buttonUrl": "#contact",
    "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
  }'::jsonb),
  ('philosophy', 'Editing Philosophy', true, 12, '{
    "statement": "EVERY\nFRAME\nSHOULD\nEARN ITS\nPLACE.",
    "subtext1": "No unnecessary cuts. No meaningless effects.",
    "subtext2": "Just intentional storytelling."
  }'::jsonb),
  ('cta', 'Final Call to Action', true, 13, '{
    "overhead": "HAVE A PROJECT IN MIND?",
    "heading": "LET''S MAKE\nSOMETHING\nPEOPLE\nREMEMBER.",
    "primaryButtonText": "START A PROJECT",
    "primaryButtonUrl": "#contact",
    "secondaryButtonText": "WATCH SHOWREEL",
    "secondaryButtonUrl": "#showreel"
  }'::jsonb),
  ('contact', 'Contact Form', true, 14, '{
    "heading": "LET''S TALK.",
    "description": "Tell me what you''re working on, what you need edited, and where you want your content to go.",
    "email": "ranjan.cinematicx@gmail.com",
    "responseTime": "Usually replies within 24 hours"
  }'::jsonb),
  ('footer', 'Footer', true, 15, '{
    "logo": "RANJAN.",
    "tagline": "Video Editor · Filmmaker · Storyteller",
    "copyright": "© 2026 Ranjan Kumar. All rights reserved.",
    "note": "Designed & edited with intention."
  }'::jsonb)
on conflict (id) do nothing;

-- Projects
insert into public.projects (id, title, slug, category, short_description, long_description, thumbnail, hero_media, video, client, year, tags, featured, published, sort_order)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'THE HIMALAYAN ODYSSEY',
    'the-himalayan-odyssey',
    'Cinematic Film',
    'A poetic cinematic short film capturing high-altitude solitude and human endurance across Spiti Valley.',
    'Edited from 48 hours of 4K Sony FX6 footage. The challenge was building an emotional cadence that mirrored the harsh winds and silence of the Himalayan mountain passes. Involves extensive sound design with organic Foley and customized LUT-based color grading for cold, crisp high-latitude lighting.',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'Mountain Expedition Co.',
    '2026',
    array['Cinematic', 'Documentary', 'Color Grading', 'Sound Design'],
    true,
    true,
    1
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'PULSE OF TOKYO: HYPER-PACED REEL',
    'pulse-of-tokyo-hyper-reel',
    'Short Form',
    'High-retention, beat-synced travel reel designed for viral social engagement with seamless match cuts.',
    'Crafted specifically for mobile vertical retention. Uses kinetic typography, speed ramps, and seamless whip transitions to keep view duration above 94% across Instagram Reels and TikTok.',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1920&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'Urban Nomad',
    '2026',
    array['Short Form', 'Speed Ramps', 'Sound FX', 'Viral Hook'],
    true,
    true,
    2
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'ETERNAL VOWS: A ROYAL RAJASTHAN WEDDING',
    'eternal-vows-rajasthan-wedding',
    'Wedding Film',
    'An intimate, cinematic documentary of a heritage palace wedding in Udaipur blending raw emotion with grandeur.',
    'A 12-minute documentary-style wedding film featuring non-linear narrative, emotional vows voiceover mixing, warm vintage cinematic palette, and bespoke Indian instrumental cues.',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'Aarav & Meera',
    '2025',
    array['Wedding', 'Storytelling', 'Vocal Design', 'Emotional'],
    true,
    true,
    3
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'AURA: LUXURY TIMEPIECE CAMPAIGN',
    'aura-luxury-timepiece-campaign',
    'Brand Videos',
    'A sharp, minimal commercial edit highlighting micro-details and craftsmanship with mechanical soundscapes.',
    'Crafted for luxury retail and digital ad campaigns. Synchronized close-up macro shots with authentic tick-tock audio and deep cinematic bass swells.',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1920&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    'Chrono Lux Watches',
    '2025',
    array['Commercial', 'Brand Video', 'Macro', 'Sound FX'],
    false,
    true,
    4
  )
on conflict (slug) do nothing;

-- Services
insert into public.services (id, number, title, description, enabled, sort_order)
values
  ('10000000-0000-0000-0000-000000000001', '01', 'SHORT FORM', 'Reels, Shorts and social-first videos designed around pacing, hooks and retention.', true, 1),
  ('10000000-0000-0000-0000-000000000002', '02', 'CINEMATIC FILMS', 'Story-driven edits with cinematic pacing, color and sound design.', true, 2),
  ('10000000-0000-0000-0000-000000000003', '03', 'WEDDING FILMS', 'Emotional wedding films that turn real moments into timeless stories.', true, 3),
  ('10000000-0000-0000-0000-000000000004', '04', 'BRAND VIDEOS', 'Clean, polished edits designed to communicate your brand with impact.', true, 4),
  ('10000000-0000-0000-0000-000000000005', '05', 'SOCIAL MEDIA CONTENT', 'Fast, engaging edits built for modern social platforms.', true, 5),
  ('10000000-0000-0000-0000-000000000006', '06', 'VIDEO ENHANCEMENT', 'Professional finishing that takes existing footage to the next level.', true, 6)
on conflict (id) do nothing;

-- Skills
insert into public.skills (id, name, description, enabled, sort_order)
values
  ('20000000-0000-0000-0000-000000000001', 'STORYTELLING', 'Narrative arc & emotional beats', true, 1),
  ('20000000-0000-0000-0000-000000000002', 'CUTTING & PACING', 'Micro-timing and rhythm', true, 2),
  ('20000000-0000-0000-0000-000000000003', 'COLOR GRADING', 'LUTs, ACES & film stock emulations', true, 3),
  ('20000000-0000-0000-0000-000000000004', 'SOUND DESIGN', 'Foley, risers, ambient layering & mix', true, 4),
  ('20000000-0000-0000-0000-000000000005', 'MOTION GRAPHICS', 'Clean titles, lower thirds & 2D motion', true, 5),
  ('20000000-0000-0000-0000-000000000006', 'SOCIAL MEDIA EDITING', 'Hook optimization & retention graphs', true, 6),
  ('20000000-0000-0000-0000-000000000007', 'CINEMATIC EDITING', 'Wide aspect framing & narrative depth', true, 7),
  ('20000000-0000-0000-0000-000000000008', 'VISUAL POLISH', 'Stabilization, noise reduction & clean-up', true, 8)
on conflict (id) do nothing;

-- Software
insert into public.software (id, name, description, logo_url, website_url, enabled, sort_order)
values
  ('30000000-0000-0000-0000-000000000001', 'Adobe Premiere Pro', 'Primary timeline & rough-cut to fine-cut assembly', 'https://api.iconify.design/simple-icons:adobepremierepro.svg?color=%239999FF', 'https://adobe.com/products/premiere', true, 1),
  ('30000000-0000-0000-0000-000000000002', 'Adobe After Effects', 'Motion graphics, kinetic type, VFX tracking and cleanup', 'https://api.iconify.design/simple-icons:adobeaftereffects.svg?color=%239999FF', 'https://adobe.com/products/aftereffects', true, 2),
  ('30000000-0000-0000-0000-000000000003', 'DaVinci Resolve', 'Color science, node-based grading and Fairlight audio finishing', 'https://api.iconify.design/simple-icons:davinciresolve.svg?color=%23FF5555', 'https://blackmagicdesign.com/products/davinciresolve', true, 3),
  ('30000000-0000-0000-0000-000000000004', 'CapCut', 'Rapid mobile delivery and trending social media sound tracking', 'https://api.iconify.design/simple-icons:capcut.svg?color=%23FFFFFF', 'https://capcut.com', true, 4)
on conflict (id) do nothing;

-- Process Steps
insert into public.process_steps (id, step_number, title, description, enabled, sort_order)
values
  ('40000000-0000-0000-0000-000000000001', '01', 'DISCOVER', 'We understand the footage, audience and goal.', true, 1),
  ('40000000-0000-0000-0000-000000000002', '02', 'STRUCTURE', 'I find the strongest moments and build the story.', true, 2),
  ('40000000-0000-0000-0000-000000000003', '03', 'EDIT', 'Pacing, transitions and visual rhythm come together.', true, 3),
  ('40000000-0000-0000-0000-000000000004', '04', 'POLISH', 'Color grading, sound design and motion bring the edit to life.', true, 4),
  ('40000000-0000-0000-0000-000000000005', '05', 'DELIVER', 'Final quality-controlled export, ready for your platform.', true, 5)
on conflict (id) do nothing;

-- Before / After
insert into public.before_after (id, title, description, before_media, after_media, media_type, initial_slider_position, enabled, sort_order)
values
  ('50000000-0000-0000-0000-000000000001', 'LOG Camera Profile vs. Final Film Stock Emulation', 'Flat, desaturated RAW log profile converted into a rich 35mm warm tone with highlight roll-off.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=30', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=90', 'image', 50, true, 1)
on conflict (id) do nothing;

-- Testimonials
insert into public.testimonials (id, quote, name, role, company, profile_image, published, sort_order)
values
  ('60000000-0000-0000-0000-000000000001', 'Ranjan has an instinctive sense of pacing. He turned 30 hours of raw travel footage into our best-performing short film of the year.', 'Arjun Mehta', 'Creative Director', 'Apex Media Studio', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', true, 1),
  ('60000000-0000-0000-0000-000000000002', 'Our social reels retention skyrocketed by 40% after Ranjan reworked our hooks and audio design. Pure professionalism.', 'Sarah Jenkins', 'Brand Lead', 'Verve Lifestyle', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', true, 2)
on conflict (id) do nothing;

-- Social Links
insert into public.social_links (id, platform, label, url, enabled, sort_order)
values
  ('70000000-0000-0000-0000-000000000001', 'Instagram', '@the_digital.ranjan', 'https://instagram.com/the_digital.ranjan', true, 1),
  ('70000000-0000-0000-0000-000000000002', 'Instagram (Cinematic)', '@ranjan.cinematicx', 'https://instagram.com/ranjan.cinematicx', true, 2),
  ('70000000-0000-0000-0000-000000000003', 'YouTube', 'YouTube Channel', 'https://youtube.com', true, 3),
  ('70000000-0000-0000-0000-000000000004', 'WhatsApp', 'Chat on WhatsApp', 'https://wa.me/919999999999', true, 4),
  ('70000000-0000-0000-0000-000000000005', 'Email', 'ranjan.cinematicx@gmail.com', 'mailto:ranjan.cinematicx@gmail.com', true, 5)
on conflict (id) do nothing;

-- Navigation Items
insert into public.navigation_items (id, label, href, enabled, sort_order)
values
  ('80000000-0000-0000-0000-000000000001', 'WORK', '#work', true, 1),
  ('80000000-0000-0000-0000-000000000002', 'ABOUT', '#about', true, 2),
  ('80000000-0000-0000-0000-000000000003', 'SERVICES', '#services', true, 3),
  ('80000000-0000-0000-0000-000000000004', 'PROCESS', '#process', true, 4),
  ('80000000-0000-0000-0000-000000000005', 'CONTACT', '#contact', true, 5)
on conflict (id) do nothing;

-- SEO Settings
insert into public.seo_settings (id, page_title, meta_description, og_title, og_description, og_image, favicon, robots_index)
values (
  'primary_seo',
  'Ranjan Kumar — Video Editor | Cinematic & Social Media Video Editing',
  'Ranjan Kumar is a freelance video editor specializing in cinematic films, reels, wedding videos, brand content, color grading and sound design.',
  'Ranjan Kumar — Video Editor | Cinematic & Social Media Video Editing',
  'Ranjan Kumar is a freelance video editor specializing in cinematic films, reels, wedding videos, brand content, color grading and sound design.',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
  '/favicon.ico',
  true
)
on conflict (id) do nothing;
