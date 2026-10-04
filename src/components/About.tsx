import React from 'react';
import { useCMS } from '../context/CMSContext';
import { ArrowUpRight } from 'lucide-react';

export const About: React.FC = () => {
  const { sections, settings } = useCMS();
  const aboutSection = sections.about;
  const content = aboutSection?.content || {};
  const theme = settings.theme;

  if (aboutSection && !aboutSection.enabled) return null;

  return (
    <section
      id="about"
      className="relative w-full bg-[#0A0A0A] border-t border-[#262626]/40"
      style={{
        paddingTop: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
        paddingBottom: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Portrait Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded overflow-hidden border border-[#262626]">
              <img
                src={
                  content.imageUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80'
                }
                alt="Ranjan Kumar - Video Editor"
                className="w-full h-full object-cover filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
            </div>

            {/* Accent badge */}
            <div className="absolute -bottom-4 -right-4 bg-[#151515] border border-[#262626] p-4 rounded shadow-2xl">
              <span className="text-[11px] font-mono text-[#FF2027] uppercase tracking-widest block font-bold">
                AVAILABILITY
              </span>
              <span className="text-xs uppercase text-white font-medium">
                Worldwide Freelance
              </span>
            </div>
          </div>

          {/* Bio text */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[2px] bg-[#FF2027]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] font-semibold">
                BIOGRAPHY
              </span>
            </div>

            <h2
              className="font-black text-white leading-none tracking-tighter uppercase"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: `clamp(${theme.typography.h2.fontSizeMobile}, 5vw, ${theme.typography.h2.fontSizeDesktop})`,
              }}
            >
              {content.heading || "HEY, I'M RANJAN."}
            </h2>

            <p className="text-[#FFFFFF] text-lg md:text-xl font-medium leading-relaxed">
              {content.paragraph1 ||
                "I'm a video editor passionate about turning ordinary footage into engaging visual stories."}
            </p>

            <p className="text-[#8A8A8A] text-base leading-relaxed">
              {content.paragraph2 ||
                "My approach combines clean editing, cinematic visuals, strong pacing and thoughtful sound design. Whether it's a 30-second reel or a full wedding film, I believe every frame should have a purpose."}
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs uppercase tracking-widest text-[#8A8A8A] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#FF2027]" />
              <span>{content.location || 'Based in India · Working Worldwide'}</span>
            </div>

            <div className="pt-4">
              <a
                href={content.buttonUrl || '#contact'}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded text-xs font-bold uppercase tracking-wider bg-[#FF2027] text-white hover:bg-[#E0181F] transition-all shadow-lg shadow-[#FF2027]/20"
              >
                <span>{content.buttonText || 'GET IN TOUCH'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
