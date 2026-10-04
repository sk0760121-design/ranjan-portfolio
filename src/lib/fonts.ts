import { CustomFont, TypographyRule } from '../types/database';

export interface BuiltInFont {
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'monospace';
  weights: number[];
  googleFontFamily: string; // Query param for Google Fonts
  fallback: string;
  previewText?: string;
  popularFor?: string;
}

export const BUILT_IN_FONTS: BuiltInFont[] = [
  {
    name: 'Syne',
    family: 'Syne',
    category: 'display',
    weights: [400, 500, 600, 700, 800],
    googleFontFamily: 'Syne:wght@400;500;600;700;800',
    fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    previewText: 'CINEMATIC STORYTELLING',
    popularFor: 'Headings, Hero Titles',
  },
  {
    name: 'Plus Jakarta Sans',
    family: 'Plus Jakarta Sans',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700, 800],
    googleFontFamily: 'Plus+Jakarta+Sans:wght@300;400;500;600;700;800',
    fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    previewText: 'From the first cut to color grading.',
    popularFor: 'Body text, Navigation, UI',
  },
  {
    name: 'Inter',
    family: 'Inter',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700, 800, 900],
    googleFontFamily: 'Inter:wght@300;400;500;600;700;800;900',
    fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    previewText: 'Precision cuts and rhythm.',
    popularFor: 'Global Body, UI Elements',
  },
  {
    name: 'Space Grotesk',
    family: 'Space Grotesk',
    category: 'display',
    weights: [400, 500, 600, 700],
    googleFontFamily: 'Space+Grotesk:wght@400;500;600;700',
    fallback: 'monospace',
    previewText: '4K UHD · 60FPS · LOG EDITING',
    popularFor: 'Tags, Meta labels, Tech specs',
  },
  {
    name: 'Poppins',
    family: 'Poppins',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700, 800],
    googleFontFamily: 'Poppins:wght@300;400;500;600;700;800',
    fallback: 'sans-serif',
    previewText: 'Modern editorial aesthetics.',
    popularFor: 'Headings, Buttons',
  },
  {
    name: 'Montserrat',
    family: 'Montserrat',
    category: 'sans-serif',
    weights: [400, 500, 600, 700, 800, 900],
    googleFontFamily: 'Montserrat:wght@400;500;600;700;800;900',
    fallback: 'sans-serif',
    previewText: 'BOLD VISUAL IMPACT',
    popularFor: 'Section titles, Navigation',
  },
  {
    name: 'Manrope',
    family: 'Manrope',
    category: 'sans-serif',
    weights: [400, 500, 600, 700, 800],
    googleFontFamily: 'Manrope:wght@400;500;600;700;800',
    fallback: 'sans-serif',
    previewText: 'Clean modern filmmaking folio.',
    popularFor: 'Body copy, Descriptions',
  },
  {
    name: 'DM Sans',
    family: 'DM Sans',
    category: 'sans-serif',
    weights: [400, 500, 700],
    googleFontFamily: 'DM+Sans:wght@400;500;700',
    fallback: 'sans-serif',
    previewText: 'Paced for high engagement.',
    popularFor: 'Body, Captions',
  },
  {
    name: 'Bebas Neue',
    family: 'Bebas Neue',
    category: 'display',
    weights: [400],
    googleFontFamily: 'Bebas+Neue',
    fallback: 'Impact, sans-serif',
    previewText: 'DIRECTOR CUT · 2026',
    popularFor: 'Hero titles, Project numbers',
  },
  {
    name: 'Anton',
    family: 'Anton',
    category: 'display',
    weights: [400],
    googleFontFamily: 'Anton',
    fallback: 'Impact, sans-serif',
    previewText: 'STOP SCROLLING',
    popularFor: 'Poster typography, Big headlines',
  },
  {
    name: 'Oswald',
    family: 'Oswald',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    googleFontFamily: 'Oswald:wght@400;500;600;700',
    fallback: 'sans-serif',
    previewText: 'CINEMATIC COLOR GRADING',
    popularFor: 'Section headings, Stats',
  },
  {
    name: 'Playfair Display',
    family: 'Playfair Display',
    category: 'serif',
    weights: [400, 600, 700, 800, 900],
    googleFontFamily: 'Playfair+Display:wght@400;600;700;800;900',
    fallback: 'Georgia, "Times New Roman", serif',
    previewText: 'The Art of Motion Narrative.',
    popularFor: 'Luxury, Wedding & Film titles',
  },
  {
    name: 'Libre Baskerville',
    family: 'Libre Baskerville',
    category: 'serif',
    weights: [400, 700],
    googleFontFamily: 'Libre+Baskerville:wght@400;700',
    fallback: 'Baskerville, Georgia, serif',
    previewText: 'Editorial stories crafted with soul.',
    popularFor: 'Philosophy, Quotes, Editorial',
  },
  {
    name: 'Lora',
    family: 'Lora',
    category: 'serif',
    weights: [400, 500, 600, 700],
    googleFontFamily: 'Lora:wght@400;500;600;700',
    fallback: 'Georgia, serif',
    previewText: 'Words and frames harmonized.',
    popularFor: 'Testimonials, Long descriptions',
  },
  {
    name: 'Cinzel',
    family: 'Cinzel',
    category: 'serif',
    weights: [400, 600, 700, 800],
    googleFontFamily: 'Cinzel:wght@400;600;700;800',
    fallback: 'Georgia, serif',
    previewText: 'MASTERCLASS IN PACING',
    popularFor: 'Theatrical trailers, Hero headings',
  },
  {
    name: 'Roboto',
    family: 'Roboto',
    category: 'sans-serif',
    weights: [300, 400, 500, 700, 900],
    googleFontFamily: 'Roboto:wght@300;400;500;700;900',
    fallback: 'sans-serif',
    previewText: 'Standard reliable typographic flow.',
    popularFor: 'Data, Contact forms, Footers',
  },
  {
    name: 'Open Sans',
    family: 'Open Sans',
    category: 'sans-serif',
    weights: [400, 600, 700, 800],
    googleFontFamily: 'Open+Sans:wght@400;600;700;800',
    fallback: 'sans-serif',
    previewText: 'Universal clean readability.',
    popularFor: 'Body copy, Descriptions',
  },
];

// Helper to get fallback stack for any font family
export function getFontFallbackStack(fontFamily: string, customFonts: CustomFont[] = []): string {
  // Check if it's a custom uploaded font
  const custom = customFonts.find((f) => f.family_name === fontFamily || f.name === fontFamily);
  if (custom) {
    return `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  }

  // Check built-in fonts
  const builtIn = BUILT_IN_FONTS.find((f) => f.family.toLowerCase() === fontFamily.toLowerCase());
  if (builtIn) {
    return `"${builtIn.family}", ${builtIn.fallback}`;
  }

  // Generic fallback
  return `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
}

// Generate URL for Google Fonts containing ONLY currently needed families
export function generateGoogleFontsUrl(usedFamilies: string[]): string | null {
  const matchingFamilies = BUILT_IN_FONTS.filter((font) =>
    usedFamilies.some((used) => used.toLowerCase() === font.family.toLowerCase())
  );

  if (matchingFamilies.length === 0) return null;

  const queryFamilies = matchingFamilies.map((f) => `family=${f.googleFontFamily}`).join('&');
  return `https://fonts.googleapis.com/css2?${queryFamilies}&display=swap`;
}
