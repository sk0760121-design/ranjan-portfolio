import React from 'react';
import { useCMS } from '../context/CMSContext';
import { Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { sections, testimonials, settings } = useCMS();
  const testSection = sections.testimonials;
  const content = testSection?.content || {};
  const theme = settings.theme;

  const publishedTestimonials = testimonials
    .filter((t) => t.published)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (testSection && !testSection.enabled || publishedTestimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
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
                ENDORSEMENTS
              </span>
            </div>
            <h2
              className="font-black text-white leading-none tracking-tighter uppercase"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: `clamp(${theme.typography.h2.fontSizeMobile}, 5vw, ${theme.typography.h2.fontSizeDesktop})`,
              }}
            >
              {content.heading || 'WHAT CREATORS SAY'}
            </h2>
          </div>

          <p className="max-w-md text-[#8A8A8A] text-sm md:text-base leading-relaxed">
            {content.subheading || 'Collaborations with directors, agencies and content creators.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publishedTestimonials.map((item) => (
            <div
              key={item.id}
              className="p-8 bg-[#0A0A0A] border border-[#262626] rounded-md flex flex-col justify-between hover:border-[#FF2027]/50 transition-colors"
            >
              <div>
                <Quote className="w-8 h-8 text-[#FF2027]/40 mb-6" />
                <p className="text-white text-base md:text-lg leading-relaxed font-normal italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#262626] flex items-center gap-4">
                {item.profile_image ? (
                  <img
                    src={item.profile_image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#262626]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#262626] flex items-center justify-center font-bold text-white text-sm">
                    {item.name.substring(0, 2).toUpperCase()}
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#8A8A8A]">
                    {item.role} {item.company ? `· ${item.company}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
