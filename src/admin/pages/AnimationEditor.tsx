import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { Zap } from 'lucide-react';

export const AnimationEditor: React.FC = () => {
  const { settings, updateSettings } = useCMS();
  const anim = settings.theme.animations;

  const handleUpdate = (field: string, val: any) => {
    updateSettings({
      ...settings,
      theme: {
        ...settings.theme,
        animations: {
          ...anim,
          [field]: val,
        },
      },
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            MOTION & ANIMATION CONTROLS
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Control entrance transitions, duration timings, hover effects, and accessibility compliance.
          </p>
        </div>
      </div>

      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-6">
        <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded border border-[#262626]">
          <div>
            <span className="text-xs font-bold uppercase text-white block">
              GLOBAL MOTION ENGINE
            </span>
            <span className="text-[11px] text-[#8A8A8A]">
              Respects user's system "prefers-reduced-motion" settings automatically
            </span>
          </div>
          <input
            type="checkbox"
            checked={anim.enabled}
            onChange={(e) => handleUpdate('enabled', e.target.checked)}
            className="w-5 h-5 accent-[#FF2027] cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
            TRANSITION STYLE
          </label>
          <select
            value={anim.type}
            onChange={(e) => handleUpdate('type', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF2027] cursor-pointer"
          >
            <option value="fade">Subtle Cinematic Fade</option>
            <option value="slide">Vertical Slide & Reveal</option>
            <option value="scale">Gentle Scale & Focus</option>
            <option value="blur">Dreamy Blur Dissolve</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
            <span>TRANSITION DURATION</span>
            <span className="text-white">{anim.duration} seconds</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.5"
            step="0.1"
            value={anim.duration}
            onChange={(e) => handleUpdate('duration', parseFloat(e.target.value))}
            className="w-full accent-[#FF2027]"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded border border-[#262626]">
          <div>
            <span className="text-xs font-bold uppercase text-white block">
              PROJECT CARD HOVER EXPANSIONS
            </span>
            <span className="text-[11px] text-[#8A8A8A]">
              Plays video teaser and zooms thumbnail gently on mouse enter
            </span>
          </div>
          <input
            type="checkbox"
            checked={anim.hoverEffects !== false}
            onChange={(e) => handleUpdate('hoverEffects', e.target.checked)}
            className="w-5 h-5 accent-[#FF2027] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
