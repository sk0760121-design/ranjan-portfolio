import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, X, RefreshCw } from 'lucide-react';
import { Hero } from '../../components/Hero';
import { Intro } from '../../components/Intro';
import { SelectedWork } from '../../components/SelectedWork';
import { Results } from '../../components/Results';
import { Services } from '../../components/Services';
import { Skills } from '../../components/Skills';
import { Software } from '../../components/Software';
import { Process } from '../../components/Process';
import { BeforeAfter } from '../../components/BeforeAfter';
import { Testimonials } from '../../components/Testimonials';
import { About } from '../../components/About';
import { Philosophy } from '../../components/Philosophy';
import { CTA } from '../../components/CTA';
import { Contact } from '../../components/Contact';
import { Footer } from '../../components/Footer';
import { Navbar } from '../../components/Navbar';

interface LivePreviewPaneProps {
  onClose?: () => void;
  isSplitView?: boolean;
}

export const LivePreviewPane: React.FC<LivePreviewPaneProps> = ({
  onClose,
  isSplitView = false,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [key, setKey] = useState(0);

  const getWidthClass = () => {
    switch (device) {
      case 'mobile':
        return 'w-[390px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
      default:
        return 'w-full max-w-[1440px]';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] border border-[#262626] rounded-xl overflow-hidden shadow-2xl">
      {/* Top Preview Controls Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#151515] border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-white">
            LIVE PREVIEW (REAL-TIME REACTIVE)
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-[#0A0A0A] border border-[#262626] rounded p-1 gap-1">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded transition-colors ${
              device === 'desktop' ? 'bg-[#FF2027] text-white' : 'text-[#8A8A8A] hover:text-white'
            }`}
            title="Desktop View (1440px)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded transition-colors ${
              device === 'tablet' ? 'bg-[#FF2027] text-white' : 'text-[#8A8A8A] hover:text-white'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded transition-colors ${
              device === 'mobile' ? 'bg-[#FF2027] text-white' : 'text-[#8A8A8A] hover:text-white'
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="p-1.5 rounded text-[#8A8A8A] hover:text-white hover:bg-[#262626] transition-colors cursor-pointer"
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded text-[#8A8A8A] hover:text-white hover:bg-[#262626] transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-grow overflow-y-auto bg-[#050505] p-2 md:p-4 flex justify-center items-start">
        <div
          key={key}
          className={`${getWidthClass()} bg-[#0A0A0A] border border-[#262626] rounded shadow-2xl transition-all duration-300 min-h-full overflow-x-hidden`}
        >
          <Navbar />
          <Hero onOpenShowreel={() => {}} />
          <Intro />
          <SelectedWork onSelectProject={() => {}} />
          <Results />
          <Services />
          <Skills />
          <Software />
          <Process />
          <BeforeAfter />
          <Testimonials />
          <About />
          <Philosophy />
          <CTA onOpenShowreel={() => {}} />
          <Contact />
          <Footer />
        </div>
      </div>
    </div>
  );
};
