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

  if (ctaSection && !ctaSection.enabled) return null;

  return (
    <section className="relative w-full bg-[#050505] border-t border-[#1C1C1C] py-32 md:py-44 overflow-hidden">
      {/* Cinematic ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF2027]/[0.035] blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center flex flex-col items-center relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-[1.5px] bg-[#FF2027]" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8A8A8A] font-mono font-semibold">
            {content.overhead || 'HAVE A STORY WORTH EDITING?'}
          </span>
          <span className="w-8 h-[1.5px] bg-[#FF2027]" />
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.96] tracking-tight uppercase max-w-5xl font-hero-heading">
          {content.heading || "LET'S MAKE\nSOMETHING\nPEOPLE REMEMBER."}
        </h2>

        <p className="mt-8 text-base md:text-xl text-[#8A8A8A] max-w-2xl leading-relaxed font-normal">
          {content.subtext || "Let's turn your footage into something people remember."}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5 font-button">
          <a
            href={content.primaryButtonUrl || '#contact'}
            className="inline-flex items-center gap-3 px-9 py-4 rounded bg-[#FF2027] text-white hover:bg-[#E0181F] transition-all duration-300 shadow-2xl shadow-[#FF2027]/30 hover:scale-105 font-bold tracking-wider text-xs md:text-sm"
          >
            <span>{content.primaryButtonText || 'START A PROJECT'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenShowreel}
            data-cursor="PLAY"
            className="inline-flex items-center gap-3 px-8 py-4 rounded text-white border border-[#2B2B2B] bg-[#111111]/80 backdrop-blur hover:border-[#FF2027] hover:bg-[#181818] transition-all duration-300 cursor-pointer font-bold tracking-wider text-xs md:text-sm"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{content.secondaryButtonText || 'WATCH SHOWREEL'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
