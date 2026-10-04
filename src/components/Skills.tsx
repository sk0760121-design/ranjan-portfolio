import React from 'react';
import { useCMS } from '../context/CMSContext';

export const Skills: React.FC = () => {
  const { sections, skills, settings } = useCMS();
  const skillsSection = sections.skills;
  const content = skillsSection?.content || {};
  const theme = settings.theme;

  const enabledSkills = skills
    .filter((s) => s.enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (skillsSection && !skillsSection.enabled) return null;

  return (
    <section
      id="skills"
      className="relative w-full bg-[#0A0A0A] border-t border-[#262626]/40"
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
                EXPERTISE
              </span>
            </div>
            <h2
              className="font-black text-white leading-none tracking-tighter uppercase"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: `clamp(${theme.typography.h2.fontSizeMobile}, 5vw, ${theme.typography.h2.fontSizeDesktop})`,
              }}
            >
              {content.heading || 'CORE CAPABILITIES'}
            </h2>
          </div>

          <p className="max-w-md text-[#8A8A8A] text-sm md:text-base leading-relaxed">
            {content.subheading || 'Technical finesse paired with directorial intuition.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {enabledSkills.map((skill, index) => (
            <div
              key={skill.id}
              className="p-6 bg-[#151515] border border-[#262626] rounded flex flex-col justify-between hover:border-[#FF2027]/50 transition-colors group"
            >
              <div>
                <span className="text-xs font-mono text-[#8A8A8A] tracking-widest block mb-3">
                  0{index + 1}
                </span>
                <h3 className="text-base font-bold uppercase tracking-tight text-white group-hover:text-[#FF2027] transition-colors">
                  {skill.name}
                </h3>
              </div>
              {skill.description && (
                <p className="mt-3 text-xs text-[#8A8A8A] leading-relaxed">
                  {skill.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
