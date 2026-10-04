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
  SEOSettings,
} from '../types/database';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'primary_settings',
  status: 'published',
  theme: {
    colors: {
      background: '#0A0A0A',
      secondaryBackground: '#151515',
      primaryText: '#FFFFFF',
      secondaryText: '#8A8A8A',
      accent: '#FF2027',
      border: '#262626',
      button: '#FF2027',
      buttonHover: '#E0181F',
      overlay: 'rgba(10, 10, 10, 0.75)',
    },
    typography: {
      h1: {
        fontSizeDesktop: '84px',
        fontSizeTablet: '60px',
        fontSizeMobile: '40px',
        fontWeight: '800',
        lineHeight: '1.02',
        letterSpacing: '-0.03em',
        textTransform: 'uppercase',
      },
      h2: {
        fontSizeDesktop: '52px',
        fontSizeTablet: '40px',
        fontSizeMobile: '30px',
        fontWeight: '800',
        lineHeight: '1.1',
        letterSpacing: '-0.02em',
        textTransform: 'uppercase',
      },
      h3: {
        fontSizeDesktop: '28px',
        fontSizeTablet: '24px',
        fontSizeMobile: '20px',
        fontWeight: '700',
        lineHeight: '1.2',
        letterSpacing: '-0.01em',
      },
      h4: {
        fontSizeDesktop: '20px',
        fontSizeTablet: '18px',
        fontSizeMobile: '16px',
        fontWeight: '600',
        lineHeight: '1.3',
        letterSpacing: '0',
      },
      body: {
        fontSizeDesktop: '17px',
        fontSizeTablet: '16px',
        fontSizeMobile: '15px',
        fontWeight: '400',
        lineHeight: '1.65',
        letterSpacing: '0',
      },
      small: {
        fontSizeDesktop: '13px',
        fontSizeTablet: '12px',
        fontSizeMobile: '12px',
        fontWeight: '500',
        lineHeight: '1.4',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      },
      button: {
        fontSizeDesktop: '14px',
        fontSizeTablet: '14px',
        fontSizeMobile: '13px',
        fontWeight: '600',
        lineHeight: '1',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      },
      label: {
        fontSizeDesktop: '12px',
        fontSizeTablet: '12px',
        fontSizeMobile: '11px',
        fontWeight: '600',
        lineHeight: '1',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      },
    },
    design: {
      cardRadius: '8px',
      buttonRadius: '4px',
      containerWidth: '1280px',
      sectionSpacingDesktop: '110px',
      sectionSpacingMobile: '70px',
      grainIntensity: 3.5,
      customCursor: true,
    },
    animations: {
      enabled: true,
      type: 'fade',
      duration: 0.6,
      hoverEffects: true,
    },
  },
};

