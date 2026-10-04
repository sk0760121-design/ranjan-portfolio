import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { Sparkles, Video, Image, Sliders, RotateCcw } from 'lucide-react';

export const HeroEditor: React.FC = () => {
  const { sections, updateSection, resetSection } = useCMS();
  const heroSection = sections.hero || { id: 'hero', name: 'Hero', enabled: true, content: {} };
  const content = heroSection.content || {};

  const handleUpdate = (field: string, value: any) => {
    updateSection('hero', {
      content: {
        ...content,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            HERO & SHOWREEL SETTINGS
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Configure the main viewport headline, supporting manifesto, video background, and showreel.
          </p>
        </div>

        <button
          onClick={() => resetSection('hero')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase font-mono text-[#8A8A8A] border border-[#262626] hover:text-white hover:border-[#FF2027] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Section</span>
        </button>
      </div>

      {/* Main Copy Section */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#FF2027] font-bold">
          01. HEADLINE & TYPOGRAPHY COPY
        </h3>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            OVERHEAD TAGLINE
          </label>
          <input
            type="text"
            value={content.tagline || ''}
            onChange={(e) => handleUpdate('tagline', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              LINE 1
            </label>
            <input
              type="text"
              value={content.headingLine1 || ''}
              onChange={(e) => handleUpdate('headingLine1', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              LINE 2
            </label>
            <input
              type="text"
              value={content.headingLine2 || ''}
              onChange={(e) => handleUpdate('headingLine2', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              LINE 3
            </label>
            <input
              type="text"
              value={content.headingLine3 || ''}
              onChange={(e) => handleUpdate('headingLine3', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#FF2027] mb-2">
            RED HIGHLIGHT WORD / PHRASE
          </label>
          <input
            type="text"
            value={content.headingHighlight || ''}
            onChange={(e) => handleUpdate('headingHighlight', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#FF2027]/50 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            SUPPORTING MANIFESTO PARAGRAPH
          </label>
          <textarea
            rows={3}
            value={content.supportingCopy || ''}
            onChange={(e) => handleUpdate('supportingCopy', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            FOOTER STATUS / LOCATION TEXT
          </label>
          <input
            type="text"
            value={content.locationText || ''}
            onChange={(e) => handleUpdate('locationText', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#FF2027] font-bold">
          02. CALL-TO-ACTION BUTTONS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              PRIMARY BUTTON TEXT
            </label>
            <input
              type="text"
              value={content.primaryButtonText || ''}
              onChange={(e) => handleUpdate('primaryButtonText', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              SECONDARY BUTTON TEXT
            </label>
            <input
              type="text"
              value={content.secondaryButtonText || ''}
              onChange={(e) => handleUpdate('secondaryButtonText', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
            />
          </div>
        </div>
      </div>

      {/* Background & Media Player */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#FF2027] font-bold">
          03. BACKGROUND MEDIA & SHOWREEL
        </h3>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-white">
            <input
              type="radio"
              name="bgType"
              checked={content.backgroundType === 'video'}
              onChange={() => handleUpdate('backgroundType', 'video')}
              className="text-[#FF2027]"
            />
            <span>Cinematic Video Loop</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-white">
            <input
              type="radio"
              name="bgType"
              checked={content.backgroundType === 'image'}
              onChange={() => handleUpdate('backgroundType', 'image')}
              className="text-[#FF2027]"
            />
            <span>High-Res Static Image</span>
          </label>
        </div>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            BACKGROUND VIDEO URL (MP4 / WebM / CDN)
          </label>
          <input
            type="url"
            value={content.videoUrl || ''}
            onChange={(e) => handleUpdate('videoUrl', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
            placeholder="https://.../video.mp4"
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            POSTER / BACKUP IMAGE URL
          </label>
          <input
            type="url"
            value={content.posterUrl || ''}
            onChange={(e) => handleUpdate('posterUrl', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
            placeholder="https://.../poster.jpg"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs uppercase font-mono tracking-wider text-[#8A8A8A]">
              OVERLAY OPACITY (READABILITY DIMMER)
            </label>
            <span className="font-mono text-xs text-white">
              {Math.round((content.overlayOpacity ?? 0.65) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={content.overlayOpacity ?? 0.65}
            onChange={(e) => handleUpdate('overlayOpacity', parseFloat(e.target.value))}
            className="w-full accent-[#FF2027]"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#8A8A8A]">
            <input
              type="checkbox"
              checked={content.autoplay !== false}
              onChange={(e) => handleUpdate('autoplay', e.target.checked)}
              className="accent-[#FF2027]"
            />
            <span>Autoplay</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#8A8A8A]">
            <input
              type="checkbox"
              checked={content.muted !== false}
              onChange={(e) => handleUpdate('muted', e.target.checked)}
              className="accent-[#FF2027]"
            />
            <span>Muted (Required for autoplay)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#8A8A8A]">
            <input
              type="checkbox"
              checked={content.loop !== false}
              onChange={(e) => handleUpdate('loop', e.target.checked)}
              className="accent-[#FF2027]"
            />
            <span>Loop Video</span>
          </label>
        </div>
      </div>
    </div>
  );
};
