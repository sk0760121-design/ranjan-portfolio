import React from 'react';
import { useCMS } from '../context/CMSContext';

export const Philosophy: React.FC = () => {
  const { sections, settings } = useCMS();
  const philSection = sections.philosophy;
  const content = philSection?.content || {};
  const theme = settings.theme;

  if (philSection && !philSection.enabled) return null;

  return (
    <section
      className="relative w-full bg-[#151515] py-24 md:py-32 overflow-hidden border-t border-[#262626]/40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center flex flex-col items-center">
        <span className="text-xs uppercase tracking-[0.3em] text-[#FF2027] font-semibold mb-6 block">
          CREATIVE MANIFESTO
        </span>

        <h2
          className="font-black text-white leading-[0.92] tracking-tighter uppercase whitespace-pre-line max-w-4xl"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: `clamp(40px, 7vw, 100px)`,
          }}
        >
          {content.statement || 'EVERY\nFRAME\nSHOULD\nEARN ITS\nPLACE.'}
        </h2>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 text-sm md:text-base text-[#8A8A8A] font-mono">
          <span>{content.subtext1 || 'No unnecessary cuts. No meaningless effects.'}</span>
          <span className="hidden sm:inline text-[#FF2027]">/</span>
          <span className="text-white font-medium">{content.subtext2 || 'Just intentional storytelling.'}</span>
        </div>
      </div>
    </section>
  );
};