export const DEFAULT_SECTIONS: Record<string, SectionConfig> = {
  hero: {
    id: 'hero',
    name: 'Hero',
    enabled: true,
    sort_order: 1,
    content: {
      tagline: 'VIDEO EDITOR · FILMMAKER · STORYTELLER',
      headingLine1: 'I EDIT',
      headingLine2: 'STORIES THAT',
      headingLine3: 'MAKE PEOPLE',
      headingHighlight: 'STOP SCROLLING.',
      supportingCopy:
        "I'm Ranjan Kumar, a video editor focused on cinematic storytelling, engaging short-form content and polished visual experiences.",
      primaryButtonText: 'WATCH SHOWREEL',
      primaryButtonUrl: '#showreel',
      secondaryButtonText: 'VIEW MY WORK',
      secondaryButtonUrl: '#work',
      locationText: 'Based in India · Available Worldwide',
      backgroundType: 'video', // 'video' or 'image'
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      posterUrl:
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80',
      overlayOpacity: 0.65,
      autoplay: true,
      muted: true,
      loop: true,
    },
  },
  intro: {
    id: 'intro',
    name: 'Intro Statement',
    enabled: true,
    sort_order: 2,
    content: {
      label: 'A LITTLE ABOUT MY WORK',
      statement: "GOOD EDITING ISN'T ABOUT ADDING MORE.\nIT'S ABOUT KNOWING WHAT TO REMOVE.",
      description:
        'From the first cut to the final sound design, I focus on pacing, emotion and visual storytelling — turning raw footage into content people actually want to watch.',
    },
  },
  work: {
    id: 'work',
    name: 'Selected Work',
    enabled: true,
    sort_order: 3,
    content: {
      heading: 'SELECTED\nWORK',
      description:
        "A collection of projects I've edited across cinematic films, short-form content, weddings and branded videos.",
    },
  },
  results: {
    id: 'results',
    name: 'Results & Metrics',
    enabled: true,
    sort_order: 4,
    content: {
      heading: 'THE EDIT\nIS ONLY HALF\nTHE STORY.',
      stats: [
        { value: '100K+', label: 'Views generated', id: '1' },
        { value: '140K+', label: 'Highest-performing project', id: '2' },
        { value: '4+', label: 'Editing categories', id: '3' },
        { value: '∞', label: 'Frames perfected', id: '4' },
      ],
    },
  },
  services: {
    id: 'services',
    name: 'Services',
    enabled: true,
    sort_order: 5,
    content: {
      heading: 'SERVICES',
      subheading: 'What I bring to your visual productions',
    },
  },
  skills: {
    id: 'skills',
    name: 'Skills & Capabilities',
    enabled: true,
    sort_order: 6,
    content: {
      heading: 'CORE CAPABILITIES',
      subheading: 'Technical finesse paired with directorial intuition',
    },
  },
  software: {
    id: 'software',
    name: 'Software Stack',
    enabled: true,
    sort_order: 7,
    content: {
      heading: 'TOOLKIT',
      subheading: 'Industry standard tools calibrated for speed and color accuracy',
    },
  },
  process: {
    id: 'process',
    name: 'Creative Process',
    enabled: true,
    sort_order: 8,
    content: {
      heading: 'PROCESS',
      subheading: 'From raw rushes to pixel-perfect master delivery',
    },
  },
  before_after: {
    id: 'before_after',
    name: 'Before / After Grade',
    enabled: true,
    sort_order: 9,
    content: {
      heading: 'COLOR & POLISH',
      subheading: 'Slide to inspect the raw camera log vs. final cinematic grade',
    },
  },
  testimonials: {
    id: 'testimonials',
    name: 'Testimonials',
    enabled: true,
    sort_order: 10,
    content: {
      heading: 'WHAT CREATORS SAY',
      subheading: 'Collaborations with directors, agencies and content creators',
    },
  },
  about: {
    id: 'about',
    name: 'About Ranjan',
    enabled: true,
    sort_order: 11,
    content: {
      heading: "HEY, I'M RANJAN.",
      paragraph1:
        "I'm a video editor passionate about turning ordinary footage into engaging visual stories.",
      paragraph2:
        "My approach combines clean editing, cinematic visuals, strong pacing and thoughtful sound design. Whether it's a 30-second reel or a full wedding film, I believe every frame should have a purpose.",
      location: 'Based in India · Working Worldwide',
      buttonText: 'GET IN TOUCH',
      buttonUrl: '#contact',
      imageUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    },
  },
  philosophy: {
    id: 'philosophy',
    name: 'Editing Philosophy',
    enabled: true,
    sort_order: 12,
    content: {
      statement: 'EVERY\nFRAME\nSHOULD\nEARN ITS\nPLACE.',
      subtext1: 'No unnecessary cuts. No meaningless effects.',
      subtext2: 'Just intentional storytelling.',
    },
  },
  cta: {
    id: 'cta',
    name: 'Final Call to Action',
    enabled: true,
    sort_order: 13,
    content: {
      overhead: 'HAVE A PROJECT IN MIND?',
      heading: "LET'S MAKE\nSOMETHING\nPEOPLE\nREMEMBER.",
      primaryButtonText: 'START A PROJECT',
      primaryButtonUrl: '#contact',
      secondaryButtonText: 'WATCH SHOWREEL',
      secondaryButtonUrl: '#showreel',
    },
  },
  contact: {
    id: 'contact',
    name: 'Contact Form',
    enabled: true,
    sort_order: 14,
    content: {
      heading: "LET'S TALK.",
      description:
        "Tell me what you're working on, what you need edited, and where you want your content to go.",
      email: 'ranjan.cinematicx@gmail.com',
      responseTime: 'Usually replies within 24 hours',
    },
  },
  footer: {
    id: 'footer',
    name: 'Footer',
    enabled: true,
    sort_order: 15,
    content: {
      logo: 'RANJAN.',
      tagline: 'Video Editor · Filmmaker · Storyteller',
      copyright: '© 2026 Ranjan Kumar. All rights reserved.',
      note: 'Designed & edited with intention.',
    },
  },
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'THE HIMALAYAN ODYSSEY',
    slug: 'the-himalayan-odyssey',
    category: 'Cinematic Film',
    short_description:
      'A poetic cinematic short film capturing high-altitude solitude and human endurance across Spiti Valley.',
    long_description:
      'Edited from 48 hours of 4K Sony FX6 footage. The challenge was building an emotional cadence that mirrored the harsh winds and silence of the Himalayan mountain passes. Involves extensive sound design with organic Foley and customized LUT-based color grading for cold, crisp high-latitude lighting.',
    thumbnail:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    hero_media:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    video:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    video_url:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    instagram_url: 'https://instagram.com/ranjan.cinematicx',
    youtube_url: 'https://youtube.com',
    client: 'Mountain Expedition Co.',
    year: '2026',
    tags: ['Cinematic', 'Documentary', 'Color Grading', 'Sound Design'],
    featured: true,
    published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'proj-2',
    title: 'PULSE OF TOKYO: HYPER-PACED REEL',
    slug: 'pulse-of-tokyo-hyper-reel',
    category: 'Short Form',
    short_description:
      'High-retention, beat-synced travel reel designed for viral social engagement with seamless match cuts.',
    long_description:
      'Crafted specifically for mobile vertical retention. Uses kinetic typography, speed ramps, and seamless whip transitions to keep view duration above 94% across Instagram Reels and TikTok.',
    thumbnail:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    hero_media:
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1920&q=80',
    video:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    video_url:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    instagram_url: 'https://instagram.com/the_digital.ranjan',
    youtube_url: '',
    client: 'Urban Nomad',
    year: '2026',
    tags: ['Short Form', 'Speed Ramps', 'Sound FX', 'Viral Hook'],
    featured: true,
    published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'proj-3',
    title: 'ETERNAL VOWS: A ROYAL RAJASTHAN WEDDING',
    slug: 'eternal-vows-rajasthan-wedding',
    category: 'Wedding Film',
    short_description:
      'An intimate, cinematic documentary of a heritage palace wedding in Udaipur blending raw emotion with grandeur.',
    long_description:
      'A 12-minute documentary-style wedding film featuring non-linear narrative, emotional vows voiceover mixing, warm vintage cinematic palette, and bespoke Indian instrumental cues.',
    thumbnail:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    hero_media:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80',
    video:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    video_url:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    instagram_url: 'https://instagram.com/ranjan.cinematicx',
    youtube_url: '',
    client: 'Aarav & Meera',
    year: '2025',
    tags: ['Wedding', 'Storytelling', 'Vocal Design', 'Emotional'],
    featured: true,
    published: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'proj-4',
    title: 'AURA: LUXURY TIMEPIECE CAMPAIGN',
    slug: 'aura-luxury-timepiece-campaign',
    category: 'Brand Videos',
    short_description:
      'A sharp, minimal commercial edit highlighting micro-details and craftsmanship with mechanical soundscapes.',
    long_description:
      'Crafted for luxury retail and digital ad campaigns. Synchronized close-up macro shots with authentic tick-tock audio and deep cinematic bass swells.',
    thumbnail:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    hero_media:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1920&q=80',
    video:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    video_url:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    instagram_url: 'https://instagram.com/the_digital.ranjan',
    youtube_url: '',
    client: 'Chrono Lux Watches',
    year: '2025',
    tags: ['Commercial', 'Brand Video', 'Macro', 'Sound FX'],
    featured: false,
    published: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    number: '01',
    title: 'SHORT FORM',
    description:
      'Reels, Shorts and social-first videos designed around pacing, hooks and retention.',
    enabled: true,
    sort_order: 1,
  },
  {
    id: 'srv-2',
    number: '02',
    title: 'CINEMATIC FILMS',
    description:
      'Story-driven edits with cinematic pacing, color and sound design.',
    enabled: true,
    sort_order: 2,
  },
  {
    id: 'srv-3',
    number: '03',
    title: 'WEDDING FILMS',
    description:
      'Emotional wedding films that turn real moments into timeless stories.',
    enabled: true,
    sort_order: 3,
  },
  {
    id: 'srv-4',
    number: '04',
    title: 'BRAND VIDEOS',
    description:
      'Clean, polished edits designed to communicate your brand with impact.',
    enabled: true,
    sort_order: 4,
  },
  {
    id: 'srv-5',
    number: '05',
    title: 'SOCIAL MEDIA CONTENT',
    description:
      'Fast, engaging edits built for modern social platforms.',
    enabled: true,
    sort_order: 5,
  },
  {
    id: 'srv-6',
    number: '06',
    title: 'VIDEO ENHANCEMENT',
    description:
      'Professional finishing that takes existing footage to the next level.',
    enabled: true,
    sort_order: 6,
  },
];

