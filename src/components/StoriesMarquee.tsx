import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCMS } from '../context/CMSContext';
import { Volume2, VolumeX, Play, ArrowUpRight, Sparkles } from 'lucide-react';

interface StoryItem {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  posterUrl: string;
  duration?: string;
  views?: string;
  client?: string;
}

interface StoriesMarqueeProps {
  onSelectStory?: (story: StoryItem) => void;
}

export const StoriesMarquee: React.FC<StoriesMarqueeProps> = ({ onSelectStory }) => {
  const { sections, settings } = useCMS();
  const storiesSection = sections.stories;
  const content = storiesSection?.content || {};

  // Unmuted story ID (only one audio source playing at a time)
  const [unmutedId, setUnmutedId] = useState<string | null>(null);

  if (storiesSection && !storiesSection.enabled) return null;

  const rawItems: StoryItem[] = content.items || [];
  if (rawItems.length === 0) return null;

  // Clone items 2x to ensure infinite seamless loop without gaps or jumps
  const loopItems = useMemo(() => {
    return [...rawItems, ...rawItems];
  }, [rawItems]);

  // Compute duration based on speed setting
  const getSpeedSeconds = () => {
    if (content.speed === 'slow') return 52;
    if (content.speed === 'fast') return 20;
    if (content.speed === 'custom' && content.customSpeedSeconds) return content.customSpeedSeconds;
    return 32; // medium default
  };

  const speedDuration = `${getSpeedSeconds()}s`;
  const gapPx = content.gapPx || 24;
  const cardWidth = content.cardWidthPx || 280;
  const cardHeight = content.cardHeightPx || 498;
  const pauseOnHover = content.pauseOnHover !== false;
  const marqueeEnabled = content.marqueeEnabled !== false;

  const toggleSound = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUnmutedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="stories"
      className="relative w-full bg-[#050505] border-t border-[#1C1C1C] py-24 md:py-32 overflow-hidden selection:bg-[#FF2027]"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#FF2027]/[0.025] blur-[150px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-[1.5px] bg-[#FF2027]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#8A8A8A] font-mono font-semibold">
              {content.eyebrow || 'VERTICAL CINEMATIC CUTS'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-section-heading">
            {content.heading || 'FEATURED REELS'}{' '}
            <span className="text-[#FF2027]">{content.headingHighlight || '& STORIES'}</span>
          </h2>
        </div>

        <p className="max-w-md text-xs sm:text-sm text-[#8A8A8A] leading-relaxed font-normal">
          {content.description ||
            'High-retention vertical edits engineered for viral pacing, seamless motion transitions and maximum viewer engagement.'}
        </p>
      </div>

      {/* Marquee Track Container */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Soft edge fade masks for cinema vignette */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

        <div
          className={`marquee-container ${
            marqueeEnabled ? '' : 'overflow-x-auto'
          }`}
        >
          <div
            className={`marquee-track-rtl ${pauseOnHover ? 'pause-hover' : ''}`}
            style={
              {
                '--marquee-duration': speedDuration,
                gap: `${gapPx}px`,
                paddingLeft: `${gapPx}px`,
              } as React.CSSProperties
            }
          >
            {loopItems.map((story, idx) => {
              const uniqueKey = `${story.id}-${idx}`;
              const isUnmuted = unmutedId === uniqueKey;

              return (
                <StoryCard
                  key={uniqueKey}
                  story={story}
                  cardWidth={cardWidth}
                  cardHeight={cardHeight}
                  isUnmuted={isUnmuted}
                  onToggleSound={(e) => toggleSound(uniqueKey, e)}
                  onSelect={() => onSelectStory && onSelectStory(story)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-6 flex items-center justify-between text-[11px] font-mono text-[#555555]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Continuous Right-to-Left 9:16 Flow</span>
        </div>
        <span>Hover to preview / Click audio icon for sound</span>
      </div>
    </section>
  );
};

interface StoryCardProps {
  story: StoryItem;
  cardWidth: number;
  cardHeight: number;
  isUnmuted: boolean;
  onToggleSound: (e: React.MouseEvent) => void;
  onSelect: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({
  story,
  cardWidth,
  cardHeight,
  isUnmuted,
  onToggleSound,
  onSelect,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // IntersectionObserver to auto-play only when near/in viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (videoRef.current && videoRef.current.paused) {
              videoRef.current.play().catch(() => {});
              setIsPlaying(true);
            }
          } else {
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Update muted property on video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isUnmuted;
    }
  }, [isUnmuted]);

  return (
    <div
      ref={containerRef}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
      }}
      className="group relative flex-shrink-0 bg-[#0A0A0A] rounded-2xl overflow-hidden cursor-pointer border border-[#222222] hover:border-[#FF2027]/70 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FF2027]/10"
    >
      {/* 9:16 Video Player */}
      <video
        ref={videoRef}
        src={story.videoUrl}
        poster={story.posterUrl}
        autoPlay
        muted={!isUnmuted}
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover object-center filter brightness-[0.92] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
      />

      {/* Top Overlay Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none opacity-85 group-hover:opacity-75 transition-opacity" />

      {/* Header bar inside card */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase bg-black/70 backdrop-blur px-2 py-0.5 rounded text-white border border-white/10 font-bold">
            {story.views || '9:16 HD'}
          </span>
        </div>

        {/* Audio Mute/Unmute Button */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-full backdrop-blur transition-all cursor-pointer ${
            isUnmuted
              ? 'bg-[#FF2027] text-white shadow-lg shadow-[#FF2027]/40 scale-110'
              : 'bg-black/60 text-[#8A8A8A] hover:text-white hover:bg-black/90'
          }`}
          title={isUnmuted ? 'Mute sound' : 'Enable sound'}
        >
          {isUnmuted ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Center Play Button on hover */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-12 h-12 rounded-full bg-[#FF2027] text-white flex items-center justify-center shadow-xl shadow-[#FF2027]/40 transition-all duration-300 ${
            isHovered ? 'scale-100 opacity-90' : 'scale-75 opacity-0'
          }`}
        >
          <Play className="w-5 h-5 fill-white ml-0.5" />
        </div>
      </div>

      {/* Bottom Content Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF2027] font-semibold block">
          {story.category}
        </span>
        <h3 className="text-sm font-bold text-white uppercase tracking-tight line-clamp-1 group-hover:text-[#FF2027] transition-colors">
          {story.title}
        </h3>
        {story.client && (
          <p className="text-[11px] text-[#8A8A8A] font-mono truncate">
            {story.client}
          </p>
        )}

        <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#666666] border-t border-white/10">
          <span>{story.duration || '0:30'}</span>
          <span className="inline-flex items-center gap-0.5 text-white group-hover:text-[#FF2027] transition-colors">
            <span>Watch</span>
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
