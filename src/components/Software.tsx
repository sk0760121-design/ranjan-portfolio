import React from 'react';
import { useCMS } from '../context/CMSContext';
import { ExternalLink } from 'lucide-react';

export const Software: React.FC = () => {
  const { sections, software, settings } = useCMS();
  const softwareSection = sections.software;
  const content = softwareSection?.content || {};
  const theme = settings.theme;

  const enabledSoftware = software
    .filter((s) => s.enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (softwareSection && !softwareSection.enabled) return null;

  return (
    <section
      id="software"
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
                APPLICATIONS
              </span>
            </div>
            <h2
              className="font-black text-white leading-none tracking-tighter uppercase"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: `clamp(${theme.typography.h2.fontSizeMobile}, 5vw, ${theme.typography.h2.fontSizeDesktop})`,
              }}
            >
              {content.heading || 'TOOLKIT'}
            </h2>
          </div>

          <p className="max-w-md text-[#8A8A8A] text-sm md:text-base leading-relaxed">
            {content.subheading || 'Industry standard tools calibrated for speed and color accuracy.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {enabledSoftware.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-[#151515] border border-[#262626] rounded-md flex flex-col justify-between hover:border-[#FF2027]/70 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt={item.name}
                      className="w-10 h-10 object-contain filter brightness-90 group-hover:brightness-100 transition-all"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-[#262626] flex items-center justify-center font-bold text-white text-sm">
                      {item.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  {item.website_url && (
                    <a
                      href={item.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8A8A8A] hover:text-white transition-colors"
                      aria-label={item.name}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF2027] transition-colors">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-xs text-[#8A8A8A] leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