export const DEFAULT_SKILLS: SkillItem[] = [
  { id: 'sk-1', name: 'STORYTELLING', description: 'Narrative arc & emotional beats', enabled: true, sort_order: 1 },
  { id: 'sk-2', name: 'CUTTING & PACING', description: 'Micro-timing and rhythm', enabled: true, sort_order: 2 },
  { id: 'sk-3', name: 'COLOR GRADING', description: 'LUTs, ACES & film stock emulations', enabled: true, sort_order: 3 },
  { id: 'sk-4', name: 'SOUND DESIGN', description: 'Foley, risers, ambient layering & mix', enabled: true, sort_order: 4 },
  { id: 'sk-5', name: 'MOTION GRAPHICS', description: 'Clean titles, lower thirds & 2D motion', enabled: true, sort_order: 5 },
  { id: 'sk-6', name: 'SOCIAL MEDIA EDITING', description: 'Hook optimization & retention graphs', enabled: true, sort_order: 6 },
  { id: 'sk-7', name: 'CINEMATIC EDITING', description: 'Wide aspect framing & narrative depth', enabled: true, sort_order: 7 },
  { id: 'sk-8', name: 'VISUAL POLISH', description: 'Stabilization, noise reduction & clean-up', enabled: true, sort_order: 8 },
];

