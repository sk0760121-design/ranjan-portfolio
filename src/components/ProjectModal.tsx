import React, { useEffect } from 'react';
import { X, Play, ExternalLink, Calendar, User, Tag } from 'lucide-react';
import { Project } from '../types/database';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onPlayVideo: (videoUrl: string, title: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onPlayVideo,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#151515] border border-[#262626] rounded-lg overflow-hidden shadow-2xl z-10 my-8">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF2027]" />
            <span className="text-xs uppercase font-mono tracking-widest text-[#8A8A8A]">
              {project.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#8A8A8A] hover:text-white hover:bg-[#262626] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Banner */}
        <div className="relative aspect-[16/9] w-full bg-black group overflow-hidden">
          <img
            src={project.hero_media || project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-black/30" />

          {/* Play Button Overlay */}
          {project.video && (
            <button
              onClick={() => onPlayVideo(project.video!, project.title)}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#FF2027] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
              aria-label="Play Project Video"
            >
              <Play className="w-6 h-6 fill-white ml-1" />
            </button>
          )}
        </div>

        {/* Details Container */}
        <div className="p-6 md:p-10 space-y-8">
          <div>
            <h2
              className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {project.title}
            </h2>

            <p className="text-white text-base md:text-lg font-medium leading-relaxed mb-6">
              {project.short_description}
            </p>

            {project.long_description && (
              <p className="text-[#8A8A8A] text-sm md:text-base leading-relaxed whitespace-pre-line">
                {project.long_description}
              </p>
            )}
          </div>

          {/* Meta Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-[#262626]">
            {project.client && (
              <div>
                <span className="text-[11px] uppercase font-mono tracking-widest text-[#8A8A8A] block mb-1">
                  CLIENT
                </span>
                <span className="text-sm font-semibold text-white">{project.client}</span>
              </div>
            )}

            {project.year && (
              <div>
                <span className="text-[11px] uppercase font-mono tracking-widest text-[#8A8A8A] block mb-1">
                  YEAR
                </span>
                <span className="text-sm font-semibold text-white">{project.year}</span>
              </div>
            )}

            <div>
              <span className="text-[11px] uppercase font-mono tracking-widest text-[#8A8A8A] block mb-1">
                DISCIPLINE
              </span>
              <span className="text-sm font-semibold text-white">{project.category}</span>
            </div>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="pt-4 flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded bg-[#0A0A0A] border border-[#262626] text-xs font-mono text-[#8A8A8A]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Links */}
          <div className="pt-6 border-t border-[#262626] flex flex-wrap items-center gap-4">
            {project.video && (
              <button
                onClick={() => onPlayVideo(project.video!, project.title)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded text-xs font-bold uppercase tracking-wider bg-[#FF2027] text-white hover:bg-[#E0181F] transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>WATCH MASTER EDIT</span>
              </button>
            )}

            {project.instagram_url && (
              <a
                href={project.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded text-xs font-semibold uppercase tracking-wider text-white border border-[#262626] hover:border-[#FF2027] transition-colors"
              >
                <span>INSTAGRAM REEL</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#8A8A8A]" />
              </a>
            )}

            {project.youtube_url && (
              <a
                href={project.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded text-xs font-semibold uppercase tracking-wider text-white border border-[#262626] hover:border-[#FF2027] transition-colors"
              >
                <span>YOUTUBE</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#8A8A8A]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
