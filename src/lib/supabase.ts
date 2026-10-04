import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import {
  SiteSettings,
  SectionConfig,
  Project,
  ServiceItem,
  SkillItem,
  SoftwareItem,
  ProcessStep,
  BeforeAfterItem,
  Testimonial,
  SocialLink,
  NavigationItem,
  MediaAsset,
  ContactMessage,
  SEOSettings,
  RevisionSnapshot,
} from '../types/database';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_SECTIONS,
  DEFAULT_PROJECTS,
  DEFAULT_SERVICES,
  DEFAULT_SKILLS,
  DEFAULT_SOFTWARE,
  DEFAULT_PROCESS_STEPS,
  DEFAULT_BEFORE_AFTER,
  DEFAULT_TESTIMONIALS,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_NAVIGATION_ITEMS,
  DEFAULT_SEO_SETTINGS,
} from './defaults';

// Check for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon-public-key')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Local storage keys for caching and standalone operation
const STORAGE_KEYS = {
  SETTINGS_DRAFT: 'ranjan_cms_settings_draft',
  SETTINGS_PUB: 'ranjan_cms_settings_pub',
  SECTIONS_DRAFT: 'ranjan_cms_sections_draft',
  SECTIONS_PUB: 'ranjan_cms_sections_pub',
  PROJECTS: 'ranjan_cms_projects',
  SERVICES: 'ranjan_cms_services',
  SKILLS: 'ranjan_cms_skills',
  SOFTWARE: 'ranjan_cms_software',
  PROCESS: 'ranjan_cms_process',
  BEFORE_AFTER: 'ranjan_cms_before_after',
  TESTIMONIALS: 'ranjan_cms_testimonials',
  SOCIAL_LINKS: 'ranjan_cms_social_links',
  NAV_ITEMS: 'ranjan_cms_nav_items',
  MEDIA: 'ranjan_cms_media',
  MESSAGES: 'ranjan_cms_messages',
  SEO_DRAFT: 'ranjan_cms_seo_draft',
  SEO_PUB: 'ranjan_cms_seo_pub',
  REVISIONS: 'ranjan_cms_revisions',
  ADMIN_SESSION: 'ranjan_cms_admin_session_mock',
  LAST_PUBLISHED: 'ranjan_cms_last_published',
};

