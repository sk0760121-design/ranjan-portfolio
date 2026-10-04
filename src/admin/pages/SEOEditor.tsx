import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { Globe, Share2, Shield, RotateCcw } from 'lucide-react';
import { DEFAULT_SEO_SETTINGS } from '../../lib/defaults';

export const SEOEditor: React.FC = () => {
  const { seoSettings, updateSEO } = useCMS();

  const handleUpdate = (field: string, val: any) => {
    updateSEO({
      ...seoSettings,
      [field]: val,
    });
  };

  const handleReset = () => {
    updateSEO(DEFAULT_SEO_SETTINGS);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            SEARCH ENGINE OPTIMIZATION & SOCIAL CARDS
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Configure Google search metadata, OpenGraph cards, Twitter preview cards, and indexing.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase font-mono text-[#8A8A8A] border border-[#262626] hover:text-white hover:border-[#FF2027] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-6">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#FF2027]" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
            SEARCH ENGINE METADATA
          </h3>
        </div>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            PAGE TITLE TAG (&lt;title&gt;)
          </label>
          <input
            type="text"
            value={seoSettings.page_title}
            onChange={(e) => handleUpdate('page_title', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            META DESCRIPTION
          </label>
          <textarea
            rows={3}
            value={seoSettings.meta_description}
            onChange={(e) => handleUpdate('meta_description', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
          />
        </div>
      </div>

      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-6">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#FF2027]" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
            SOCIAL SHARING & OPENGRAPH CARDS
          </h3>
        </div>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            OG SHARE TITLE
          </label>
          <input
            type="text"
            value={seoSettings.og_title}
            onChange={(e) => handleUpdate('og_title', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            OG SHARE DESCRIPTION
          </label>
          <textarea
            rows={2}
            value={seoSettings.og_description}
            onChange={(e) => handleUpdate('og_description', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            OG BANNER IMAGE URL (1200x630PX RECOMMENDED)
          </label>
          <input
            type="url"
            value={seoSettings.og_image || ''}
            onChange={(e) => handleUpdate('og_image', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
          />
        </div>

        <div className="pt-2 flex items-center justify-between p-4 bg-[#0A0A0A] rounded border border-[#262626]">
          <div>
            <span className="text-xs font-bold uppercase text-white block">
              ALLOW SEARCH ROBOTS INDEXING
            </span>
            <span className="text-[11px] text-[#8A8A8A]">
              Toggles index/follow directive for Google and Bing
            </span>
          </div>
          <input
            type="checkbox"
            checked={seoSettings.robots_index}
            onChange={(e) => handleUpdate('robots_index', e.target.checked)}
            className="w-5 h-5 accent-[#FF2027] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
