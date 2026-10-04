import React, { useState, useRef } from 'react';
import { useCMS } from '../context/CMSContext';

export const BeforeAfter: React.FC = () => {
  const { sections, beforeAfter, settings } = useCMS();
  const baSection = sections.before_after;
  const content = baSection?.content || {};
  const theme = settings.theme;

  const enabledItems = beforeAfter.filter((i) => i.enabled);
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({});

  const handleSliderChange = (id: string, val: number) => {
    setSliderPositions((prev) => ({ ...prev, [id]: val }));
  };

  if (baSection && !baSection.enabled || enabledItems.length === 0) return null;

  return (
    <section
      id="grading"
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
                FINISHING & COLOR
              </span>
            </div>
            <h2
              className="font-black text-white leading-none tracking-tighter uppercase"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: `clamp(${theme.typography.h2.fontSizeMobile}, 5vw, ${theme.typography.h2.fontSizeDesktop})`,
              }}
            >
              {content.heading || 'COLOR & POLISH'}
            </h2>
          </div>

          <p className="max-w-md text-[#8A8A8A] text-sm md:text-base leading-relaxed">
            {content.subheading ||
              'Slide across to inspect the transformation from raw camera log into final cinematic grade.'}
          </p>
        </div>

        <div className="space-y-12">
          {enabledItems.map((item) => {
            const position = sliderPositions[item.id] ?? item.initial_slider_position ?? 50;

            return (
              <div
                key={item.id}
                className="bg-[#151515] border border-[#262626] rounded-md overflow-hidden p-4 md:p-8"
              >
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-[#8A8A8A] mt-1">{item.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-xs uppercase font-mono tracking-wider">
                    <span className="text-[#8A8A8A]">LEFT: LOG CAMERA</span>
                    <span className="text-[#FF2027] font-bold">RIGHT: GRADED MASTER</span>
                  </div>
                </div>

                {/* Interactive Split View */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded bg-black select-none">
                  {/* Before Media (Background) */}
                  <img
                    src={item.before_media}
                    alt="Before Color Grading"
                    className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-75 brightness-110"
                    draggable={false}
                  />

                  {/* After Media (Clipped via position %) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 0 0 ${position}%)` }}
                  >
                    <img
                      src={item.after_media}
                      alt="After Color Grading"
                      className="absolute inset-0 w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>

                  {/* Divider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-[2px] bg-[#FF2027] z-20 pointer-events-none"
                    style={{ left: `${position}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FF2027] text-white flex items-center justify-center shadow-lg font-mono text-[10px] font-bold cursor-ew-resize">
                      ↔
                    </div>
                  </div>

                  {/* Range Slider Overlay */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={position}
                    onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                    aria-label="Before and after comparison slider"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
