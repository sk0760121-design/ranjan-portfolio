# Ranjan Kumar — Cinematic Video Editor Portfolio & CMS

A production-ready personal portfolio website and private Content Management System (CMS) designed for freelance video editor and filmmaker **Ranjan Kumar**.

---

## 1. Project Setup
This project is built with React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, and `@supabase/supabase-js`.

Clone or open the repository in your environment:
```bash
cd /workspace
```

---

## 2. npm install
Install project dependencies:
```bash
npm install
```

---

## 3. Development Command
Start the Vite development server on port 3000:
```bash
npm run dev
```
Open `http://localhost:3000` to view the public portfolio.

---

## 4. Supabase Setup
1. Create a free account at [Supabase](https://supabase.com).
2. Create a new project (e.g., `ranjan-portfolio-cms`).
3. Note your **Project URL** and **anon public API Key** from **Project Settings → API**.

---

## 5. Environment Variables
Create or edit your `.env` file based on `.env.example`:
```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

*Note:* Never expose your `SUPABASE_SERVICE_ROLE_KEY` in frontend code or environment variables. The client exclusively uses the public `anon` key protected by Row Level Security (RLS).

---

## 6. Database Migration
In your Supabase Dashboard:
1. Navigate to the **SQL Editor**.
2. Open the file `supabase/migrations/20261004_initial_schema.sql` from this repository.
3. Paste its contents into the SQL Editor and click **Run**.

This script automatically provisions:
- `admin_users` (role-based access control)
- `site_settings` (theme, colors, typography, layout)
- `sections` (all 15 togglable sections with content)
- `projects` (portfolio items, video links, thumbnails, tags)
- `services` (01 to 06 editing offerings)
- `skills` & `software` (capabilities and tools)
- `process_steps` (5-phase creative workflow)
- `before_after` (color grading comparison sliders)
- `testimonials` (client reviews)
- `social_links` (Instagram, YouTube, WhatsApp, etc.)
- `navigation_items` (header menu links)
- `media` (storage metadata catalog)
- `contact_messages` (inbound project proposals)
- `seo_settings` (title, meta description, OG tags)
- `revisions` (version snapshots)

---

## 7. Storage Buckets
The migration script automatically provisions the public bucket:
- **Bucket ID:** `portfolio-media`
- **Public:** `true`

Upload policies are configured so only authenticated administrators can upload, update, and delete files, while public visitors can view published media.

---

## 8. Row Level Security (RLS) Policies
- **Public Users:** Granted `SELECT` permissions on published projects, enabled services, skills, testimonials, and site configuration. Granted `INSERT` permission on `contact_messages` (so visitors can submit proposals without reading others' messages).
- **Admins:** Granted full `SELECT`, `INSERT`, `UPDATE`, `DELETE` permissions verified against the `admin_users` table where `auth.uid() = user_id`.

---

## 9. First Admin Creation
1. In Supabase Dashboard, go to **Authentication → Users** and click **Add user** (or sign up via the app).
   - Email: `sk0760121@gmail.com` (or `ranjan.cinematicx@gmail.com`)
   - Password: Choose a strong password.
2. In Supabase Dashboard, go to **SQL Editor** and run:
```sql
insert into public.admin_users (user_id, email, role)
select id, email, 'admin'
from auth.users
where email = 'sk0760121@gmail.com'
on conflict (user_id) do nothing;
```
*Tip:* In standalone / offline preview mode, the CMS also accepts `sk0760121@gmail.com` with password `editor2026`.

---

## 10. Local Development
The application features an intelligent hybrid engine:
- If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided, it queries and updates your remote Supabase cloud project.
- If running without credentials, it seamlessly operates using persistent local state, enabling instant UI testing, project management, and live previews.

---

## 11. Deployment
Deploy to **Vercel**, **Netlify**, or **Cloudflare Pages**:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Single Page Application (SPA) rewrites:**
  - For Vercel: add `vercel.json`:
    ```json
    { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
    ```
  - For Netlify: add `public/_redirects`:
    ```text
    /* /index.html 200
    ```

---

## 12. Domain Configuration
In your DNS provider (e.g. Cloudflare, Namecheap, GoDaddy):
- Add a `CNAME` record pointing to your hosting provider domain (e.g. `cname.vercel-dns.com`).
- Enable SSL / HTTPS.

---

## 13. Authentication Redirect Configuration
In Supabase Dashboard under **Authentication → URL Configuration**:
- Set **Site URL** to your production domain: `https://your-domain.com`
- Under **Redirect URLs**, add:
  - `https://your-domain.com/admin`
  - `http://localhost:3000/admin` (for local development)

---

## 14. How to Access /admin
1. Navigate directly to `/admin` in your browser address bar (e.g. `https://your-domain.com/admin` or `/#admin`).
2. Enter your authorized admin email and password.
3. Your session is saved securely in the browser and will persist across page refreshes and browser restarts.

---

## 15. How to Upload Videos
1. In `/admin`, open **MEDIA LIBRARY** from the sidebar.
2. Click **UPLOAD ASSET**.
3. Select an MP4, WebM, or image file (up to 50MB).
4. Click **Copy URL** to paste the asset URL into any project, hero background, or before/after slider.

---

## 16. How to Create Projects
1. Go to **SELECTED WORK** in the admin sidebar.
2. Click **ADD NEW PROJECT**.
3. Fill in:
   - Project Title & URL Slug
   - Category (Cinematic Film, Short Form, Wedding Film, Brand Videos)
   - Thumbnail URL & Project Video URL
   - Short Description & Full Narrative breakdown
   - Client, Year, and Tags
   - Toggle Published / Featured
4. Click **Save Project**.

---

## 17. How to Edit Typography
1. Go to **TYPOGRAPHY** in the admin sidebar.
2. Adjust font size sliders for **Desktop**, **Tablet**, and **Mobile** for H1, H2, H3, and Body copy.
3. Open the **Split View** or **Preview** to observe real-time responsive rendering.

---

## 18. How to Change Colors
1. Go to **DESIGN & COLORS** in the admin sidebar.
2. Click any color swatch or type a Hex value (e.g. Background `#0A0A0A`, Accent `#FF2027`).
3. The color updates throughout the site instantly.

---

## 19. How to Publish Changes
1. When you make changes to hero copy, typography, colors, or sections, the system marks the status as **DRAFT CHANGES PENDING**.
2. Click **Save Draft** to store work-in-progress adjustments.
3. Click **Preview** or **Split View** to verify the look across devices.
4. Click **Publish** (in top bar). The system creates an automatic revision snapshot and pushes changes live to the public website.

---

## 20. How to Backup and Restore
1. Go to **REVISIONS / BACKUPS** in the admin sidebar.
2. Enter a description and click **SAVE SNAPSHOT** to create a manual milestone.
3. To rollback to a previous state, click **RESTORE THIS VERSION** on any past snapshot.
