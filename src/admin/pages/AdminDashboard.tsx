import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { useAuth } from '../../context/AuthContext';
import {
  Film,
  Image,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Database,
  Upload,
  PlusCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenPreview: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenPreview,
}) => {
  const {
    projects,
    mediaAssets,
    testimonials,
    contactMessages,
    lastPublished,
    hasUnpublishedChanges,
    publishChanges,
    sections,
  } = useCMS();
  const { isConfigured, user } = useAuth();

  const unreadMessagesCount = contactMessages.filter((m) => m.status === 'unread').length;
  const activeSectionsCount = Object.values(sections).filter((s) => s.enabled).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-8 bg-[#151515] border border-[#262626] rounded-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                hasUnpublishedChanges ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            <span className="text-xs font-mono uppercase tracking-widest text-[#8A8A8A]">
              SITE STATUS:{' '}
              <strong className={hasUnpublishedChanges ? 'text-amber-400' : 'text-emerald-400'}>
                {hasUnpublishedChanges ? 'DRAFT CHANGES PENDING' : 'PUBLISHED & SYNCED'}
              </strong>
            </span>
          </div>

          <h2
            className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            WELCOME BACK, {user?.email?.split('@')[0].toUpperCase() || 'RANJAN'}
          </h2>

          <p className="mt-1 text-sm text-[#8A8A8A]">
            Control your cinematic portfolio, update projects, modify visual styling, and publish live updates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenPreview}
            className="px-5 py-2.5 rounded bg-[#0A0A0A] border border-[#262626] text-xs font-semibold uppercase tracking-wider text-white hover:border-[#FF2027] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>LIVE PREVIEW</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={publishChanges}
            disabled={!hasUnpublishedChanges}
            className="px-6 py-2.5 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-all disabled:opacity-40 disabled:hover:bg-[#FF2027] shadow-lg shadow-[#FF2027]/20 flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>PUBLISH ALL CHANGES</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('work')}
          className="p-6 bg-[#151515] border border-[#262626] rounded-lg hover:border-[#FF2027]/60 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#8A8A8A] mb-4">
            <span className="text-xs font-mono uppercase tracking-wider">PROJECTS</span>
            <Film className="w-4 h-4 group-hover:text-[#FF2027] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{projects.length}</span>
            <span className="text-xs text-[#8A8A8A]">
              {projects.filter((p) => p.published).length} Published
            </span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('media')}
          className="p-6 bg-[#151515] border border-[#262626] rounded-lg hover:border-[#FF2027]/60 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#8A8A8A] mb-4">
            <span className="text-xs font-mono uppercase tracking-wider">MEDIA ASSETS</span>
            <Image className="w-4 h-4 group-hover:text-[#FF2027] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{mediaAssets.length}</span>
            <span className="text-xs text-[#8A8A8A]">Videos & Photos</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('contact')}
          className="p-6 bg-[#151515] border border-[#262626] rounded-lg hover:border-[#FF2027]/60 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#8A8A8A] mb-4">
            <span className="text-xs font-mono uppercase tracking-wider">INQUIRIES</span>
            <MessageSquare className="w-4 h-4 group-hover:text-[#FF2027] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{contactMessages.length}</span>
            {unreadMessagesCount > 0 ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF2027] text-white">
                {unreadMessagesCount} NEW
              </span>
            ) : (
              <span className="text-xs text-[#8A8A8A]">All read</span>
            )}
          </div>
        </div>

        <div
          onClick={() => onNavigate('settings')}
          className="p-6 bg-[#151515] border border-[#262626] rounded-lg hover:border-[#FF2027]/60 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[#8A8A8A] mb-4">
            <span className="text-xs font-mono uppercase tracking-wider">SECTIONS</span>
            <Layers className="w-4 h-4 group-hover:text-[#FF2027] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{activeSectionsCount} / 15</span>
            <span className="text-xs text-emerald-400">Active</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#8A8A8A] mb-4">
          QUICK ACTIONS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('work')}
            className="p-4 bg-[#151515] border border-[#262626] rounded flex items-center gap-3 text-left hover:border-[#FF2027] hover:bg-[#1a1a1a] transition-all cursor-pointer group"
          >
            <PlusCircle className="w-5 h-5 text-[#FF2027] flex-shrink-0" />
            <div>
              <span className="text-sm font-bold text-white block group-hover:text-[#FF2027] transition-colors">
                Add New Project
              </span>
              <span className="text-xs text-[#8A8A8A]">Upload film or reel</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('media')}
            className="p-4 bg-[#151515] border border-[#262626] rounded flex items-center gap-3 text-left hover:border-[#FF2027] hover:bg-[#1a1a1a] transition-all cursor-pointer group"
          >
            <Upload className="w-5 h-5 text-[#FF2027] flex-shrink-0" />
            <div>
              <span className="text-sm font-bold text-white block group-hover:text-[#FF2027] transition-colors">
                Upload Media
              </span>
              <span className="text-xs text-[#8A8A8A]">To Supabase Storage</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('hero')}
            className="p-4 bg-[#151515] border border-[#262626] rounded flex items-center gap-3 text-left hover:border-[#FF2027] hover:bg-[#1a1a1a] transition-all cursor-pointer group"
          >
            <Sparkles className="w-5 h-5 text-[#FF2027] flex-shrink-0" />
            <div>
              <span className="text-sm font-bold text-white block group-hover:text-[#FF2027] transition-colors">
                Edit Hero & Showreel
              </span>
              <span className="text-xs text-[#8A8A8A]">Headline & background</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('design')}
            className="p-4 bg-[#151515] border border-[#262626] rounded flex items-center gap-3 text-left hover:border-[#FF2027] hover:bg-[#1a1a1a] transition-all cursor-pointer group"
          >
            <Database className="w-5 h-5 text-[#FF2027] flex-shrink-0" />
            <div>
              <span className="text-sm font-bold text-white block group-hover:text-[#FF2027] transition-colors">
                Visual Styling
              </span>
              <span className="text-xs text-[#8A8A8A]">Colors & typography</span>
            </div>
          </button>
        </div>
      </div>

      {/* Backend & Deployment Status */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#FF2027]" />
            <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              BACKEND ENGINE: SUPABASE POSTGRESQL & STORAGE
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded text-[11px] font-mono uppercase tracking-wider ${
              isConfigured
                ? 'bg-emerald-950/60 border border-emerald-700 text-emerald-300'
                : 'bg-amber-950/60 border border-amber-700 text-amber-300'
            }`}
          >
            {isConfigured ? 'CONNECTED TO SUPABASE CLOUD' : 'STANDALONE / LOCAL PREVIEW MODE'}
          </span>
        </div>

        <p className="text-xs text-[#8A8A8A] leading-relaxed">
          {isConfigured
            ? 'Your application is connected to live Supabase backend. Tables and storage operations persist directly to your cloud PostgreSQL database.'
            : 'The CMS is currently executing in resilient local persistent mode. All changes, draft saves, uploads, projects, messages, and publishing operate smoothly with local browser cache. To connect your remote Supabase cloud project, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'}
        </p>

        {lastPublished && (
          <div className="flex items-center gap-2 text-xs text-[#8A8A8A] pt-2 border-t border-[#262626]">
            <Clock className="w-3.5 h-3.5 text-[#8A8A8A]" />
            <span>Last published to live site: {new Date(lastPublished).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};