// Safe localStorage JSON helper
function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed reading localStorage key ${key}:`, err);
  }
  return fallback;
}

function saveLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn(`Failed saving localStorage key ${key}:`, err);
  }
}

// Global CMS Service
export class CMSService {
  // --- AUTHENTICATION & ADMIN ROLES ---
  static async checkAdminStatus(user: User | null): Promise<boolean> {
    if (!user) return false;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id, role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!error && data && data.role === 'admin') {
          return true;
        }
      } catch (e) {
        console.error('Error verifying admin status in Supabase:', e);
      }
    }

    // Check if user email matches initial owner email or test session
    const allowedEmails = ['sk0760121@gmail.com', 'ranjan.cinematicx@gmail.com'];
    if (user.email && allowedEmails.includes(user.email.toLowerCase())) {
      return true;
    }

    return false;
  }

  // --- DATA FETCHING (PUBLIC VS ADMIN) ---
  static getPublishedSettings(): SiteSettings {
    return loadLocal<SiteSettings>(STORAGE_KEYS.SETTINGS_PUB, DEFAULT_SITE_SETTINGS);
  }

  static getDraftSettings(): SiteSettings {
    return loadLocal<SiteSettings>(STORAGE_KEYS.SETTINGS_DRAFT, this.getPublishedSettings());
  }

  static saveDraftSettings(settings: SiteSettings): void {
    saveLocal(STORAGE_KEYS.SETTINGS_DRAFT, settings);
  }

  static getPublishedSections(): Record<string, SectionConfig> {
    return loadLocal<Record<string, SectionConfig>>(STORAGE_KEYS.SECTIONS_PUB, DEFAULT_SECTIONS);
  }

  static getDraftSections(): Record<string, SectionConfig> {
    return loadLocal<Record<string, SectionConfig>>(
      STORAGE_KEYS.SECTIONS_DRAFT,
      this.getPublishedSections()
    );
  }

  static saveDraftSections(sections: Record<string, SectionConfig>): void {
    saveLocal(STORAGE_KEYS.SECTIONS_DRAFT, sections);
  }

  // Projects
  static getProjects(): Project[] {
    return loadLocal<Project[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
  }

  static saveProjects(projects: Project[]): void {
    saveLocal(STORAGE_KEYS.PROJECTS, projects);
    if (supabase) {
      // Async sync with Supabase in background
      projects.forEach(async (p) => {
        await supabase?.from('projects').upsert(p);
      });
    }
  }

  // Services
  static getServices(): ServiceItem[] {
    return loadLocal<ServiceItem[]>(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
  }

  static saveServices(services: ServiceItem[]): void {
    saveLocal(STORAGE_KEYS.SERVICES, services);
  }

  // Skills
  static getSkills(): SkillItem[] {
    return loadLocal<SkillItem[]>(STORAGE_KEYS.SKILLS, DEFAULT_SKILLS);
  }

  static saveSkills(skills: SkillItem[]): void {
    saveLocal(STORAGE_KEYS.SKILLS, skills);
  }

  // Software
  static getSoftware(): SoftwareItem[] {
    return loadLocal<SoftwareItem[]>(STORAGE_KEYS.SOFTWARE, DEFAULT_SOFTWARE);
  }

  static saveSoftware(software: SoftwareItem[]): void {
    saveLocal(STORAGE_KEYS.SOFTWARE, software);
  }

  // Process Steps
  static getProcessSteps(): ProcessStep[] {
    return loadLocal<ProcessStep[]>(STORAGE_KEYS.PROCESS, DEFAULT_PROCESS_STEPS);
  }

  static saveProcessSteps(steps: ProcessStep[]): void {
    saveLocal(STORAGE_KEYS.PROCESS, steps);
  }

  // Before / After
  static getBeforeAfter(): BeforeAfterItem[] {
    return loadLocal<BeforeAfterItem[]>(STORAGE_KEYS.BEFORE_AFTER, DEFAULT_BEFORE_AFTER);
  }

  static saveBeforeAfter(items: BeforeAfterItem[]): void {
    saveLocal(STORAGE_KEYS.BEFORE_AFTER, items);
  }

  // Testimonials
  static getTestimonials(): Testimonial[] {
    return loadLocal<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
  }

  static saveTestimonials(items: Testimonial[]): void {
    saveLocal(STORAGE_KEYS.TESTIMONIALS, items);
  }

  // Social Links
  static getSocialLinks(): SocialLink[] {
    return loadLocal<SocialLink[]>(STORAGE_KEYS.SOCIAL_LINKS, DEFAULT_SOCIAL_LINKS);
  }

  static saveSocialLinks(links: SocialLink[]): void {
    saveLocal(STORAGE_KEYS.SOCIAL_LINKS, links);
  }

  // Navigation Items
  static getNavigationItems(): NavigationItem[] {
    return loadLocal<NavigationItem[]>(STORAGE_KEYS.NAV_ITEMS, DEFAULT_NAVIGATION_ITEMS);
  }

  static saveNavigationItems(items: NavigationItem[]): void {
    saveLocal(STORAGE_KEYS.NAV_ITEMS, items);
  }

  // Media Assets
  static getMedia(): MediaAsset[] {
    return loadLocal<MediaAsset[]>(STORAGE_KEYS.MEDIA, [
      {
        id: 'med-1',
        filename: 'himalayan-odyssey-poster.jpg',
        file_type: 'image',
        mime_type: 'image/jpeg',
        size_bytes: 412000,
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        storage_path: 'portfolio-media/himalayan-odyssey-poster.jpg',
        alt_text: 'Himalayan mountain road',
        created_at: new Date().toISOString(),
      },
      {
        id: 'med-2',
        filename: 'tokyo-reel-preview.jpg',
        file_type: 'image',
        mime_type: 'image/jpeg',
        size_bytes: 350000,
        url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        storage_path: 'portfolio-media/tokyo-reel-preview.jpg',
        alt_text: 'Tokyo Neon Cityscape',
        created_at: new Date().toISOString(),
      },
      {
        id: 'med-3',
        filename: 'showreel-sample.mp4',
        file_type: 'video',
        mime_type: 'video/mp4',
        size_bytes: 14200000,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        storage_path: 'portfolio-media/showreel-sample.mp4',
        alt_text: 'Cinematic showreel video',
        created_at: new Date().toISOString(),
      },
    ]);
  }

  static saveMedia(assets: MediaAsset[]): void {
    saveLocal(STORAGE_KEYS.MEDIA, assets);
  }

  // Contact Messages
  static getContactMessages(): ContactMessage[] {
    return loadLocal<ContactMessage[]>(STORAGE_KEYS.MESSAGES, [
      {
        id: 'msg-sample',
        name: 'Alex Rivera',
        email: 'alex@lumina.film',
        project_type: 'Cinematic Film',
        budget: '$3,000 - $5,000',
        message: 'Looking for a master editor for our upcoming 15-minute documentary shot on RED Komodo.',
        status: 'unread',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ]);
  }

  static async submitContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>): Promise<{ success: boolean; error?: string }> {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      status: 'unread',
      created_at: new Date().toISOString(),
    };

    // Save locally
    const current = this.getContactMessages();
    saveLocal(STORAGE_KEYS.MESSAGES, [newMsg, ...current]);

    // Also send to Supabase if configured
    if (supabase) {
      try {
        const { error } = await supabase.from('contact_messages').insert({
          name: newMsg.name,
          email: newMsg.email,
          project_type: newMsg.project_type,
          budget: newMsg.budget,
          message: newMsg.message,
          status: 'unread',
        });
        if (error) console.error('Supabase contact message error:', error);
      } catch (err) {
        console.error('Supabase contact message dispatch failed:', err);
      }
    }

    return { success: true };
  }

  static saveContactMessages(msgs: ContactMessage[]): void {
    saveLocal(STORAGE_KEYS.MESSAGES, msgs);
  }

  // SEO Settings
  static getPublishedSEO(): SEOSettings {
    return loadLocal<SEOSettings>(STORAGE_KEYS.SEO_PUB, DEFAULT_SEO_SETTINGS);
  }

  static getDraftSEO(): SEOSettings {
    return loadLocal<SEOSettings>(STORAGE_KEYS.SEO_DRAFT, this.getPublishedSEO());
  }

  static saveDraftSEO(seo: SEOSettings): void {
    saveLocal(STORAGE_KEYS.SEO_DRAFT, seo);
  }

  // Revisions
  static getRevisions(): RevisionSnapshot[] {
    return loadLocal<RevisionSnapshot[]>(STORAGE_KEYS.REVISIONS, []);
  }

  static createRevision(title: string, author = 'admin'): RevisionSnapshot {
    const snapshot: RevisionSnapshot = {
      id: 'rev-' + Date.now(),
      title,
      created_at: new Date().toISOString(),
      created_by: author,
      snapshot: {
        site_settings: this.getDraftSettings(),
        sections: this.getDraftSections(),
        projects: this.getProjects(),
        services: this.getServices(),
        skills: this.getSkills(),
        software: this.getSoftware(),
        process_steps: this.getProcessSteps(),
        before_after: this.getBeforeAfter(),
        testimonials: this.getTestimonials(),
        social_links: this.getSocialLinks(),
        navigation_items: this.getNavigationItems(),
        seo_settings: this.getDraftSEO(),
      },
    };

    const revisions = [snapshot, ...this.getRevisions()].slice(0, 20); // Keep last 20
    saveLocal(STORAGE_KEYS.REVISIONS, revisions);
    return snapshot;
  }

  static restoreRevision(snapshot: RevisionSnapshot): void {
    this.saveDraftSettings(snapshot.snapshot.site_settings);
    this.saveDraftSections(snapshot.snapshot.sections);
    this.saveProjects(snapshot.snapshot.projects);
    this.saveServices(snapshot.snapshot.services);
    this.saveSkills(snapshot.snapshot.skills);
    this.saveSoftware(snapshot.snapshot.software);
    this.saveProcessSteps(snapshot.snapshot.process_steps);
    this.saveBeforeAfter(snapshot.snapshot.before_after);
    this.saveTestimonials(snapshot.snapshot.testimonials);
    this.saveSocialLinks(snapshot.snapshot.social_links);
    this.saveNavigationItems(snapshot.snapshot.navigation_items);
    this.saveDraftSEO(snapshot.snapshot.seo_settings);
  }

  // --- PUBLISH SYSTEM ---
  // Promotes draft settings & draft sections to the live public site
  static publishChanges(): { timestamp: string } {
    // 1. Snapshot prior state as safety revision
    this.createRevision('Auto-backup before publish');

    // 2. Promote draft settings & SEO to published
    const draftSettings = this.getDraftSettings();
    saveLocal(STORAGE_KEYS.SETTINGS_PUB, draftSettings);

    const draftSections = this.getDraftSections();
    saveLocal(STORAGE_KEYS.SECTIONS_PUB, draftSections);

    const draftSEO = this.getDraftSEO();
    saveLocal(STORAGE_KEYS.SEO_PUB, draftSEO);

    const timestamp = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.LAST_PUBLISHED, timestamp);

    // Sync with Supabase if online
    if (supabase) {
      supabase.from('site_settings').upsert({
        id: 'primary_settings',
        status: 'published',
        theme: draftSettings.theme,
        updated_at: timestamp,
      }).then(() => {});

      supabase.from('seo_settings').upsert({
        ...draftSEO,
        updated_at: timestamp,
      }).then(() => {});
    }

    return { timestamp };
  }

  static getLastPublished(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_PUBLISHED);
  }

  // --- RESET SYSTEMS ---
  static resetSection(sectionId: string): SectionConfig {
    const draftSections = this.getDraftSections();
    const defaultSection = DEFAULT_SECTIONS[sectionId];
    if (defaultSection) {
      draftSections[sectionId] = JSON.parse(JSON.stringify(defaultSection));
      this.saveDraftSections(draftSections);
      return draftSections[sectionId];
    }
    return draftSections[sectionId];
  }

  static resetEntireSite(): void {
    this.createRevision('Backup prior to full site reset');
    saveLocal(STORAGE_KEYS.SETTINGS_DRAFT, DEFAULT_SITE_SETTINGS);
    saveLocal(STORAGE_KEYS.SETTINGS_PUB, DEFAULT_SITE_SETTINGS);
    saveLocal(STORAGE_KEYS.SECTIONS_DRAFT, DEFAULT_SECTIONS);
    saveLocal(STORAGE_KEYS.SECTIONS_PUB, DEFAULT_SECTIONS);
    saveLocal(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
    saveLocal(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
    saveLocal(STORAGE_KEYS.SKILLS, DEFAULT_SKILLS);
    saveLocal(STORAGE_KEYS.SOFTWARE, DEFAULT_SOFTWARE);
    saveLocal(STORAGE_KEYS.PROCESS, DEFAULT_PROCESS_STEPS);
    saveLocal(STORAGE_KEYS.BEFORE_AFTER, DEFAULT_BEFORE_AFTER);
    saveLocal(STORAGE_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
    saveLocal(STORAGE_KEYS.SOCIAL_LINKS, DEFAULT_SOCIAL_LINKS);
    saveLocal(STORAGE_KEYS.NAV_ITEMS, DEFAULT_NAVIGATION_ITEMS);
    saveLocal(STORAGE_KEYS.SEO_DRAFT, DEFAULT_SEO_SETTINGS);
    saveLocal(STORAGE_KEYS.SEO_PUB, DEFAULT_SEO_SETTINGS);
  }
}
