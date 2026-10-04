import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const Navbar: React.FC = () => {
  const { navItems, settings } = useCMS();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const enabledItems = navItems.filter((i) => i.enabled).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#262626]/80 py-4 shadow-xl'
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="text-2xl font-black tracking-tighter text-white hover:text-[#FF2027] transition-colors"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          RANJAN<span className="text-[#FF2027]">.</span>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-9 font-navigation">
          {enabledItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="nav-link-text tracking-widest text-[#8A8A8A] hover:text-white transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#FF2027] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="#contact"
            className="font-button inline-flex items-center gap-2 px-5 py-2.5 rounded btn-text bg-[#FF2027] text-white hover:bg-[#E0181F] transition-all duration-200 shadow-lg shadow-[#FF2027]/20"
          >
            LET'S TALK
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-white px-3 py-2 border border-[#262626] rounded hover:border-[#FF2027] transition-colors"
            aria-label="Toggle Menu"
          >
            <span>{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
            {mobileMenuOpen ? <X className="w-4 h-4 text-[#FF2027]" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#262626] px-6 py-8 animate-fadeIn">
          <div className="flex flex-col space-y-6">
            {enabledItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold uppercase tracking-wider text-white hover:text-[#FF2027] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-[#262626]">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between w-full px-5 py-3.5 rounded text-sm font-bold uppercase tracking-wider bg-[#FF2027] text-white shadow-lg shadow-[#FF2027]/25"
              >
                <span>LET'S TALK</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
