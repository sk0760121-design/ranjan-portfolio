import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { RotateCcw } from 'lucide-react';

export const AboutEditor: React.FC = () => {
  const { sections, updateSection, resetSection } = useCMS();
  const aboutSection = sections.about || { id: 'about', name: 'About', enabled: true, content: {} };
  const content = aboutSection.content || {};

  const handleUpdate = (field: string, value: any) => {
    updateSection('about', {
      content: {
        ...content,
        [field]: value,
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
            ABOUT RANJAN SETTINGS
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Edit personal biography, artistic approach, location, availability badge, and portrait photograph.
          </p>
        </div>

        <button
          onClick={() => resetSection('about')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs uppercase font-mono text-[#8A8A8A] border border-[#262626] hover:text-white hover:border-[#FF2027] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Section</span>
        </button>
      </div>

      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-6">
        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            HEADING
          </label>
          <input
            type="text"
            value={content.heading || ''}
            onChange={(e) => handleUpdate('heading', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            PRIMARY BIO STATEMENT
          </label>
          <textarea
            rows={2}
            value={content.paragraph1 || ''}
            onChange={(e) => handleUpdate('paragraph1', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            SECONDARY DETAIL PARAGRAPH
          </label>
          <textarea
            rows={3}
            value={content.paragraph2 || ''}
            onChange={(e) => handleUpdate('paragraph2', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              LOCATION TEXT
            </label>
            <input
              type="text"
              value={content.location || ''}
              onChange={(e) => handleUpdate('location', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              PORTRAIT IMAGE URL
            </label>
            <input
              type="url"
              value={content.imageUrl || ''}
              onChange={(e) => handleUpdate('imageUrl', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              BUTTON TEXT
            </label>
            <input
              type="text"
              value={content.buttonText || ''}
              onChange={(e) => handleUpdate('buttonText', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              BUTTON TARGET URL
            </label>
            <input
              type="text"
              value={content.buttonUrl || ''}
              onChange={(e) => handleUpdate('buttonUrl', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
