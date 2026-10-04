import React, { useState, useMemo } from 'react';
import { useCMS } from '../context/CMSContext';
import { Project } from '../types/database';
import { Play, ArrowUpRight, Film } from 'lucide-react';

interface SelectedWorkProps {
  onSelectProject: (project: Project) => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({ onSelectProject }) => {
  const { sections, projects, settings } = useCMS();
  const workSection = sections.work;
  const content = workSection?.content || {};
  const theme = settings.theme;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const publishedProjects = useMemo(() => {
    return projects
      .filter((p) => p.published)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [projects]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    publishedProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [publishedProjects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return publishedProjects;
    return publishedProjects.filter((p) => p.category === activeCategory);
  }, [publishedProjects, activeCategory]);

  if (workSection && !workSection.enabled) return null;

  return (
    <section
      id="work"
      className="relative w-full bg-[#0A0A0A] border-t border-[#1C1C1C] py-28 md:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#222222]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[1.5px] bg-[#FF2027]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8A8A8A] font-mono font-semibold">
                CURATED PORTFOLIO
              </span>
            </div>
            <h2 className="font-section-heading section-heading-text text-white tracking-tight uppercase whitespace-pre-line">
              {content.heading || 'SELECTED\nWORK'}
            </h2>
          </div>

          <p className="max-w-md text-[#8A8A8A] text-sm md:text-base leading-relaxed font-normal">
            {content.description ||
              "A collection of projects I've edited across cinematic films, short-form content, weddings and branded videos."}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto py-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#FF2027] text-white font-bold shadow-lg shadow-[#FF2027]/20'
                  : 'bg-[#141414] text-[#8A8A8A] border border-[#242424] hover:text-white hover:border-[#383838]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Editorial Alternating Layout */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#262626] rounded-xl">
            <p className="text-sm font-mono text-[#8A8A8A]">No projects available in this category.</p>
          </div>
        ) : (
          <div className="space-y-24 md:space-y-36 pt-8">
            {filteredProjects.map((project, index) => {
              const isEven = index % 2 === 0;
              const formattedIndex = String(index + 1).padStart(2, '0');
              const isHovered = hoveredProjectId === project.id;

              return (
                <article
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                  className="group relative cursor-pointer"
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center ${
                      isEven ? '' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Media Column (7 Cols) */}
                    <div
                      className={`lg:col-span-7 relative ${
                        isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <div className="relative aspect-[16/10] bg-[#111111] rounded-2xl overflow-hidden border border-[#222222] group-hover:border-[#FF2027]/50 transition-all duration-500 shadow-2xl">
                        {/* Video / Poster preview */}
                        {project.video ? (
                          <video
                            src={project.video}
                            poster={project.thumbnail || project.hero_media}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            autoPlay={isHovered}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <img
                            src={project.thumbnail || project.hero_media}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        )}

                        {/* Subtle gradient vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                        {/* Centered Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 rounded-full bg-[#FF2027] text-white flex items-center justify-center shadow-2xl shadow-[#FF2027]/40 transform scale-90 group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                        </div>

                        {/* Year overlay */}
                        {project.year && (
                          <div className="absolute top-4 right-4 z-10 text-[11px] font-mono text-[#CCCCCC] bg-black/60 backdrop-blur px-2.5 py-1 rounded border border-white/10 font-bold">
                            {project.year}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Narrative & Details Column (5 Cols) */}
                    <div
                      className={`lg:col-span-5 space-y-4 ${
                        isEven ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      {/* Quiet project counter & category separator */}
                      <div className="flex items-center gap-3 text-xs font-mono text-[#8A8A8A]">
                        <span className="text-[#FF2027] font-bold text-sm">
                          PROJ {formattedIndex}
                        </span>
                        <span>/</span>
                        <span className="uppercase tracking-widest text-[#A0A0A0]">
                          {project.category}
                        </span>
                      </div>

                      {/* Project Title */}
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight group-hover:text-[#FF2027] transition-colors leading-[1.08] font-project-title">
                        {project.title}
                      </h3>

                      {/* Client if specified */}
                      {project.client && (
                        <p className="text-xs uppercase font-mono text-[#666666]">
                          Client: <span className="text-[#999999]">{project.client}</span>
                        </p>
                      )}

                      {/* Short editorial description */}
                      <p className="text-sm md:text-base text-[#8A8A8A] leading-relaxed font-normal pt-1 font-project-desc">
                        {project.short_description}
                      </p>

                      {/* Tags without candy pill boxes (anti-slop clean text rule) */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[#666666]">
                          {project.tags.map((tag, i) => (
                            <span key={i} className="hover:text-white transition-colors">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* View Project Action */}
                      <div className="pt-4">
                        <span className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#FF2027] transition-colors font-button">
                          <span>VIEW PROJECT REEL</span>
                          <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
