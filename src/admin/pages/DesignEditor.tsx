import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { Palette, Layout, MousePointer, RotateCcw } from 'lucide-react';

export const DesignEditor: React.FC = () => {
  const { settings, updateSettings } = useCMS();
  const theme = settings.theme;

  const handleColorChange = (key: keyof typeof theme.colors, value: string) => {
    updateSettings({
      ...settings,
      theme: {
        ...theme,
        colors: {
          ...theme.colors,
          [key]: value,
        },
      },
    });
  };

  const handleDesignChange = (key: keyof typeof theme.design, value: any) => {
    updateSettings({
      ...settings,
      theme: {
        ...theme,
        design: {
          ...theme.design,
          [key]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            GLOBAL DESIGN & PALETTE
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Fine-tune the cinematic aesthetic, accent highlights, border radii, film grain, and custom cursor.
          </p>
        </div>
      </div>

      {/* Colors Grid */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-6">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#FF2027]" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
            GLOBAL COLOR PALETTE
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              BACKGROUND (#0A0A0A)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-10 h-10 rounded border border-[#262626] bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={theme.colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="flex-grow bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#FF2027] mb-2">
              ACCENT HIGHLIGHT (#FF2027)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-10 h-10 rounded border border-[#262626] bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={theme.colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="flex-grow bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              SECONDARY BACKGROUND
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.secondaryBackground}
                onChange={(e) => handleColorChange('secondaryBackground', e.target.value)}
                className="w-10 h-10 rounded border border-[#262626] bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={theme.colors.secondaryBackground}
                onChange={(e) => handleColorChange('secondaryBackground', e.target.value)}
                className="flex-grow bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              PRIMARY TEXT (#FFFFFF)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.primaryText}
                onChange={(e) => handleColorChange('primaryText', e.target.value)}
                className="w-10 h-10 rounded border border-[#262626] bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={theme.colors.primaryText}
                onChange={(e) => handleColorChange('primaryText', e.target.value)}
                className="flex-grow bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              SECONDARY MUTED TEXT (#8A8A8A)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.secondaryText}
                onChange={(e) => handleColorChange('secondaryText', e.target.value)}
                className="w-10 h-10 rounded border border-[#262626] bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={theme.colors.secondaryText}
                onChange={(e) => handleColorChange('secondaryText', e.target.value)}
                className="flex-grow bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              BORDER LINES (#262626)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.border}
                onChange={(e) => handleColorChange('border', e.target.value)}
                className="w-10 h-10 rounded border border-[#262626] bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={theme.colors.border}
                onChange={(e) => handleColorChange('border', e.target.value)}
                className="flex-grow bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Layout & Spatial Rules */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-6">
        <div className="flex items-center gap-2">
          <Layout className="w-4 h-4 text-[#FF2027]" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
            SPACING & GEOMETRY
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>SECTION SPACING (DESKTOP)</span>
              <span className="text-white">{theme.design.sectionSpacingDesktop}</span>
            </div>
            <input
              type="range"
              min="60"
              max="200"
              step="10"
              value={parseInt(theme.design.sectionSpacingDesktop, 10)}
              onChange={(e) => handleDesignChange('sectionSpacingDesktop', `${e.target.value}px`)}
              className="w-full accent-[#FF2027]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>SECTION SPACING (MOBILE)</span>
              <span className="text-white">{theme.design.sectionSpacingMobile}</span>
            </div>
            <input
              type="range"
              min="40"
              max="120"
              step="10"
              value={parseInt(theme.design.sectionSpacingMobile, 10)}
              onChange={(e) => handleDesignChange('sectionSpacingMobile', `${e.target.value}px`)}
              className="w-full accent-[#FF2027]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>CARD CORNER RADIUS</span>
              <span className="text-white">{theme.design.cardRadius}</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="2"
              value={parseInt(theme.design.cardRadius, 10)}
              onChange={(e) => handleDesignChange('cardRadius', `${e.target.value}px`)}
              className="w-full accent-[#FF2027]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>BUTTON CORNER RADIUS</span>
              <span className="text-white">{theme.design.buttonRadius}</span>
            </div>
            <input
              type="range"
              min="0"
              max="16"
              step="2"
              value={parseInt(theme.design.buttonRadius, 10)}
              onChange={(e) => handleDesignChange('buttonRadius', `${e.target.value}px`)}
              className="w-full accent-[#FF2027]"
            />
          </div>
        </div>

        {/* Film grain & custom cursor */}
        <div className="pt-4 border-t border-[#262626] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded border border-[#262626]">
            <div>
              <span className="text-xs font-bold uppercase text-white block">
                CUSTOM INTERACTIVE CURSOR
              </span>
              <span className="text-[11px] text-[#8A8A8A]">
                Displays "VIEW" & "PLAY" on hover
              </span>
            </div>
            <input
              type="checkbox"
              checked={theme.design.customCursor}
              onChange={(e) => handleDesignChange('customCursor', e.target.checked)}
              className="w-5 h-5 accent-[#FF2027] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded border border-[#262626]">
            <div>
              <span className="text-xs font-bold uppercase text-white block">
                FILM GRAIN TEXTURE
              </span>
              <span className="text-[11px] text-[#8A8A8A]">
                Cinematic 35mm grain overlay
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400">ACTIVE (3.5%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
