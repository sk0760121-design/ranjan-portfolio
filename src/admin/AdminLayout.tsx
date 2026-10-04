import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCMS } from '../context/CMSContext';
import {
  LayoutDashboard,
  Film,
  Sparkles,
  User,
  Briefcase,
  Wrench,
  GitCommit,
  SlidersHorizontal,
  Quote,
  MessageSquare,
  Image,
  Navigation,
  Palette,
  Type,
  Zap,
  Globe,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  CheckCircle2,
  Columns,
  Eye,
} from 'lucide-react';
import { AdminDashboard } from './pages/AdminDashboard';
import { HeroEditor } from './pages/HeroEditor';
import { WorkEditor } from './pages/WorkEditor';
import { AboutEditor } from './pages/AboutEditor';
import { ServicesEditor } from './pages/ServicesEditor';
import { SkillsSoftwareEditor } from './pages/SkillsSoftwareEditor';
import { ProcessEditor } from './pages/ProcessEditor';
import { BeforeAfterEditor } from './pages/BeforeAfterEditor';
import { TestimonialsEditor } from './pages/TestimonialsEditor';
import { ContactMessages } from './pages/ContactMessages';
import { MediaLibrary } from './pages/MediaLibrary';
import { NavigationEditor } from './pages/NavigationEditor';
import { DesignEditor } from './pages/DesignEditor';
import { TypographyEditor } from './pages/TypographyEditor';
import { StoriesEditor } from './pages/StoriesEditor';
import { AnimationEditor } from './pages/AnimationEditor';
import { SEOEditor } from './pages/SEOEditor';
import { RevisionsEditor } from './pages/RevisionsEditor';
import { SettingsEditor } from './pages/SettingsEditor';
import { LivePreviewPane } from './components/LivePreviewPane';
import { ConfirmModal } from './components/ConfirmModal';

