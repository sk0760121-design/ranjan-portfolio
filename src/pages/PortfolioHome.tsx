import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Intro } from '../components/Intro';
import { SelectedWork } from '../components/SelectedWork';
import { StoriesMarquee } from '../components/StoriesMarquee';
import { Services } from '../components/Services';
import { About } from '../components/About';
import { Software } from '../components/Software';
import { Skills } from '../components/Skills';
import { Process } from '../components/Process';
import { BeforeAfter } from '../components/BeforeAfter';
import { Testimonials } from '../components/Testimonials';
import { Results } from '../components/Results';
import { Philosophy } from '../components/Philosophy';
import { CTA } from '../components/CTA';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { CustomCursor } from '../components/CustomCursor';
import { VideoModal } from '../components/VideoModal';
import { ProjectModal } from '../components/ProjectModal';
import { Project } from '../types/database';

export const PortfolioHome: React.FC = () => {
  const { sections } = useCMS();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string }>({
    url: '',
    title: '',
  });

  const handleOpenShowreel = () => {
    const heroContent = sections.hero?.content || {};
    const showreelUrl =
      heroContent.videoUrl ||
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

    setActiveVideo({
      url: showreelUrl,
      title: 'Ranjan Kumar — 2026 Cinematic Showreel',
    });
    setVideoModalOpen(true);
  };

  const handlePlayVideo = (url: string, title: string) => {
    setActiveVideo({ url, title });
    setVideoModalOpen(true);
  };

  const handleSelectStory = (story: { videoUrl: string; title: string }) => {
    setActiveVideo({
      url: story.videoUrl,
      title: story.title,
    });
    setVideoModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#070707] text-white selection:bg-[#FF2027] selection:text-white">
      {/* Custom Mouse Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navbar />

      {/* Main Sections Hierarchy */}
      <main>
        {/* 1. Hero */}
        <Hero onOpenShowreel={handleOpenShowreel} />

        {/* 2. Editorial Statement (Intro) */}
        <Intro />

        {/* 3. Selected Work (Alternating Editorial Layout) */}
        <SelectedWork onSelectProject={(p) => setSelectedProject(p)} />

        {/* 4. Stories & Reels (Continuous Right-to-Left Video Marquee) */}
        <StoriesMarquee onSelectStory={handleSelectStory} />

        {/* 5. Services (High-end Editorial Numbered List) */}
        <Services />

        {/* 6. About / Experience */}
        <About />

        {/* 7. Software / Skills (Clean Studio Toolkit) */}
        <Software />

        {/* 8. Process & Before/After Finishing */}
        <Process />
        <BeforeAfter />

        {/* 9. Metrics */}
        <Results />

        {/* 10. Testimonials (Large Editorial Quotation Layout) */}
        <Testimonials />

        {/* 11. Editing Philosophy Manifesto */}
        <Philosophy />

        {/* 12. Final Cinematic CTA */}
        <CTA onOpenShowreel={handleOpenShowreel} />

        {/* 13. Contact Inquiries */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={activeVideo.url}
        title={activeVideo.title}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onPlayVideo={handlePlayVideo}
      />
    </div>
  );
};
