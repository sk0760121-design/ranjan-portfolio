import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { Quote, ArrowLeft, ArrowRight } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { sections, testimonials } = useCMS();
  const testSection = sections.testimonials;
  const content = testSection?.content || {};

  const published = testimonials
    .filter((t) => t.published)
    .sort((a, b) => a.sort_order - b.sort_order);

  const [currentIndex, setCurrentIndex] = useState(0);

  if ((testSection && !testSection.enabled) || published.length === 0) return null;

  const current = published[currentIndex] || published[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? published.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === published.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="testimonials"
      className="relative w-full bg-[#0A0A0A] border-t border-[#1C1C1C] py-28 md:py-36 overflow-hidden"
    >
      {/* Background quote mark watermark */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 text-white/[0.015] pointer-events-none select-none font-serif text-[400px] leading-none">
        “
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-12 border-b border-[#222222]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[1.5px] bg-[#FF2027]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8A8A8A] font-mono font-semibold">
                DIRECTOR & CLIENT ENDORSEMENTS
              </span>
            </div>
            <h2 className="font-section-heading section-heading-text text-white tracking-tight uppercase">
              {content.heading || 'WHAT CREATORS SAY'}
            </h2>
          </div>

          {/* Navigation Controls */}
          {published.length > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#8A8A8A] mr-2">
                {String(currentIndex + 1).padStart(2, '0')} / {String(published.length).padStart(2, '0')}
              </span>
              <button
                onClick={handlePrev}
                className="w-11 h-11 rounded-full border border-[#333333] hover:border-[#FF2027] text-white flex items-center justify-center transition-colors cursor-pointer hover:bg-white/[0.04]"
                aria-label="Previous endorsement"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-full border border-[#333333] hover:border-[#FF2027] text-white flex items-center justify-center transition-colors cursor-pointer hover:bg-white/[0.04]"
                aria-label="Next endorsement"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Featured Large Editorial Quote */}
        <div className="max-w-4xl py-6 space-y-10">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white leading-[1.25] tracking-tight font-sans">
            &ldquo;{current.quote}&rdquo;
          </p>

          <div className="flex items-center gap-5 pt-4">
            {current.profile_image ? (
              <img
                src={current.profile_image}
                alt={current.name}
                className="w-14 h-14 rounded-full object-cover border border-[#333333] filter brightness-95"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center font-bold text-white text-base font-mono">
                {current.name.substring(0, 2).toUpperCase()}
              </div>
            )}

            <div className="space-y-0.5">
              <h4 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                {current.name}
              </h4>
              <p className="text-xs font-mono text-[#8A8A8A]">
                {current.role} {current.company ? `· ${current.company}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
