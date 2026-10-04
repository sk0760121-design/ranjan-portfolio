export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: 'admin' | 'editor';
  created_at: string;
}

export interface SiteColors {
  background: string;
  secondaryBackground: string;
  primaryText: string;
  secondaryText: string;
  accent: string;
  border: string;
  button: string;
  buttonHover: string;
  overlay: string;
}

export interface TypographyRule {
  fontSizeDesktop: string;
  fontSizeTablet: string;
  fontSizeMobile: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  fontFamily?: string;
  textTransform?: 'none' | 'uppercase' | 'capitalize' | 'lowercase';
}

export interface CustomFont {
  id: string;
  name: string;
  family_name: string;
  file_url: string;
  format: 'woff2' | 'woff' | 'ttf' | 'otf';
  weight: string;
  style: 'normal' | 'italic';
  active: boolean;
  storage_path?: string;
  size_bytes?: number;
  created_at: string;
}

export interface SiteTypography {
  // Baseline typography rules
  h1: TypographyRule;
  h2: TypographyRule;
  h3: TypographyRule;
  h4: TypographyRule;
  body: TypographyRule;
  small: TypographyRule;
  button: TypographyRule;
  label: TypographyRule;

  // Specific granular controls requested
  globalBody?: TypographyRule;
  heading?: TypographyRule;
  heroHeading?: TypographyRule;
  heroSubtitle?: TypographyRule;
  navigation?: TypographyRule;
  sectionHeading?: TypographyRule;
  projectTitle?: TypographyRule;
  projectDescription?: TypographyRule;
  footer?: TypographyRule;
}

export interface SiteDesign {
  cardRadius: string;
  buttonRadius: string;
  containerWidth: string;
  sectionSpacingDesktop: string;
  sectionSpacingMobile: string;
  grainIntensity: number;
  customCursor: boolean;
}

export interface SiteAnimations {
  enabled: boolean;
  type: 'fade' | 'slide' | 'scale' | 'blur';
  duration: number;
  delay?: number;
  hoverEffects: boolean;
}

export interface SiteTheme {
  colors: SiteColors;
  typography: SiteTypography;
  design: SiteDesign;
  animations: SiteAnimations;
}

export interface SiteSettings {
  id: string;
  status: 'draft' | 'published';
  theme: SiteTheme;
  created_at?: string;
  updated_at?: string;
}

export interface SectionContent {
  [key: string]: any;
}

export interface SectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  sort_order: number;
  content: SectionContent;
  is_draft?: boolean;
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  long_description?: string;
  thumbnail: string;
  hero_media?: string;
  video?: string;
  video_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  client?: string;
  year?: string;
  tags?: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  enabled: boolean;
  sort_order: number;
}

export interface SkillItem {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  sort_order: number;
}

export interface SoftwareItem {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  enabled: boolean;
  sort_order: number;
}

export interface ProcessStep {
  id: string;
  step_number: string;
  title: string;
  description: string;
  enabled: boolean;
  sort_order: number;
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  description?: string;
  before_media: string;
  after_media: string;
  media_type: 'image' | 'video';
  initial_slider_position: number;
  enabled: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
  profile_image?: string;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  enabled: boolean;
  sort_order: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  sort_order: number;
}

export interface MediaAsset {
  id: string;
  filename: string;
  file_type: 'image' | 'video' | 'audio' | 'document' | 'font' | 'logo' | 'icon' | 'other';
  mime_type: string;
  size_bytes: number;
  url: string;
  storage_path: string;
  alt_text?: string;
  category?: 'Videos' | 'Images' | 'Fonts' | 'Logos' | 'Icons' | 'Documents' | 'Other';
  resolution?: string; // e.g. "3840x2160 (4K UHD)", "1920x1080 (1080p)"
  duration?: number; // duration in seconds
  width?: number;
  height?: number;
  created_at: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  project_type: string;
  budget?: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
}

export interface SEOSettings {
  id: string;
  page_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image?: string;
  favicon?: string;
  robots_index: boolean;
  updated_at?: string;
}

export interface RevisionSnapshot {
  id: string;
  title: string;
  created_at: string;
  created_by: string;
  snapshot: {
    site_settings: SiteSettings;
    sections: Record<string, SectionConfig>;
    projects: Project[];
    services: ServiceItem[];
    skills: SkillItem[];
    software: SoftwareItem[];
    process_steps: ProcessStep[];
    before_after: BeforeAfterItem[];
    testimonials: Testimonial[];
    social_links: SocialLink[];
    navigation_items: NavigationItem[];
    seo_settings: SEOSettings;
  };
}
