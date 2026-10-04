import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { Type, RotateCcw } from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '../../lib/defaults';

export const TypographyEditor: React.FC = () => {
  const { settings, updateSettings } = useCMS();
  const typo = settings.theme.typography;

  const handleUpdate = (level: 'h1' | 'h2' | 'h3' | 'body', field: string, val: string) => {
    updateSettings({
      ...settings,
      theme: {
        ...settings.theme,
        typography: {
          ...typo,
          [level]: {
            ...typo[level],
            [field]: val,
          },
        },
      },
    });
  };

  const handleReset = (level: 'h1' | 'h2' | 'h3' | 'body') => {
    updateSettings({
      ...settings,
      theme: {
        ...settings.theme,
        typography: {
          ...typo,
          [level]: { ...DEFAULT_SITE_SETTINGS.theme.typography[level] },
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
            RESPONSIVE TYPOGRAPHY CONTROLS
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Configure font scales across Desktop, Tablet, and Mobile devices with safe bounded ranges.
          </p>
        </div>
      </div>

      {/* H1 Heading */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-[#FF2027]" />
            <h3 className="text-sm font-bold uppercase text-white">
              H1 MAIN HERO HEADINGS
            </h3>
          </div>
          <button
            onClick={() => handleReset('h1')}
            className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset H1</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>DESKTOP FONT SIZE</span>
              <span className="text-white font-bold">{typo.h1.fontSizeDesktop}</span>
            </div>
            <input
              type="range"
              min="48"
              max="140"
              value={parseInt(typo.h1.fontSizeDesktop, 10)}
              onChange={(e) => handleUpdate('h1', 'fontSizeDesktop', `${e.target.value}px`)}
              className="w-full accent-[#FF2027]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>TABLET FONT SIZE</span>
              <span className="text-white font-bold">{typo.h1.fontSizeTablet}</span>
            </div>
            <input
              type="range"
              min="36"
              max="96"
              value={parseInt(typo.h1.fontSizeTablet, 10)}
              onChange={(e) => handleUpdate('h1', 'fontSizeTablet', `${e.target.value}px`)}
              className="w-full accent-[#FF2027]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>MOBILE FONT SIZE</span>
              <span className="text-white font-bold">{typo.h1.fontSizeMobile}</span>
            </div>
            <input
              type="range"
              min="28"
              max="64"
              value={parseInt(typo.h1.fontSizeMobile, 10)}
              onChange={(e) => handleUpdate('h1', 'fontSizeMobile', `${e.target.value}px`)}
              className="w-full accent-[#FF2027]"
            />
          </div>
        </div>
      </div>

      {/* H2 Heading */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-[#FF2027]" />
            <h3 className="text-sm font-bold uppercase text-white">
              H2 SECTION HEADINGS
            </h3>
          </div>
          <button
            onClick={() => handleReset('h2')}
            className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset H2</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>DESKTOP FONT SIZE</span>
              <span className="text-white font-bold">{typo.h2.fontSizeDesktop}</span>
            </div>
            <input
              type="range"
              min="32"
              max="90"
              value={parseInt(typo.h2.fontSizeDesktop, 10)}
              onChange={(e) => handleUpdate('h2', 'fontSizeDesktop', `${e.target.value}px`)}
              className="w-full accent-[#FF2027]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>TABLET FONT SIZE</span>
              <span className="text-white font-bold">{typo.h2.fontSizeTablet}</span>
            </div>
            <input
              type="range"
              min="26"
              max="64"
              value={parseInt(typo.h2.fontSizeTablet, 10)}
              onChange={(e) => handleUpdate('h2', 'fontSizeTablet', `${e.target.value}px`)}
              className="w-full accent-[#FF2027]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>MOBILE FONT SIZE</span>
              <span className="text-white font-bold">{typo.h2.fontSizeMobile}</span>
            </div>
            <input
              type="range"
              min="22"
              max="48"
              value={parseInt(typo.h2.fontSizeMobile, 10)}
              onChange={(e) => handleUpdate('h2', 'fontSizeMobile', `${e.target.value}px`)}
              className="w-full accent-[#FF2027]"
            />
          </div>
        </div>
      </div>

      {/* Body Copy */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-[#FF2027]" />
            <h3 className="text-sm font-bold uppercase text-white">
              BODY COPY & PARAGRAPHS
            </h3>
          </div>
          <button
            onClick={() => handleReset('body')}
            className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Body</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>DESKTOP FONT SIZE</span>
              <span className="text-white font-bold">{typo.body.fontSizeDesktop}</span>
            </div>
            <input
              type="range"
              min="14"
              max="22"
              value={parseInt(typo.body.fontSizeDesktop, 10)}
              onChange={(e) => handleUpdate('body', 'fontSizeDesktop', `${e.target.value}px`)}
              className="w-full accent-[#FF2027]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>TABLET FONT SIZE</span>
              <span className="text-white font-bold">{typo.body.fontSizeTablet}</span>
            </div>
            <input
              type="range"
              min="13"
              max="20"
              value={parseInt(typo.body.fontSizeTablet, 10)}
              onChange={(e) => handleUpdate('body', 'fontSizeTablet', `${e.target.value}px`)}
              className="w-full accent-[#FF2027]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>MOBILE FONT SIZE</span>
              <span className="text-white font-bold">{typo.body.fontSizeMobile}</span>
            </div>
            <input
              type="range"
              min="12"
              max="18"
              value={parseInt(typo.body.fontSizeMobile, 10)}
              onChange={(e) => handleUpdate('body', 'fontSizeMobile', `${e.target.value}px`)}
              className="w-full accent-[#FF2027]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
