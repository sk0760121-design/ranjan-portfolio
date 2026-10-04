import React from 'react';
import { useCMS } from '../context/CMSContext';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { sections, socialLinks } = useCMS();
  const footerSection = sections.footer;
  const content = footerSection?.content || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (footerSection && !footerSection.enabled) return null;

  return (
    <footer className="w-full bg-[#0A0A0A] border-t border-[#262626] py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
        {/* Brand */}
        <div>
          <a
            href="#"
            className="text-3xl font-black tracking-tighter text-white hover:text-[#FF2027] transition-colors"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            RANJAN<span className="text-[#FF2027]">.</span>
          </a>
          <p className="mt-2 text-xs uppercase tracking-widest text-[#8A8A8A] font-mono">
            {content.tagline || 'Video Editor · Filmmaker · Storyteller'}
          </p>
          <p className="font-footer mt-6 text-xs text-[#8A8A8A]">
            {content.copyright || '© 2026 Ranjan Kumar. All rights reserved.'}
          </p>
        </div>

        {/* Links & Back to top */}
        <div className="flex flex-col md:items-end space-y-6">
          <div className="flex flex-wrap gap-6 text-xs uppercase font-mono tracking-widest text-[#8A8A8A]">
            {socialLinks
              .filter((s) => s.enabled)
              .map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF2027] transition-colors"
                >
                  {link.platform}
                </a>
              ))}
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs text-[#8A8A8A] italic">
              {content.note || 'Designed & edited with intention.'}
            </span>

            <button
              onClick={scrollToTop}
              className="p-3 rounded bg-[#151515] border border-[#262626] text-white hover:border-[#FF2027] hover:text-[#FF2027] transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
