import React, { useState, useRef } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { Project } from '../types/database';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && project.video) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && project.video) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onClick={() => onSelect(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="VIEW"
      className="group relative cursor-pointer flex flex-col bg-[#151515] border border-[#262626] rounded-md overflow-hidden transition-all duration-300 hover:border-[#FF2027]/70 hover:shadow-2xl hover:shadow-[#FF2027]/10"
    >
      {/* Media Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0A0A]">
        {/* Static Thumbnail */}
        <img
          src={project.thumbnail}
          alt={project.title}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
            isHovered && project.video ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />

        {/* Video Preview on Hover */}
        {project.video && (
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            playsInline
            preload="metadata"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Category Pill Tag (Unboxed, sleek) */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#0A0A0A]/80 backdrop-blur-md px-3 py-1 rounded text-[11px] font-mono tracking-wider uppercase text-white/90 border border-[#262626]/80">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2027]" />
          <span>{project.category}</span>
        </div>

        {/* Year tag */}
        {project.year && (
          <div className="absolute top-4 right-4 z-10 text-[11px] font-mono text-[#8A8A8A] bg-[#0A0A0A]/70 px-2 py-0.5 rounded">
            {project.year}
          </div>
        )}

        {/* Hover play icon indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
          <div className="w-12 h-12 rounded-full bg-[#FF2027] text-white flex items-center justify-center shadow-lg shadow-[#FF2027]/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Content info */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3
              className="text-xl font-bold uppercase tracking-tight text-white group-hover:text-[#FF2027] transition-colors leading-tight line-clamp-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {project.title}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-[#8A8A8A] group-hover:text-[#FF2027] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
          </div>

          <p className="mt-2 text-sm text-[#8A8A8A] line-clamp-2 leading-relaxed">
            {project.short_description}
          </p>
        </div>

        {/* Tags footer */}
        {project.tags && project.tags.length > 0 && (
          <div className="mt-5 pt-4 border-t border-[#262626]/60 flex flex-wrap gap-2 text-xs text-[#8A8A8A]/80">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="font-mono text-[11px] text-[#8A8A8A]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Red accent line at bottom */}
      <div className="h-[2px] w-0 bg-[#FF2027] transition-all duration-300 group-hover:w-full" />
    </div>
  );
};
