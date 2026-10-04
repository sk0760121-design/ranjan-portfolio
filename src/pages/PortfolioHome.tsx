import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Intro } from '../components/Intro';
import { SelectedWork } from '../components/SelectedWork';
import { Results } from '../components/Results';
import { Services } from '../components/Services';
import { Skills } from '../components/Skills';
import { Software } from '../components/Software';
import { Process } from '../components/Process';
import { BeforeAfter } from '../components/BeforeAfter';
import { Testimonials } from '../components/Testimonials';
import { About } from '../components/About';
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

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF2027] selection:text-white">
      {/* Custom Mouse Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main>
        <Hero onOpenShowreel={handleOpenShowreel} />
        <Intro />
        <SelectedWork onSelectProject={(p) => setSelectedProject(p)} />
        <Results />
        <Services />
        <Skills />
        <Software />
        <Process />
        <BeforeAfter />
        <Testimonials />
        <About />
        <Philosophy />
        <CTA onOpenShowreel={handleOpenShowreel} />
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
