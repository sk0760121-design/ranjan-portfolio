import React from 'react';
import { useCMS } from '../context/CMSContext';

export const Process: React.FC = () => {
  const { sections, processSteps, settings } = useCMS();
  const processSection = sections.process;
  const content = processSection?.content || {};
  const theme = settings.theme;

  const enabledSteps = processSteps
    .filter((s) => s.enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (processSection && !processSection.enabled) return null;

  return (
    <section
      id="process"
      className="relative w-full bg-[#151515] border-t border-[#262626]/40"
      style={{
        paddingTop: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
        paddingBottom: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[2px] bg-[#FF2027]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] font-semibold">
                WORKFLOW
              </span>
            </div>
            <h2
              className="font-black text-white leading-none tracking-tighter uppercase"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: `clamp(${theme.typography.h2.fontSizeMobile}, 5vw, ${theme.typography.h2.fontSizeDesktop})`,
              }}
            >
              {content.heading || 'PROCESS'}
            </h2>
          </div>

          <p className="max-w-md text-[#8A8A8A] text-sm md:text-base leading-relaxed">
            {content.subheading || 'From raw rushes to pixel-perfect master delivery.'}
          </p>
        </div>

        {/* Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {enabledSteps.map((step, idx) => (
            <div
              key={step.id}
              className="relative p-6 bg-[#0A0A0A] border border-[#262626] rounded flex flex-col justify-between hover:border-[#FF2027] transition-all group"
            >
              <div>
                <span className="font-mono text-2xl font-black text-[#FF2027] block mb-6">
                  {step.step_number || `0${idx + 1}`}
                </span>

                <h3
                  className="text-lg font-bold uppercase tracking-tight text-white mb-3 group-hover:text-[#FF2027] transition-colors"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {step.title}
                </h3>

                <p className="text-xs md:text-sm text-[#8A8A8A] leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#262626]/40 flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A8A8A]">
                  PHASE 0{idx + 1}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#262626] group-hover:bg-[#FF2027] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