export const DEFAULT_SOFTWARE: SoftwareItem[] = [
  {
    id: 'soft-1',
    name: 'Adobe Premiere Pro',
    description: 'Primary timeline & rough-cut to fine-cut assembly',
    logo_url: 'https://api.iconify.design/simple-icons:adobepremierepro.svg?color=%239999FF',
    website_url: 'https://adobe.com/products/premiere',
    enabled: true,
    sort_order: 1,
  },
  {
    id: 'soft-2',
    name: 'Adobe After Effects',
    description: 'Motion graphics, kinetic type, VFX tracking and cleanup',
    logo_url: 'https://api.iconify.design/simple-icons:adobeaftereffects.svg?color=%239999FF',
    website_url: 'https://adobe.com/products/aftereffects',
    enabled: true,
    sort_order: 2,
  },
  {
    id: 'soft-3',
    name: 'DaVinci Resolve',
    description: 'Color science, node-based grading and Fairlight audio finishing',
    logo_url: 'https://api.iconify.design/simple-icons:davinciresolve.svg?color=%23FF5555',
    website_url: 'https://blackmagicdesign.com/products/davinciresolve',
    enabled: true,
    sort_order: 3,
  },
  {
    id: 'soft-4',
    name: 'CapCut',
    description: 'Rapid mobile delivery and trending social media sound tracking',
    logo_url: 'https://api.iconify.design/simple-icons:capcut.svg?color=%23FFFFFF',
    website_url: 'https://capcut.com',
    enabled: true,
    sort_order: 4,
  },
];

