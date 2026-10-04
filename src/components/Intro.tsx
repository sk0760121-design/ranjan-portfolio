import React from 'react';
import { useCMS } from '../context/CMSContext';

export const Intro: React.FC = () => {
  const { sections, settings } = useCMS();
  const introSection = sections.intro;
  const content = introSection?.content || {};
  const theme = settings.theme;

  if (introSection && !introSection.enabled) return null;

  return (
    <section
      id="intro"
      className="relative w-full bg-[#0A0A0A] border-t border-[#262626]/40"
      style={{
        paddingTop: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
        paddingBottom: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Section Label */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[2px] bg-[#FF2027]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] font-semibold">
                {content.label || 'A LITTLE ABOUT MY WORK'}
              </span>
            </div>
          </div>

          {/* Statement and details */}
          <div className="lg:col-span-8 flex flex-col space-y-8">
            <h2
              className="font-black text-white leading-[1.08] tracking-tighter uppercase whitespace-pre-line"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: `clamp(${theme.typography.h2.fontSizeMobile}, 4.2vw, ${theme.typography.h2.fontSizeDesktop})`,
              }}
            >
              {content.statement ||
                "GOOD EDITING ISN'T ABOUT ADDING MORE.\nIT'S ABOUT KNOWING WHAT TO REMOVE."}
            </h2>

            <div className="w-16 h-[2px] bg-[#FF2027]/70" />

            <p
              className="text-[#8A8A8A] max-w-2xl leading-relaxed text-base md:text-lg"
              style={{
                fontSize: `clamp(${theme.typography.body.fontSizeMobile}, 1.5vw, ${theme.typography.body.fontSizeDesktop})`,
              }}
            >
              {content.description ||
                'From the first cut to the final sound design, I focus on pacing, emotion and visual storytelling — turning raw footage into content people actually want to watch.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
