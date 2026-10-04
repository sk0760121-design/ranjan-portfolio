import React from 'react';
import { useCMS } from '../context/CMSContext';
import { ExternalLink, Wrench } from 'lucide-react';

export const Software: React.FC = () => {
  const { sections, software } = useCMS();
  const softwareSection = sections.software;
  const content = softwareSection?.content || {};

  const enabledSoftware = software
    .filter((s) => s.enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (softwareSection && !softwareSection.enabled) return null;

  return (
    <section
      id="software"
      className="relative w-full bg-[#070707] border-t border-[#1C1C1C] py-28 md:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-12 border-b border-[#222222]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[1.5px] bg-[#FF2027]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8A8A8A] font-mono font-semibold">
                STUDIO PRODUCTION SUITE
              </span>
            </div>
            <h2 className="font-section-heading section-heading-text text-white tracking-tight uppercase">
              {content.heading || 'TOOLKIT & SOFTWARE'}
            </h2>
          </div>

          <p className="max-w-md text-[#8A8A8A] text-sm md:text-base leading-relaxed font-normal">
            {content.subheading ||
              'Calibrated workflow optimized for speed, precision timeline cutting, high-end node color grading and immersive soundscapes.'}
          </p>
        </div>

        {/* 6-Item Toolkit Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enabledSoftware.map((item) => (
            <div
              key={item.id}
              className="p-8 bg-[#0F0F0F] border border-[#222222] rounded-2xl flex flex-col justify-between hover:border-[#FF2027]/60 transition-all duration-300 group hover:shadow-xl hover:shadow-[#FF2027]/5"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt={item.name}
                      className="w-10 h-10 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#1F1F1F] flex items-center justify-center font-bold text-white text-xs font-mono">
                      {item.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  {item.website_url && (
                    <a
                      href={item.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#666666] hover:text-white transition-colors"
                      aria-label={item.name}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2 group-hover:text-[#FF2027] transition-colors">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed font-normal">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] font-mono text-[#666666]">
                <span className="text-emerald-400">● Mastered Tool</span>
                <span>Calibrated 4K</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
