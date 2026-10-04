import React from 'react';
import { useCMS } from '../context/CMSContext';
import { ArrowUpRight } from 'lucide-react';

export const Services: React.FC = () => {
  const { sections, services, settings } = useCMS();
  const servicesSection = sections.services;
  const content = servicesSection?.content || {};

  const enabledServices = services
    .filter((s) => s.enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (servicesSection && !servicesSection.enabled) return null;

  return (
    <section
      id="services"
      className="relative w-full bg-[#0A0A0A] border-t border-[#1C1C1C] py-28 md:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 pb-12 border-b border-[#222222]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[1.5px] bg-[#FF2027]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8A8A8A] font-mono font-semibold">
                EXPERTISE & CRAFT
              </span>
            </div>
            <h2 className="font-section-heading section-heading-text text-white tracking-tight uppercase">
              {content.heading || 'SERVICES'}
            </h2>
          </div>

          <p className="max-w-md text-[#8A8A8A] text-sm md:text-base leading-relaxed font-normal">
            {content.subheading ||
              'Every genre requires an individual rhythm and cadence. Here is how I elevate your video productions.'}
          </p>
        </div>

        {/* Editorial Services List */}
        <div className="divide-y divide-[#222222] border-y border-[#222222]">
          {enabledServices.map((service) => (
            <div
              key={service.id}
              className="group py-10 md:py-14 transition-all duration-300 hover:bg-white/[0.015] px-2 sm:px-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
                {/* Number */}
                <div className="md:col-span-2">
                  <span className="font-mono text-sm sm:text-base text-[#666666] group-hover:text-[#FF2027] transition-colors font-bold">
                    {service.number}
                  </span>
                </div>

                {/* Title */}
                <div className="md:col-span-5">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight group-hover:text-[#FF2027] group-hover:translate-x-1 transition-all duration-300">
                    {service.title}
                  </h3>
                </div>

                {/* Description & Action */}
                <div className="md:col-span-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed max-w-sm">
                    {service.description}
                  </p>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#666666] group-hover:text-white transition-colors shrink-0 font-button"
                  >
                    <span>INQUIRE</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#FF2027] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