export const AdminLayout: React.FC = () => {
  const { user, signOut, signOutAllSessions } = useAuth();
  const {
    hasUnpublishedChanges,
    publishChanges,
    saveDraft,
    lastPublished,
  } = useCMS();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isSplitView, setIsSplitView] = useState<boolean>(false);
  const [fullPreviewOpen, setFullPreviewOpen] = useState<boolean>(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState<boolean>(false);
  const [logoutScope, setLogoutScope] = useState<'current' | 'all'>('current');
  const [publishToast, setPublishToast] = useState<string | null>(null);

  const navMenuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'hero', label: 'HERO & SHOWREEL', icon: Sparkles },
    { id: 'work', label: 'SELECTED WORK', icon: Film },
    { id: 'stories', label: 'STORIES / REELS MARQUEE', icon: Sparkles },
    { id: 'about', label: 'ABOUT RANJAN', icon: User },
    { id: 'services', label: 'SERVICES', icon: Briefcase },
    { id: 'skills', label: 'SKILLS & SOFTWARE', icon: Wrench },
    { id: 'process', label: 'CREATIVE PROCESS', icon: GitCommit },
    { id: 'before_after', label: 'BEFORE / AFTER', icon: SlidersHorizontal },
    { id: 'testimonials', label: 'TESTIMONIALS', icon: Quote },
    { id: 'contact', label: 'INQUIRIES / CONTACT', icon: MessageSquare },
    { id: 'media', label: 'MEDIA LIBRARY', icon: Image },
    { id: 'navigation', label: 'NAVIGATION & LINKS', icon: Navigation },
    { id: 'design', label: 'DESIGN & COLORS', icon: Palette },
    { id: 'typography', label: 'TYPOGRAPHY & FONTS', icon: Type },
    { id: 'animations', label: 'ANIMATIONS', icon: Zap },
    { id: 'seo', label: 'SEO & METADATA', icon: Globe },
    { id: 'revisions', label: 'REVISIONS / BACKUPS', icon: History },
    { id: 'settings', label: 'SECTION TOGGLES', icon: Settings },
  ];

  const handlePublish = () => {
    publishChanges();
    setPublishToast('Live website successfully updated and published!');
    setTimeout(() => setPublishToast(null), 3500);
  };

  const handleSaveDraft = () => {
    saveDraft();
    setPublishToast('Draft state saved locally.');
    setTimeout(() => setPublishToast(null), 2500);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminDashboard
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenPreview={() => setFullPreviewOpen(true)}
          />
        );
      case 'hero':
        return <HeroEditor />;
      case 'work':
        return <WorkEditor />;
      case 'stories':
        return <StoriesEditor />;
      case 'about':
        return <AboutEditor />;
      case 'services':
        return <ServicesEditor />;
      case 'skills':
        return <SkillsSoftwareEditor />;
      case 'process':
        return <ProcessEditor />;
      case 'before_after':
        return <BeforeAfterEditor />;
      case 'testimonials':
        return <TestimonialsEditor />;
      case 'contact':
        return <ContactMessages />;
      case 'media':
        return <MediaLibrary />;
      case 'navigation':
        return <NavigationEditor />;
      case 'design':
        return <DesignEditor />;
      case 'typography':
        return <TypographyEditor />;
      case 'animations':
        return <AnimationEditor />;
      case 'seo':
        return <SEOEditor />;
      case 'revisions':
        return <RevisionsEditor />;
      case 'settings':
        return <SettingsEditor />;
      default:
        return (
          <AdminDashboard
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenPreview={() => setFullPreviewOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-[#151515] border-b border-[#262626] px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded text-[#8A8A8A] hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a
            href="#"
            className="text-lg font-black tracking-tighter text-white flex items-center gap-1.5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span>RANJAN</span>
            <span className="text-[#FF2027]">.</span>
            <span className="text-xs font-mono font-normal tracking-widest text-[#8A8A8A] ml-2">
              ADMIN CMS
            </span>
          </a>
        </div>

        {/* Action Controls & Draft / Publish Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsSplitView(!isSplitView)}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
              isSplitView
                ? 'bg-[#FF2027] text-white border-[#FF2027]'
                : 'bg-[#0A0A0A] text-[#8A8A8A] border-[#262626] hover:text-white'
            }`}
            title="Toggle Side-by-Side Editor & Live Preview"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>

          <button
            onClick={() => setFullPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0A0A0A] border border-[#262626] text-xs font-mono uppercase tracking-wider text-[#8A8A8A] hover:text-white hover:border-[#FF2027] transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#FF2027]" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-1.5 rounded bg-[#202020] border border-[#333] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#282828] transition-colors cursor-pointer"
          >
            Save Draft
          </button>

          <button
            onClick={handlePublish}
            disabled={!hasUnpublishedChanges}
            className="px-4 py-1.5 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-[#FF2027]/25 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>

          <div className="h-6 w-[1px] bg-[#262626] mx-1 hidden sm:block" />

          <button
            onClick={() => {
              setLogoutScope('current');
              setLogoutConfirmOpen(true);
            }}
            className="p-2 rounded text-[#8A8A8A] hover:text-red-400 hover:bg-[#202020] transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-[#151515] border-r border-[#262626] flex-shrink-0 flex flex-col justify-between transition-all duration-300 z-30 ${
            mobileSidebarOpen
              ? 'fixed inset-y-16 left-0 w-64 shadow-2xl'
              : 'hidden md:flex'
          }`}
        >
          <div className="p-4 space-y-1 overflow-y-auto flex-grow">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#555] px-3 pb-2 block">
              MANAGEMENT
            </span>
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#FF2027] text-white shadow-md shadow-[#FF2027]/20'
                      : 'text-[#8A8A8A] hover:text-white hover:bg-[#202020]'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#262626] space-y-3 bg-[#0E0E0E]">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#8A8A8A]">
              <span className="truncate">{user?.email || 'admin@ranjankumar.com'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setLogoutScope('current');
                  setLogoutConfirmOpen(true);
                }}
                className="w-full text-center py-1.5 rounded text-[11px] font-mono uppercase text-[#8A8A8A] hover:text-white hover:bg-[#202020] border border-[#262626]"
              >
                Log Out
              </button>

              <button
                onClick={() => {
                  setLogoutScope('all');
                  setLogoutConfirmOpen(true);
                }}
                className="w-full text-center py-1.5 rounded text-[11px] font-mono uppercase text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/40"
                title="Revoke all authenticated devices"
              >
                All Devices
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area (Split View or Full Page) */}
        <main className="flex-grow flex overflow-hidden">
          {/* Editor Workspace */}
          <div
            className={`flex-grow overflow-y-auto p-4 sm:p-8 ${
              isSplitView ? 'w-1/2 border-r border-[#262626]' : 'w-full'
            }`}
          >
            {renderActivePage()}
          </div>

          {/* Live Preview Side Pane (When Split View is Active) */}
          {isSplitView && (
            <div className="hidden lg:block w-1/2 p-4 h-full">
              <LivePreviewPane isSplitView onClose={() => setIsSplitView(false)} />
            </div>
          )}
        </main>
      </div>

      {/* Full Preview Modal */}
      {fullPreviewOpen && (
        <div className="fixed inset-0 z-50 p-4 md:p-8 bg-black/90 backdrop-blur-md flex flex-col">
          <div className="h-full w-full">
            <LivePreviewPane onClose={() => setFullPreviewOpen(false)} />
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {publishToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-[#151515] border border-emerald-600 text-emerald-200 text-xs flex items-center gap-3 shadow-2xl animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{publishToast}</span>
        </div>
      )}

      {/* Logout Confirmation */}
      <ConfirmModal
        isOpen={logoutConfirmOpen}
        title={logoutScope === 'all' ? 'Log Out All Devices?' : 'Log Out Admin Session?'}
        message={
          logoutScope === 'all'
            ? 'This will terminate your session across all browsers and devices. You will need to enter your admin password again.'
            : 'Are you sure you want to log out of your admin dashboard?'
        }
        confirmLabel="Log Out"
        onConfirm={() => {
          if (logoutScope === 'all') {
            signOutAllSessions();
          } else {
            signOut();
          }
          setLogoutConfirmOpen(false);
        }}
        onCancel={() => setLogoutConfirmOpen(false)}
      />
    </div>
  );
};
