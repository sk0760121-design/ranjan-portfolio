import React, { useRef } from 'react';
import { ArrowDown, Play, ArrowUpRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface HeroProps {
  onOpenShowreel: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenShowreel }) => {
  const { sections, settings } = useCMS();
  const heroSection = sections.hero;
  const content = heroSection?.content || {};
  const theme = settings.theme;

  const videoRef = useRef<HTMLVideoElement>(null);

  if (heroSection && !heroSection.enabled) return null;

  const backgroundType = content.backgroundType || 'video';
  const videoUrl = content.videoUrl || '';
  const posterUrl = content.posterUrl || '';
  const overlayOpacity = content.overlayOpacity ?? 0.65;

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between pt-28 pb-10 overflow-hidden bg-[#0A0A0A]">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {backgroundType === 'video' && videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            autoPlay={content.autoplay !== false}
            muted={content.muted !== false}
            loop={content.loop !== false}
            playsInline
            preload="metadata"
            className="w-full h-full object-cover object-center filter brightness-90 scale-105 transition-transform duration-1000 ease-out"
          />
        ) : (
          <img
            src={posterUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80'}
            alt="Hero Cinematic Background"
            className="w-full h-full object-cover object-center filter brightness-90"
          />
        )}

        {/* Overlay gradient & tint for contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/40"
          style={{
            backgroundColor: `rgba(10, 10, 10, ${overlayOpacity})`,
          }}
        />

        {/* Film grain layer */}
        <div className="absolute inset-0 film-grain pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full my-auto">
        {/* Top Tagline / Category Label */}
        <div className="mb-6 flex items-center gap-3">
          <span className="w-8 h-[2px] bg-[#FF2027]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#8A8A8A] font-semibold">
            {content.tagline || 'VIDEO EDITOR · FILMMAKER · STORYTELLER'}
          </span>
        </div>

        {/* Hero Title */}
        <h1
          className="font-black text-white leading-[0.98] tracking-tighter uppercase max-w-5xl"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: `clamp(${theme.typography.h1.fontSizeMobile}, 7vw, ${theme.typography.h1.fontSizeDesktop})`,
          }}
        >
          {content.headingLine1 || 'I EDIT'}{' '}
          <span className="block">{content.headingLine2 || 'STORIES THAT'}</span>
          <span className="block">
            {content.headingLine3 || 'MAKE PEOPLE'}{' '}
            <span className="text-[#FF2027]">
              {content.headingHighlight || 'STOP SCROLLING.'}
            </span>
          </span>
        </h1>

        {/* Supporting Copy */}
        <p
          className="mt-8 text-[#8A8A8A] max-w-xl text-base md:text-lg leading-relaxed font-normal"
          style={{
            fontSize: `clamp(${theme.typography.body.fontSizeMobile}, 1.8vw, ${theme.typography.body.fontSizeDesktop})`,
          }}
        >
          {content.supportingCopy ||
            "I'm Ranjan Kumar, a video editor focused on cinematic storytelling, engaging short-form content and polished visual experiences."}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
          <button
            onClick={onOpenShowreel}
            data-cursor="PLAY"
            className="inline-flex items-center gap-3 px-7 py-4 rounded text-xs md:text-sm font-bold uppercase tracking-wider bg-[#FF2027] text-white hover:bg-[#E0181F] transition-all duration-300 shadow-xl shadow-[#FF2027]/25 hover:scale-[1.02] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{content.primaryButtonText || 'WATCH SHOWREEL'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <a
            href={content.secondaryButtonUrl || '#work'}
            className="inline-flex items-center gap-2 px-6 py-4 rounded text-xs md:text-sm font-semibold uppercase tracking-wider text-white border border-[#262626] bg-[#0A0A0A]/40 backdrop-blur hover:border-[#FF2027] hover:bg-[#151515] transition-all duration-300"
          >
            <span>{content.secondaryButtonText || 'VIEW MY WORK'}</span>
            <ArrowDown className="w-4 h-4 text-[#8A8A8A]" />
          </a>
        </div>
      </div>

      {/* Hero Footer Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs uppercase tracking-widest text-[#8A8A8A] border-t border-[#262626]/40 gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{content.locationText || 'Based in India · Available Worldwide'}</span>
        </div>

        <a
          href="#intro"
          className="flex items-center gap-2 text-[#8A8A8A] hover:text-white transition-colors group"
        >
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#FF2027] group-hover:translate-y-1 transition-transform" />
        </a>
      </div>
    </section>
  );
};
