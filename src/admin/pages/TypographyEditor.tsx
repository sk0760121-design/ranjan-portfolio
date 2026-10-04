import React, { useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { BUILT_IN_FONTS, BuiltInFont, getFontFallbackStack } from '../../lib/fonts';
import { CustomFont, TypographyRule } from '../../types/database';
import { DEFAULT_SITE_SETTINGS } from '../../lib/defaults';
import {
  Type,
  Upload,
  Search,
  Check,
  Trash2,
  Edit2,
  Eye,
  Sliders,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  FolderOpen,
  ArrowRight,
  Filter,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

type TypographyGroupKey =
  | 'globalBody'
  | 'heading'
  | 'heroHeading'
  | 'heroSubtitle'
  | 'navigation'
  | 'sectionHeading'
  | 'projectTitle'
  | 'projectDescription'
  | 'button'
  | 'footer';

interface TypographyGroupConfig {
  key: TypographyGroupKey;
  label: string;
  description: string;
  defaultFamily: string;
  hasTransform?: boolean;
}

const TYPOGRAPHY_GROUPS: TypographyGroupConfig[] = [
  {
    key: 'globalBody',
    label: 'GLOBAL BODY FONT',
    description: 'Default text styling used across paragraphs, articles, and general interface text.',
    defaultFamily: 'Plus Jakarta Sans',
  },
  {
    key: 'heading',
    label: 'GENERAL HEADINGS',
    description: 'Primary heading style used for general section headers and modal titles.',
    defaultFamily: 'Syne',
    hasTransform: true,
  },
  {
    key: 'heroHeading',
    label: 'HERO MAIN HEADING',
    description: 'The monumental headline displayed at the top of the homepage hero section.',
    defaultFamily: 'Syne',
    hasTransform: true,
  },
  {
    key: 'heroSubtitle',
    label: 'HERO SUBTITLE / COPY',
    description: 'Supporting introductory description and bio sentence beneath the hero headline.',
    defaultFamily: 'Plus Jakarta Sans',
  },
  {
    key: 'navigation',
    label: 'NAVIGATION LINKS & MENU',
    description: 'Header logo, desktop navigation menu items, and mobile drawer links.',
    defaultFamily: 'Plus Jakarta Sans',
    hasTransform: true,
  },
  {
    key: 'sectionHeading',
    label: 'SECTION HEADINGS',
    description: 'Titles for Selected Work, Services, Skills, Process, Before/After, and Testimonials.',
    defaultFamily: 'Syne',
    hasTransform: true,
  },
  {
    key: 'projectTitle',
    label: 'PROJECT TITLES',
    description: 'Titles displayed on video thumbnail cards and within the project detail view.',
    defaultFamily: 'Syne',
    hasTransform: true,
  },
  {
    key: 'projectDescription',
    label: 'PROJECT DESCRIPTIONS',
    description: 'Short summaries and client/category briefs under project cards.',
    defaultFamily: 'Plus Jakarta Sans',
  },
  {
    key: 'button',
    label: 'BUTTONS & CALLS TO ACTION',
    description: 'Text inside primary action buttons, showreel triggers, and submit buttons.',
    defaultFamily: 'Plus Jakarta Sans',
    hasTransform: true,
  },
  {
    key: 'footer',
    label: 'FOOTER TEXT & COPYRIGHT',
    description: 'Footer attribution, copyright statement, and discreet navigation links.',
    defaultFamily: 'Plus Jakarta Sans',
  },
];

export const TypographyEditor: React.FC = () => {
  const { settings, updateSettings, customFonts, addCustomFont, updateCustomFont, deleteCustomFont } = useCMS();
  const typo = settings.theme.typography;

  const [activeTab, setActiveTab] = useState<'controls' | 'library' | 'custom' | 'fallbacks'>('controls');
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryCategory, setLibraryCategory] = useState<'all' | 'sans-serif' | 'serif' | 'display' | 'monospace'>('all');
  const [customSearch, setCustomSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Custom font renaming state
  const [editingFontId, setEditingFontId] = useState<string | null>(null);
  const [editingFontName, setEditingFontName] = useState('');

  // Font to delete
  const [deleteFontId, setDeleteFontId] = useState<string | null>(null);

  // Quick font assign dropdown target
  const [assignTargetGroup, setAssignTargetGroup] = useState<TypographyGroupKey>('heroHeading');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // All available fonts: Built-in + Active Custom Fonts
  const allFontOptions = [
    ...customFonts
      .filter((cf) => cf.active)
      .map((cf) => ({
        label: `★ ${cf.name} (Custom Font)`,
        value: cf.family_name,
        isCustom: true,
      })),
    ...BUILT_IN_FONTS.map((bf) => ({
      label: `${bf.name} (${bf.category})`,
      value: bf.family,
      isCustom: false,
    })),
  ];

  // Handler to update a specific typography group
  const handleUpdateGroup = (groupKey: TypographyGroupKey, field: keyof TypographyRule, value: any) => {
    const currentRule: TypographyRule = typo[groupKey] || {
      fontSizeDesktop: '16px',
      fontSizeTablet: '15px',
      fontSizeMobile: '14px',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    };

    updateSettings({
      ...settings,
      theme: {
        ...settings.theme,
        typography: {
          ...typo,
          [groupKey]: {
            ...currentRule,
            [field]: value,
          },
        },
      },
    });
  };

  // Handler to reset a group to system default
  const handleResetGroup = (groupKey: TypographyGroupKey) => {
    const defaultVal = (DEFAULT_SITE_SETTINGS.theme.typography as any)[groupKey] || {
      fontSizeDesktop: '16px',
      fontSizeTablet: '15px',
      fontSizeMobile: '14px',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    };

    updateSettings({
      ...settings,
      theme: {
        ...settings.theme,
        typography: {
          ...typo,
          [groupKey]: defaultVal,
        },
      },
    });
  };

  // Handler to upload custom font (.woff2, .woff, .ttf, .otf)
  const handleCustomFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['woff2', 'woff', 'ttf', 'otf'].includes(extension)) {
      setUploadError('Invalid font format. Please upload .woff2, .woff, .ttf, or .otf font files.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, ' ');
    const familyName = 'Custom_' + cleanBaseName.replace(/\s+/g, '');
    const cleanStorageName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storagePath = `fonts/${cleanStorageName}`;

    try {
      let finalUrl = '';

      if (isSupabaseConfigured && supabase) {
        // Upload font to Supabase Storage 'portfolio-media'
        const { error: uploadErr } = await supabase.storage
          .from('portfolio-media')
          .upload(storagePath, file, {
            cacheControl: '31536000',
            upsert: true,
          });

        if (uploadErr) throw uploadErr;

        const { data: pData } = supabase.storage.from('portfolio-media').getPublicUrl(storagePath);
        finalUrl = pData.publicUrl;
      } else {
        // Local preview fallback
        finalUrl = URL.createObjectURL(file);
      }

      const newFont: CustomFont = {
        id: 'font-' + Math.random().toString(36).substring(2, 9),
        name: cleanBaseName,
        family_name: familyName,
        file_url: finalUrl,
        format: extension as 'woff2' | 'woff' | 'ttf' | 'otf',
        weight: '400',
        style: 'normal',
        active: true,
        storage_path: storagePath,
        size_bytes: file.size,
        created_at: new Date().toISOString(),
      };

      addCustomFont(newFont);
      setUploadSuccess(`Custom font "${cleanBaseName}" uploaded and registered successfully!`);
    } catch (err: any) {
      console.error('Font upload failed:', err);
      setUploadError(err.message || 'Font upload failed. Check Supabase storage permissions.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveRename = (fontId: string) => {
    if (!editingFontName.trim()) return;
    updateCustomFont(fontId, { name: editingFontName.trim() });
    setEditingFontId(null);
  };

  const filteredBuiltIn = BUILT_IN_FONTS.filter((font) => {
    const matchesSearch =
      font.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
      font.popularFor?.toLowerCase().includes(librarySearch.toLowerCase());
    const matchesCat = libraryCategory === 'all' || font.category === libraryCategory;
    return matchesSearch && matchesCat;
  });

  const filteredCustom = customFonts.filter((font) =>
    font.name.toLowerCase().includes(customSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            ADVANCED TYPOGRAPHY & FONT MANAGER
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Select from high-performance Google fonts, upload custom web fonts (.woff2, .ttf), and fine-tune responsive scales.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-[#151515] p-1 rounded-lg border border-[#262626]">
          <button
            onClick={() => setActiveTab('controls')}
            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'controls'
                ? 'bg-[#FF2027] text-white font-bold shadow'
                : 'text-[#8A8A8A] hover:text-white'
            }`}
          >
            Typography Controls
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'library'
                ? 'bg-[#FF2027] text-white font-bold shadow'
                : 'text-[#8A8A8A] hover:text-white'
            }`}
          >
            Font Library ({BUILT_IN_FONTS.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-[#FF2027] text-white font-bold shadow'
                : 'text-[#8A8A8A] hover:text-white'
            }`}
          >
            <span>Custom Fonts</span>
            {customFonts.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
                {customFonts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('fallbacks')}
            className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'fallbacks'
                ? 'bg-[#FF2027] text-white font-bold shadow'
                : 'text-[#8A8A8A] hover:text-white'
            }`}
          >
            Fallback Stacks
          </button>
        </div>
      </div>

      {/* Upload Feedback Alerts */}
      {uploadError && (
        <div className="p-4 rounded bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#FF2027]" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-4 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: GRANULAR RESPONSIVE TYPOGRAPHY CONTROLS */}
      {/* ========================================================================= */}
      {activeTab === 'controls' && (
        <div className="space-y-6">
          <div className="p-4 rounded bg-[#111111] border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#FF2027]" />
              <span className="text-xs text-[#8A8A8A]">
                Controls are mapped directly to your site elements. Changes reflect immediately in live preview and update Supabase upon publishing.
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#8A8A8A] shrink-0">
              Safe range bounds active
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {TYPOGRAPHY_GROUPS.map((group) => {
              const rule: TypographyRule = typo[group.key] || {
                fontSizeDesktop: '16px',
                fontSizeTablet: '15px',
                fontSizeMobile: '14px',
                fontWeight: '400',
                lineHeight: '1.5',
                letterSpacing: '0',
                fontFamily: group.defaultFamily,
                textTransform: 'none',
              };

              const activeFamily = rule.fontFamily || group.defaultFamily;
              const fallbackStack = getFontFallbackStack(activeFamily, customFonts);

              return (
                <div
                  key={group.key}
                  className="p-6 bg-[#151515] border border-[#262626] rounded-xl space-y-6 hover:border-[#383838] transition-colors"
                >
                  {/* Top Bar for Group */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#262626]">
                    <div>
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-[#FF2027]" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                          {group.label}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-[#8A8A8A]">{group.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleResetGroup(group.key)}
                        className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-white transition-colors cursor-pointer"
                        title="Reset this group to defaults"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  {/* Font Family Selector & Live Sample */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-2">
                        FONT FAMILY SELECTION
                      </label>
                      <select
                        value={activeFamily}
                        onChange={(e) => handleUpdateGroup(group.key, 'fontFamily', e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF2027] cursor-pointer"
                      >
                        <optgroup label="Custom Uploaded Fonts">
                          {customFonts
                            .filter((cf) => cf.active)
                            .map((cf) => (
                              <option key={cf.id} value={cf.family_name}>
                                ★ {cf.name} (Custom Font)
                              </option>
                            ))}
                        </optgroup>
                        <optgroup label="Built-in / Google Fonts">
                          {BUILT_IN_FONTS.map((font) => (
                            <option key={font.name} value={font.family}>
                              {font.name} ({font.category})
                            </option>
                          ))}
                        </optgroup>
                      </select>

                      <div className="mt-2 text-[10px] font-mono text-[#666666] truncate">
                        Fallback Stack: {fallbackStack}
                      </div>
                    </div>

                    {/* Live Preview Sample */}
                    <div className="p-4 rounded bg-[#0A0A0A] border border-[#262626] flex flex-col justify-center min-h-[90px]">
                      <span className="text-[10px] font-mono uppercase text-[#666666] mb-1">
                        LIVE PREVIEW WITH ACTIVE STACK
                      </span>
                      <p
                        className="truncate text-white"
                        style={{
                          fontFamily: `"${activeFamily}", ${fallbackStack}`,
                          fontWeight: rule.fontWeight || '400',
                          letterSpacing: rule.letterSpacing || '0',
                          lineHeight: rule.lineHeight || '1.4',
                          textTransform: (rule.textTransform as any) || 'none',
                          fontSize: '18px',
                        }}
                      >
                        {group.hasTransform
                          ? 'PRECISION CUTS · COLOR · SOUND'
                          : 'Cinematic storytelling with rhythm and clarity.'}
                      </p>
                    </div>
                  </div>

                  {/* Responsive Font Size Controls (Desktop, Tablet, Mobile) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
                        <span>DESKTOP FONT SIZE</span>
                        <span className="text-white font-bold">{rule.fontSizeDesktop || '16px'}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="120"
                        value={parseInt(rule.fontSizeDesktop || '16', 10)}
                        onChange={(e) =>
                          handleUpdateGroup(group.key, 'fontSizeDesktop', `${e.target.value}px`)
                        }
                        className="w-full accent-[#FF2027]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
                        <span>TABLET FONT SIZE</span>
                        <span className="text-white font-bold">{rule.fontSizeTablet || '15px'}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={parseInt(rule.fontSizeTablet || '15', 10)}
                        onChange={(e) =>
                          handleUpdateGroup(group.key, 'fontSizeTablet', `${e.target.value}px`)
                        }
                        className="w-full accent-[#FF2027]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
                        <span>MOBILE FONT SIZE</span>
                        <span className="text-white font-bold">{rule.fontSizeMobile || '14px'}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="64"
                        value={parseInt(rule.fontSizeMobile || '14', 10)}
                        onChange={(e) =>
                          handleUpdateGroup(group.key, 'fontSizeMobile', `${e.target.value}px`)
                        }
                        className="w-full accent-[#FF2027]"
                      />
                    </div>
                  </div>

                  {/* Font Weight, Line Height, Letter Spacing, Text Transform */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-[#202020]">
                    {/* Weight */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1.5">
                        WEIGHT
                      </label>
                      <select
                        value={rule.fontWeight || '400'}
                        onChange={(e) => handleUpdateGroup(group.key, 'fontWeight', e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF2027]"
                      >
                        <option value="300">300 (Light)</option>
                        <option value="400">400 (Regular)</option>
                        <option value="500">500 (Medium)</option>
                        <option value="600">600 (Semi-Bold)</option>
                        <option value="700">700 (Bold)</option>
                        <option value="800">800 (Extra-Bold)</option>
                        <option value="900">900 (Black)</option>
                      </select>
                    </div>

                    {/* Letter Spacing */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1.5">
                        LETTER SPACING
                      </label>
                      <select
                        value={rule.letterSpacing || '0'}
                        onChange={(e) => handleUpdateGroup(group.key, 'letterSpacing', e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF2027]"
                      >
                        <option value="-0.04em">Tight (-0.04em)</option>
                        <option value="-0.02em">Snug (-0.02em)</option>
                        <option value="0">Normal (0)</option>
                        <option value="0.04em">Spaced (0.04em)</option>
                        <option value="0.1em">Wide (0.1em)</option>
                        <option value="0.2em">Expanded (0.2em)</option>
                      </select>
                    </div>

                    {/* Line Height */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1.5">
                        LINE HEIGHT
                      </label>
                      <select
                        value={rule.lineHeight || '1.5'}
                        onChange={(e) => handleUpdateGroup(group.key, 'lineHeight', e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF2027]"
                      >
                        <option value="0.95">0.95 (Ultra-Tight)</option>
                        <option value="1.02">1.02 (Hero Display)</option>
                        <option value="1.1">1.1 (Heading)</option>
                        <option value="1.25">1.25 (Subheading)</option>
                        <option value="1.4">1.4 (Compact)</option>
                        <option value="1.65">1.65 (Editorial Body)</option>
                        <option value="1.8">1.8 (Relaxed)</option>
                      </select>
                    </div>

                    {/* Text Transform */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1.5">
                        TRANSFORM
                      </label>
                      <select
                        value={rule.textTransform || 'none'}
                        onChange={(e) => handleUpdateGroup(group.key, 'textTransform', e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF2027]"
                      >
                        <option value="none">Normal (None)</option>
                        <option value="uppercase">UPPERCASE</option>
                        <option value="capitalize">Capitalize Words</option>
                        <option value="lowercase">lowercase</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BUILT-IN FONT LIBRARY */}
      {/* ========================================================================= */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          {/* Quick Assign Toolbar */}
          <div className="p-4 bg-[#151515] border border-[#262626] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase text-[#8A8A8A]">
                Quick Assign Target Group:
              </span>
              <select
                value={assignTargetGroup}
                onChange={(e) => setAssignTargetGroup(e.target.value as TypographyGroupKey)}
                className="bg-[#0A0A0A] border border-[#262626] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF2027] cursor-pointer"
              >
                {TYPOGRAPHY_GROUPS.map((g) => (
                  <option key={g.key} value={g.key}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[11px] font-mono text-[#8A8A8A]">
              Click &quot;Apply Font&quot; on any card below to instantly set it.
            </span>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
              <input
                type="text"
                placeholder="Search fonts by name (e.g. Inter, Space Grotesk, Playfair)..."
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                className="w-full bg-[#151515] border border-[#262626] rounded pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#505050] focus:outline-none focus:border-[#FF2027]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {(['all', 'sans-serif', 'serif', 'display', 'monospace'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLibraryCategory(cat)}
                  className={`px-3 py-2 rounded text-xs uppercase font-mono tracking-wider transition-colors cursor-pointer shrink-0 ${
                    libraryCategory === cat
                      ? 'bg-[#FF2027] text-white font-bold'
                      : 'bg-[#151515] text-[#8A8A8A] border border-[#262626] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Font Library Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBuiltIn.map((font) => {
              const isUsedInTarget =
                typo[assignTargetGroup]?.fontFamily?.toLowerCase() === font.family.toLowerCase();

              return (
                <div
                  key={font.name}
                  className="bg-[#151515] border border-[#262626] rounded-xl p-5 flex flex-col justify-between hover:border-[#383838] transition-all space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-white tracking-wide">
                          {font.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#0A0A0A] border border-[#262626] text-[#8A8A8A]">
                            {font.category}
                          </span>
                          {font.popularFor && (
                            <span className="text-[10px] text-[#666666] truncate">
                              Ideal for {font.popularFor}
                            </span>
                          )}
                        </div>
                      </div>

                      {isUsedInTarget && (
                        <span className="flex items-center gap-1 text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    {/* Font Preview Area */}
                    <div className="mt-4 p-4 rounded bg-[#0A0A0A] border border-[#202020] min-h-[90px] flex items-center justify-center text-center">
                      <p
                        className="text-white text-lg tracking-tight"
                        style={{
                          fontFamily: `"${font.family}", ${font.fallback}`,
                        }}
                      >
                        {font.previewText}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#8A8A8A]">
                      <span>Weights: {font.weights.join(', ')}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#262626] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleUpdateGroup(assignTargetGroup, 'fontFamily', font.family)}
                      className={`w-full py-2 rounded text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isUsedInTarget
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-[#FF2027] text-white hover:bg-[#E0181F] font-bold shadow'
                      }`}
                    >
                      {isUsedInTarget ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Currently Applied</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>Apply to {TYPOGRAPHY_GROUPS.find((g) => g.key === assignTargetGroup)?.label}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CUSTOM FONT UPLOAD & MANAGER */}
      {/* ========================================================================= */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          {/* Upload Banner */}
          <div className="p-6 bg-[#151515] border border-dashed border-[#383838] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#FF2027]" />
                <span>UPLOAD CUSTOM WEBFONT FILE</span>
              </h3>
              <p className="text-xs text-[#8A8A8A] max-w-xl">
                Upload your purchased or proprietary brand fonts (.woff2, .woff, .ttf, .otf). Files are stored directly in Supabase Storage and registered with automatic CSS @font-face and safe fallback stacks.
              </p>
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCustomFontUpload}
                accept=".woff2,.woff,.ttf,.otf"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-5 py-3 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#FF2027]/20"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'UPLOADING FONT...' : 'UPLOAD FONT FILE'}</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
            <input
              type="text"
              placeholder="Search uploaded custom fonts..."
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              className="w-full bg-[#151515] border border-[#262626] rounded pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#505050] focus:outline-none focus:border-[#FF2027]"
            />
          </div>

          {/* Uploaded Fonts List */}
          {filteredCustom.length === 0 ? (
            <div className="p-12 text-center bg-[#151515] border border-[#262626] rounded-xl space-y-3">
              <FolderOpen className="w-10 h-10 text-[#505050] mx-auto" />
              <p className="text-sm font-semibold text-white">No custom fonts uploaded yet</p>
              <p className="text-xs text-[#8A8A8A] max-w-md mx-auto">
                Use the upload button above to add .woff2 or .ttf font files. They will show up here and in the font dropdowns across all typography groups.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCustom.map((font) => (
                <div
                  key={font.id}
                  className="bg-[#151515] border border-[#262626] rounded-xl p-5 space-y-4 hover:border-[#383838] transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-grow">
                      {editingFontId === font.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingFontName}
                            onChange={(e) => setEditingFontName(e.target.value)}
                            className="bg-[#0A0A0A] border border-[#FF2027] rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRename(font.id)}
                            className="p-1.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer"
                            title="Save display name"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{font.name}</h4>
                          <button
                            onClick={() => {
                              setEditingFontId(font.id);
                              setEditingFontName(font.name);
                            }}
                            className="text-[#666666] hover:text-white cursor-pointer"
                            title="Rename Display Name"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#0A0A0A] border border-[#262626] text-[#FF2027]">
                          .{font.format}
                        </span>
                        <span className="text-[10px] font-mono text-[#8A8A8A]">
                          CSS Family: &quot;{font.family_name}&quot;
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Active toggle */}
                      <button
                        onClick={() => updateCustomFont(font.id, { active: !font.active })}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase cursor-pointer transition-colors ${
                          font.active
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                        title={font.active ? 'Font is active in stylesheet' : 'Font is disabled'}
                      >
                        {font.active ? 'ACTIVE' : 'INACTIVE'}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteFontId(font.id)}
                        className="p-1.5 rounded text-[#8A8A8A] hover:text-red-400 hover:bg-[#262626] transition-colors cursor-pointer"
                        title="Delete custom font"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Live Render Preview */}
                  <div className="p-4 rounded bg-[#0A0A0A] border border-[#202020] min-h-[85px] flex items-center justify-center text-center">
                    <p
                      className="text-white text-lg tracking-tight"
                      style={{
                        fontFamily: `'${font.family_name}', -apple-system, BlinkMacSystemFont, sans-serif`,
                      }}
                    >
                      THE CINEMATIC CUT · 2026
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8A8A8A] pt-2 border-t border-[#202020]">
                    <span>
                      {font.size_bytes
                        ? (font.size_bytes / 1024).toFixed(1) + ' KB'
                        : 'Webfont'}
                    </span>
                    <span>Added {new Date(font.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FONT FALLBACK STACKS */}
      {/* ========================================================================= */}
      {activeTab === 'fallbacks' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#151515] border border-[#262626] rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#FF2027]" />
              <h3 className="text-base font-bold text-white uppercase">
                AUTOMATIC FONT FALLBACK SYSTEM
              </h3>
            </div>
            <p className="text-xs text-[#8A8A8A] leading-relaxed">
              Every font on your site includes a cascading fallback stack. If an external webfont or custom font is slow to load or encounters a network disruption, the browser instantly falls back to the configured system stack without breaking your layout, preventing FOIT (Flash of Invisible Text) and layout shifts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded bg-[#0A0A0A] border border-[#262626] space-y-2">
                <span className="text-xs font-mono uppercase text-[#FF2027] font-bold">
                  SANS-SERIF FALLBACK STACK
                </span>
                <p className="text-xs font-mono text-[#8A8A8A] break-all">
                  -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif
                </p>
              </div>

              <div className="p-4 rounded bg-[#0A0A0A] border border-[#262626] space-y-2">
                <span className="text-xs font-mono uppercase text-[#FF2027] font-bold">
                  SERIF FALLBACK STACK
                </span>
                <p className="text-xs font-mono text-[#8A8A8A] break-all">
                  Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif
                </p>
              </div>

              <div className="p-4 rounded bg-[#0A0A0A] border border-[#262626] space-y-2">
                <span className="text-xs font-mono uppercase text-[#FF2027] font-bold">
                  DISPLAY / POSTER STACK
                </span>
                <p className="text-xs font-mono text-[#8A8A8A] break-all">
                  Impact, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, sans-serif
                </p>
              </div>

              <div className="p-4 rounded bg-[#0A0A0A] border border-[#262626] space-y-2">
                <span className="text-xs font-mono uppercase text-[#FF2027] font-bold">
                  MONOSPACE / TECH STACK
                </span>
                <p className="text-xs font-mono text-[#8A8A8A] break-all">
                  &quot;Space Grotesk&quot;, Menlo, Monaco, Consolas, &quot;Liberation Mono&quot;, monospace
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Font Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteFontId)}
        title="Delete Custom Font"
        message="Are you sure you want to delete this custom font? Any typography group currently using this font will safely fall back to its system font stack without breaking the website."
        onConfirm={() => {
          if (deleteFontId) {
            deleteCustomFont(deleteFontId);
            setDeleteFontId(null);
          }
        }}
        onCancel={() => setDeleteFontId(null)}
      />
    </div>
  );
};
