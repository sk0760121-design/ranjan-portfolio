import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { ArrowLeft, Play, ExternalLink, Calendar, User, Tag } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { VideoModal } from '../components/VideoModal';

interface ProjectDetailPageProps {
  slug: string;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailPageProps> = ({ slug, onBack }) => {
  const { projects } = useCMS();
  const project = projects.find((p) => p.slug === slug) || projects[0];

  const [videoModalOpen, setVideoModalOpen] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider"
        >
          Return to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
        {/* Back Link */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-[#8A8A8A] hover:text-white transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF2027]" />
          <span>BACK TO ALL PROJECTS</span>
        </button>

        {/* Hero Media Showcase */}
        <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#151515] border border-[#262626] mb-12 group">
          <img
            src={project.hero_media || project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent" />

          {project.video && (
            <button
              onClick={() => setVideoModalOpen(true)}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[#FF2027] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
              aria-label="Play Master Cut"
            >
              <Play className="w-8 h-8 fill-white ml-1" />
            </button>
          )}

          <div className="absolute bottom-8 left-8 right-8">
            <span className="text-xs uppercase font-mono tracking-widest text-[#FF2027] font-bold block mb-2">
              {project.category}
            </span>
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {project.title}
            </h1>
          </div>
        </div>

        {/* Narrative & Specifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main writeup */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold uppercase text-white tracking-wide">
              ABOUT THE PROJECT & EDITORIAL TREATMENT
            </h2>

            <p className="text-lg text-white font-medium leading-relaxed">
              {project.short_description}
            </p>

            {project.long_description && (
              <div className="text-[#8A8A8A] text-base leading-relaxed whitespace-pre-line space-y-4">
                {project.long_description}
              </div>
            )}

            {/* External Links */}
            <div className="pt-6 flex flex-wrap gap-4 border-t border-[#262626]">
              {project.video && (
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>WATCH FULL MASTER CUT</span>
                </button>
              )}

              {project.instagram_url && (
                <a
                  href={project.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded bg-[#151515] border border-[#262626] text-white text-xs font-semibold uppercase tracking-wider hover:border-[#FF2027] transition-colors"
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
                  className="inline-flex items-center gap-2 px-5 py-3 rounded bg-[#151515] border border-[#262626] text-white text-xs font-semibold uppercase tracking-wider hover:border-[#FF2027] transition-colors"
                >
                  <span>YOUTUBE SHOWCASE</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8A8A8A]" />
                </a>
              )}
            </div>
          </div>

          {/* Sidebar Specifications */}
          <div className="lg:col-span-4 space-y-6 bg-[#151515] border border-[#262626] rounded-lg p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#FF2027] font-bold">
              PROJECT SPECIFICATIONS
            </h3>

            <div className="space-y-4 divide-y divide-[#262626]">
              {project.client && (
                <div className="pt-3">
                  <span className="text-[11px] font-mono uppercase text-[#8A8A8A] block mb-0.5">
                    CLIENT / PRODUCTION
                  </span>
                  <span className="text-sm font-bold text-white">{project.client}</span>
                </div>
              )}

              {project.year && (
                <div className="pt-3">
                  <span className="text-[11px] font-mono uppercase text-[#8A8A8A] block mb-0.5">
                    RELEASE YEAR
                  </span>
                  <span className="text-sm font-bold text-white">{project.year}</span>
                </div>
              )}

              <div className="pt-3">
                <span className="text-[11px] font-mono uppercase text-[#8A8A8A] block mb-0.5">
                  CATEGORY
                </span>
                <span className="text-sm font-bold text-white">{project.category}</span>
              </div>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="pt-4 border-t border-[#262626]">
                <span className="text-[11px] font-mono uppercase text-[#8A8A8A] block mb-2">
                  TAGS & STYLES
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-[#0A0A0A] border border-[#262626] text-xs font-mono text-[#8A8A8A]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {project.video && (
        <VideoModal
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          videoUrl={project.video}
          title={project.title}
        />
      )}
    </div>
  );
};
