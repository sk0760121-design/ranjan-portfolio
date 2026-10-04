import React from 'react';
import { useCMS } from '../context/CMSContext';

export const Results: React.FC = () => {
  const { sections, settings } = useCMS();
  const resultsSection = sections.results;
  const content = resultsSection?.content || {};
  const theme = settings.theme;

  const stats = content.stats || [
    { value: '100K+', label: 'Views generated', id: '1' },
    { value: '140K+', label: 'Highest-performing project', id: '2' },
    { value: '4+', label: 'Editing categories', id: '3' },
    { value: '∞', label: 'Frames perfected', id: '4' },
  ];

  if (resultsSection && !resultsSection.enabled) return null;

  return (
    <section
      id="results"
      className="relative w-full bg-[#151515] border-y border-[#262626]/60"
      style={{
        paddingTop: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
        paddingBottom: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Headline */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[2px] bg-[#FF2027]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] font-semibold">
                IMPACT & REACH
              </span>
            </div>
            <h2
              className="font-black text-white leading-[0.98] tracking-tighter uppercase whitespace-pre-line"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: `clamp(${theme.typography.h2.fontSizeMobile}, 4.2vw, ${theme.typography.h2.fontSizeDesktop})`,
              }}
            >
              {content.heading || 'THE EDIT\nIS ONLY HALF\nTHE STORY.'}
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-8 md:gap-12">
            {stats.map((stat: any, index: number) => (
              <div
                key={stat.id || index}
                className="flex flex-col border-l-2 border-[#262626] pl-6 hover:border-[#FF2027] transition-colors"
              >
                <span
                  className="font-black text-white tracking-tight"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(38px, 4vw, 56px)',
                  }}
                >
                  {stat.value}
                </span>
                <span className="mt-2 text-xs md:text-sm uppercase tracking-wider text-[#8A8A8A] font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
