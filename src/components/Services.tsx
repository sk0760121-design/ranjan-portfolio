import React from 'react';
import { useCMS } from '../context/CMSContext';

export const Services: React.FC = () => {
  const { sections, services, settings } = useCMS();
  const servicesSection = sections.services;
  const content = servicesSection?.content || {};
  const theme = settings.theme;

  const enabledServices = services
    .filter((s) => s.enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (servicesSection && !servicesSection.enabled) return null;

  return (
    <section
      id="services"
      className="relative w-full bg-[#0A0A0A] border-t border-[#262626]/40"
      style={{
        paddingTop: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
        paddingBottom: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[2px] bg-[#FF2027]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] font-semibold">
                WHAT I OFFER
              </span>
            </div>
            <h2
              className="font-black text-white leading-none tracking-tighter uppercase"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: `clamp(${theme.typography.h2.fontSizeMobile}, 5vw, ${theme.typography.h2.fontSizeDesktop})`,
              }}
            >
              {content.heading || 'SERVICES'}
            </h2>
          </div>

          <p className="max-w-md text-[#8A8A8A] text-sm md:text-base leading-relaxed">
            {content.subheading ||
              'Every genre requires an individual rhythm and cadence. Here is how I elevate your video projects.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enabledServices.map((service) => (
            <div
              key={service.id}
              className="group relative p-8 bg-[#151515] border border-[#262626] rounded-md flex flex-col justify-between hover:border-[#FF2027]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF2027]/5"
            >
              <div>
                <div className="flex items-baseline justify-between mb-8">
                  <span className="font-mono text-xs text-[#FF2027] tracking-widest font-bold">
                    {service.number}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#262626] group-hover:bg-[#FF2027] transition-colors" />
                </div>

                <h3
                  className="text-xl font-bold uppercase tracking-tight text-white mb-4 group-hover:text-[#FF2027] transition-colors"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {service.title}
                </h3>

                <p className="text-sm text-[#8A8A8A] leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#262626]/40 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] group-hover:text-white transition-colors">
                <span>INQUIRE FOR THIS</span>
                <span className="text-[#FF2027]">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