export const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'proc-1',
    step_number: '01',
    title: 'DISCOVER',
    description: 'We understand the footage, audience and goal.',
    enabled: true,
    sort_order: 1,
  },
  {
    id: 'proc-2',
    step_number: '02',
    title: 'STRUCTURE',
    description: 'I find the strongest moments and build the story.',
    enabled: true,
    sort_order: 2,
  },
  {
    id: 'proc-3',
    step_number: '03',
    title: 'EDIT',
    description: 'Pacing, transitions and visual rhythm come together.',
    enabled: true,
    sort_order: 3,
  },
  {
    id: 'proc-4',
    step_number: '04',
    title: 'POLISH',
    description: 'Color grading, sound design and motion bring the edit to life.',
    enabled: true,
    sort_order: 4,
  },
  {
    id: 'proc-5',
    step_number: '05',
    title: 'DELIVER',
    description: 'Final quality-controlled export, ready for your platform.',
    enabled: true,
    sort_order: 5,
  },
];

export const DEFAULT_BEFORE_AFTER: BeforeAfterItem[] = [
  {
    id: 'ba-1',
    title: 'LOG Camera Profile vs. Final Film Stock Emulation',
    description: 'Flat, desaturated RAW log profile converted into a rich 35mm warm tone with highlight roll-off.',
    before_media: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=30', // desaturated look
    after_media: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=90', // rich saturated
    media_type: 'image',
    initial_slider_position: 50,
    enabled: true,
    sort_order: 1,
  },
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    quote:
      'Ranjan has an instinctive sense of pacing. He turned 30 hours of raw travel footage into our best-performing short film of the year.',
    name: 'Arjun Mehta',
    role: 'Creative Director',
    company: 'Apex Media Studio',
    profile_image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'test-2',
    quote:
      'Our social reels retention skyrocketed by 40% after Ranjan reworked our hooks and audio design. Pure professionalism.',
    name: 'Sarah Jenkins',
    role: 'Brand Lead',
    company: 'Verve Lifestyle',
    profile_image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
];

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'soc-1',
    platform: 'Instagram',
    label: '@the_digital.ranjan',
    url: 'https://instagram.com/the_digital.ranjan',
    enabled: true,
    sort_order: 1,
  },
  {
    id: 'soc-2',
    platform: 'Instagram (Cinematic)',
    label: '@ranjan.cinematicx',
    url: 'https://instagram.com/ranjan.cinematicx',
    enabled: true,
    sort_order: 2,
  },
  {
    id: 'soc-3',
    platform: 'YouTube',
    label: 'YouTube Channel',
    url: 'https://youtube.com',
    enabled: true,
    sort_order: 3,
  },
  {
    id: 'soc-4',
    platform: 'WhatsApp',
    label: 'Chat on WhatsApp',
    url: 'https://wa.me/919999999999',
    enabled: true,
    sort_order: 4,
  },
  {
    id: 'soc-5',
    platform: 'Email',
    label: 'ranjan.cinematicx@gmail.com',
    url: 'mailto:ranjan.cinematicx@gmail.com',
    enabled: true,
    sort_order: 5,
  },
];

export const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'nav-1', label: 'WORK', href: '#work', enabled: true, sort_order: 1 },
  { id: 'nav-2', label: 'ABOUT', href: '#about', enabled: true, sort_order: 2 },
  { id: 'nav-3', label: 'SERVICES', href: '#services', enabled: true, sort_order: 3 },
  { id: 'nav-4', label: 'PROCESS', href: '#process', enabled: true, sort_order: 4 },
  { id: 'nav-5', label: 'CONTACT', href: '#contact', enabled: true, sort_order: 5 },
];

export const DEFAULT_SEO_SETTINGS: SEOSettings = {
  id: 'primary_seo',
  page_title: 'Ranjan Kumar — Video Editor | Cinematic & Social Media Video Editing',
  meta_description:
    'Ranjan Kumar is a freelance video editor specializing in cinematic films, reels, wedding videos, brand content, color grading and sound design.',
  og_title: 'Ranjan Kumar — Video Editor | Cinematic & Social Media Video Editing',
  og_description:
    'Ranjan Kumar is a freelance video editor specializing in cinematic films, reels, wedding videos, brand content, color grading and sound design.',
  og_image:
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
  favicon: '/favicon.ico',
  robots_index: true,
};
