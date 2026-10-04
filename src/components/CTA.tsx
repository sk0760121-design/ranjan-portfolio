import React from 'react';
import { useCMS } from '../context/CMSContext';
import { ArrowUpRight, Play } from 'lucide-react';

interface CTAProps {
  onOpenShowreel: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onOpenShowreel }) => {
  const { sections, settings } = useCMS();
  const ctaSection = sections.cta;
  const content = ctaSection?.content || {};
  const theme = settings.theme;

  if (ctaSection && !ctaSection.enabled) return null;

  return (
    <section
      className="relative w-full bg-[#0A0A0A] border-t border-[#262626]/40"
      style={{
        paddingTop: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
        paddingBottom: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-[2px] bg-[#FF2027]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#8A8A8A] font-semibold">
            {content.overhead || 'HAVE A PROJECT IN MIND?'}
          </span>
          <span className="w-8 h-[2px] bg-[#FF2027]" />
        </div>

        <h2
          className="font-black text-white leading-[0.95] tracking-tighter uppercase whitespace-pre-line max-w-4xl"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: `clamp(${theme.typography.h2.fontSizeMobile}, 6vw, ${theme.typography.h1.fontSizeDesktop})`,
          }}
        >
          {content.heading || "LET'S MAKE\nSOMETHING\nPEOPLE\nREMEMBER."}
        </h2>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <a
            href={content.primaryButtonUrl || '#contact'}
            className="inline-flex items-center gap-3 px-8 py-4 rounded text-xs md:text-sm font-bold uppercase tracking-wider bg-[#FF2027] text-white hover:bg-[#E0181F] transition-all shadow-xl shadow-[#FF2027]/25 hover:scale-105"
          >
            <span>{content.primaryButtonText || 'START A PROJECT'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenShowreel}
            data-cursor="PLAY"
            className="inline-flex items-center gap-3 px-8 py-4 rounded text-xs md:text-sm font-bold uppercase tracking-wider text-white border border-[#262626] bg-[#151515] hover:border-[#FF2027] hover:bg-[#1a1a1a] transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{content.secondaryButtonText || 'WATCH SHOWREEL'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
