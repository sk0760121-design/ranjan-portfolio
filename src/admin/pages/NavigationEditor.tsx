import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { NavigationItem, SocialLink } from '../../types/database';
import { Plus, Trash2, MoveUp, MoveDown, Edit, Link, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const NavigationEditor: React.FC = () => {
  const { navItems, saveNavItems, socialLinks, saveSocialLinks } = useCMS();

  const [activeTab, setActiveTab] = useState<'nav' | 'social'>('nav');
  const [editingNav, setEditingNav] = useState<NavigationItem | null>(null);
  const [isCreatingNav, setIsCreatingNav] = useState(false);
  const [deleteNavId, setDeleteNavId] = useState<string | null>(null);

  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [isCreatingSocial, setIsCreatingSocial] = useState(false);
  const [deleteSocialId, setDeleteSocialId] = useState<string | null>(null);

  const handleSaveNav = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNav) return;
    let updated: NavigationItem[];
    if (isCreatingNav) {
      updated = [...navItems, editingNav];
    } else {
      updated = navItems.map((n) => (n.id === editingNav.id ? editingNav : n));
    }
    saveNavItems(updated);
    setEditingNav(null);
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocial) return;
    let updated: SocialLink[];
    if (isCreatingSocial) {
      updated = [...socialLinks, editingSocial];
    } else {
      updated = socialLinks.map((s) => (s.id === editingSocial.id ? editingSocial : s));
    }
    saveSocialLinks(updated);
    setEditingSocial(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            NAVIGATION & SOCIAL LINKS
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Configure top sticky navigation links, CTA destination, and external social media channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('nav')}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'nav'
                ? 'bg-[#FF2027] text-white'
                : 'bg-[#151515] text-[#8A8A8A] border border-[#262626]'
            }`}
          >
            Navigation Items ({navItems.length})
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'social'
                ? 'bg-[#FF2027] text-white'
                : 'bg-[#151515] text-[#8A8A8A] border border-[#262626]'
            }`}
          >
            Social Channels ({socialLinks.length})
          </button>
        </div>
      </div>

      {activeTab === 'nav' ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingNav({
                  id: 'nav-' + Math.random().toString(36).substring(2, 9),
                  label: 'NEW LINK',
                  href: '#section',
                  enabled: true,
                  sort_order: navItems.length + 1,
                });
                setIsCreatingNav(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="bg-[#151515] border border-[#262626] rounded-lg divide-y divide-[#262626]">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold uppercase text-white">{item.label}</h4>
                  <span className="text-xs font-mono text-[#8A8A8A]">{item.href}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      saveNavItems(
                        navItems.map((n) => (n.id === item.id ? { ...n, enabled: !n.enabled } : n))
                      );
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase ${
                      item.enabled
                        ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                        : 'bg-[#262626] text-[#8A8A8A]'
                    }`}
                  >
                    {item.enabled ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => {
                      setEditingNav({ ...item });
                      setIsCreatingNav(false);
                    }}
                    className="p-1.5 text-[#8A8A8A] hover:text-[#FF2027]"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteNavId(item.id)}
                    className="p-1.5 text-[#8A8A8A] hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingSocial({
                  id: 'soc-' + Math.random().toString(36).substring(2, 9),
                  platform: 'Instagram',
                  label: '@handle',
                  url: 'https://instagram.com/...',
                  enabled: true,
                  sort_order: socialLinks.length + 1,
                });
                setIsCreatingSocial(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Social Link</span>
            </button>
          </div>

          <div className="bg-[#151515] border border-[#262626] rounded-lg divide-y divide-[#262626]">
            {socialLinks.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold uppercase text-white">{item.platform}</h4>
                  <p className="text-xs text-[#8A8A8A] font-mono mt-0.5">
                    {item.label} · <span className="text-[#FF2027]">{item.url}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      saveSocialLinks(
                        socialLinks.map((s) => (s.id === item.id ? { ...s, enabled: !s.enabled } : s))
                      );
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase ${
                      item.enabled
                        ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                        : 'bg-[#262626] text-[#8A8A8A]'
                    }`}
                  >
                    {item.enabled ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => {
                      setEditingSocial({ ...item });
                      setIsCreatingSocial(false);
                    }}
                    className="p-1.5 text-[#8A8A8A] hover:text-[#FF2027]"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteSocialId(item.id)}
                    className="p-1.5 text-[#8A8A8A] hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Nav Modal */}
      {editingNav && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#151515] border border-[#262626] rounded-xl p-6">
            <h3 className="text-base font-bold uppercase text-white mb-4">Edit Navigation Link</h3>
            <form onSubmit={handleSaveNav} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  LABEL
                </label>
                <input
                  type="text"
                  required
                  value={editingNav.label}
                  onChange={(e) => setEditingNav({ ...editingNav, label: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  TARGET URL (E.G. #work OR https://...)
                </label>
                <input
                  type="text"
                  required
                  value={editingNav.href}
                  onChange={(e) => setEditingNav({ ...editingNav, href: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setEditingNav(null)}
                  className="px-4 py-2 rounded text-xs uppercase text-[#8A8A8A] border border-[#262626]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#FF2027] text-white text-xs uppercase font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Social Modal */}
      {editingSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#151515] border border-[#262626] rounded-xl p-6">
            <h3 className="text-base font-bold uppercase text-white mb-4">Edit Social Channel</h3>
            <form onSubmit={handleSaveSocial} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  PLATFORM (E.G. INSTAGRAM, YOUTUBE)
                </label>
                <input
                  type="text"
                  required
                  value={editingSocial.platform}
                  onChange={(e) =>
                    setEditingSocial({ ...editingSocial, platform: e.target.value })
                  }
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  HANDLE / DISPLAY LABEL
                </label>
                <input
                  type="text"
                  required
                  value={editingSocial.label}
                  onChange={(e) => setEditingSocial({ ...editingSocial, label: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  URL
                </label>
                <input
                  type="url"
                  required
                  value={editingSocial.url}
                  onChange={(e) => setEditingSocial({ ...editingSocial, url: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setEditingSocial(null)}
                  className="px-4 py-2 rounded text-xs uppercase text-[#8A8A8A] border border-[#262626]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#FF2027] text-white text-xs uppercase font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteNavId)}
        title="Delete Link"
        message="Are you sure you want to remove this navigation link?"
        onConfirm={() => {
          if (deleteNavId) {
            saveNavItems(navItems.filter((n) => n.id !== deleteNavId));
            setDeleteNavId(null);
          }
        }}
        onCancel={() => setDeleteNavId(null)}
      />

      <ConfirmModal
        isOpen={Boolean(deleteSocialId)}
        title="Delete Social Channel"
        message="Are you sure you want to remove this social link?"
        onConfirm={() => {
          if (deleteSocialId) {
            saveSocialLinks(socialLinks.filter((s) => s.id !== deleteSocialId));
            setDeleteSocialId(null);
          }
        }}
        onCancel={() => setDeleteSocialId(null)}
      />
    </div>
  );
};
