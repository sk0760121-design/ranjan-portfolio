import React, { useState, useMemo } from 'react';
import { useCMS } from '../context/CMSContext';
import { ProjectCard } from './ProjectCard';
import { Project } from '../types/database';

interface SelectedWorkProps {
  onSelectProject: (project: Project) => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({ onSelectProject }) => {
  const { sections, projects, settings } = useCMS();
  const workSection = sections.work;
  const content = workSection?.content || {};
  const theme = settings.theme;

  const [activeCategory, setActiveCategory] = useState<string>('All');

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
      className="relative w-full bg-[#0A0A0A] border-t border-[#262626]/40"
      style={{
        paddingTop: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
        paddingBottom: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#262626]/60">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[2px] bg-[#FF2027]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] font-semibold">
                PORTFOLIO
              </span>
            </div>
            <h2
              className="font-black text-white leading-[0.98] tracking-tighter uppercase whitespace-pre-line"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: `clamp(${theme.typography.h2.fontSizeMobile}, 5vw, ${theme.typography.h2.fontSizeDesktop})`,
              }}
            >
              {content.heading || 'SELECTED\nWORK'}
            </h2>
          </div>

          <p className="max-w-md text-[#8A8A8A] text-sm md:text-base leading-relaxed">
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
              className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#FF2027] text-white shadow-md shadow-[#FF2027]/25'
                  : 'bg-[#151515] text-[#8A8A8A] border border-[#262626] hover:text-white hover:border-[#383838]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#262626] rounded-md">
            <p className="text-[#8A8A8A]">No projects available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={onSelectProject}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
