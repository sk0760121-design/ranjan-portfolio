import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useAuth } from '../../context/AuthContext';
import { Layers, RotateCcw, AlertTriangle, Database, Check, ShieldAlert } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const SettingsEditor: React.FC = () => {
  const { sections, toggleSection, resetEntireSite } = useCMS();
  const { isConfigured } = useAuth();
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const sectionKeys = [
    { id: 'hero', name: '01. Hero & Video Background' },
    { id: 'intro', name: '02. Intro Editorial Statement' },
    { id: 'work', name: '03. Selected Work & Projects' },
    { id: 'results', name: '04. Impact & Results Metrics' },
    { id: 'services', name: '05. Services & Editing Offerings' },
    { id: 'skills', name: '06. Core Capabilities / Skills' },
    { id: 'software', name: '07. Software Toolkit' },
    { id: 'process', name: '08. Creative 5-Phase Process' },
    { id: 'before_after', name: '09. Before / After Color Grade' },
    { id: 'testimonials', name: '10. Client Testimonials' },
    { id: 'about', name: '11. About Ranjan & Biography' },
    { id: 'philosophy', name: '12. Creative Manifesto' },
    { id: 'cta', name: '13. Final Call to Action' },
    { id: 'contact', name: '14. Proposal Contact Form' },
    { id: 'footer', name: '15. Footer & Copyright' },
  ];

  const handleResetSite = () => {
    resetEntireSite();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            SECTION VISIBILITY & SITE SETTINGS
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Toggle public website sections ON or OFF without deleting content, and configure master safety resets.
          </p>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>All website content has been reset to default cinematic baseline!</span>
        </div>
      )}

      {/* Sections On / Off Toggle List */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-[#FF2027]" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
            SECTION VISIBILITY CONTROLS (15 SECTIONS)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {sectionKeys.map((item) => {
            const isEnabled = sections[item.id]?.enabled !== false;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-[#0A0A0A] border border-[#262626] rounded hover:border-[#383838] transition-colors"
              >
                <span className="text-xs font-medium text-white">{item.name}</span>
                <button
                  type="button"
                  onClick={() => toggleSection(item.id, !isEnabled)}
                  className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                    isEnabled
                      ? 'bg-emerald-950/70 border border-emerald-700 text-emerald-300'
                      : 'bg-[#202020] text-[#8A8A8A] border border-[#333]'
                  }`}
                >
                  {isEnabled ? 'VISIBLE' : 'HIDDEN'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supabase Connection Details & Guide */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#FF2027]" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
            SUPABASE DATABASE & STORAGE INTEGRATION
          </h3>
        </div>

        <div className="p-4 bg-[#0A0A0A] rounded border border-[#262626] space-y-3 text-xs text-[#8A8A8A]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-white">Status:</span>
            <span
              className={`font-mono uppercase font-bold ${
                isConfigured ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isConfigured ? 'Live Supabase Cloud Connected' : 'Resilient Local Cache (Ready for Cloud Keys)'}
            </span>
          </div>

          <p className="leading-relaxed">
            Migration SQL script is available at <code className="text-white">supabase/migrations/20261004_initial_schema.sql</code>. It creates all tables, Row-Level Security policies, and the <code className="text-white">portfolio-media</code> storage bucket.
          </p>

          <div className="space-y-1 font-mono text-[11px] pt-2 border-t border-[#262626]">
            <div>VITE_SUPABASE_URL = {import.meta.env.VITE_SUPABASE_URL || 'Not set (using preview cache)'}</div>
            <div>VITE_SUPABASE_ANON_KEY = {import.meta.env.VITE_SUPABASE_ANON_KEY ? '••••••••••••••••' : 'Not set'}</div>
          </div>
        </div>
      </div>

      {/* Danger Zone / Factory Reset */}
      <div className="p-6 bg-red-950/20 border border-red-900/40 rounded-lg space-y-4">
        <div className="flex items-center gap-2 text-[#FF2027]">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-xs font-mono uppercase tracking-widest font-bold">
            DANGER ZONE: FACTORY RESET
          </h3>
        </div>

        <p className="text-xs text-[#8A8A8A] leading-relaxed">
          Resetting the website will restore all projects, services, skills, typography, and color styling back to the initial default seed state. An automatic backup snapshot will be recorded in Revisions first.
        </p>

        <div>
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-red-900/60 border border-red-700 text-red-200 text-xs font-bold uppercase tracking-wider hover:bg-red-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET ENTIRE WEBSITE TO DEFAULT</span>
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={resetConfirmOpen}
        title="Reset Entire Website?"
        message="This action will replace all current customization and revert all sections and content to initial default values. An automatic revision backup will be taken before resetting."
        confirmLabel="Yes, Reset Everything"
        confirmVariant="danger"
        onConfirm={handleResetSite}
        onCancel={() => setResetConfirmOpen(false)}
      />
    </div>
  );
};
