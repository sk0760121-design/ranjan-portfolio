import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { SkillItem, SoftwareItem } from '../../types/database';
import { Plus, Trash2, Edit, MoveUp, MoveDown, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const SkillsSoftwareEditor: React.FC = () => {
  const { skills, saveSkills, software, saveSoftware } = useCMS();

  const [activeTab, setActiveTab] = useState<'skills' | 'software'>('skills');

  // Skill editing state
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [deleteSkillId, setDeleteSkillId] = useState<string | null>(null);

  // Software editing state
  const [editingSoft, setEditingSoft] = useState<SoftwareItem | null>(null);
  const [isCreatingSoft, setIsCreatingSoft] = useState(false);
  const [deleteSoftId, setDeleteSoftId] = useState<string | null>(null);

  // Skills handlers
  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    let updated: SkillItem[];
    if (isCreatingSkill) {
      updated = [...skills, editingSkill];
    } else {
      updated = skills.map((s) => (s.id === editingSkill.id ? editingSkill : s));
    }
    saveSkills(updated);
    setEditingSkill(null);
  };

  // Software handlers
  const handleSaveSoft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSoft) return;
    let updated: SoftwareItem[];
    if (isCreatingSoft) {
      updated = [...software, editingSoft];
    } else {
      updated = software.map((s) => (s.id === editingSoft.id ? editingSoft : s));
    }
    saveSoftware(updated);
    setEditingSoft(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            SKILLS & SOFTWARE STACK
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Manage technical editing skills and video editing applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'skills'
                ? 'bg-[#FF2027] text-white'
                : 'bg-[#151515] text-[#8A8A8A] border border-[#262626]'
            }`}
          >
            Skills ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab('software')}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'software'
                ? 'bg-[#FF2027] text-white'
                : 'bg-[#151515] text-[#8A8A8A] border border-[#262626]'
            }`}
          >
            Software ({software.length})
          </button>
        </div>
      </div>

      {activeTab === 'skills' ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingSkill({
                  id: 'sk-' + Math.random().toString(36).substring(2, 9),
                  name: 'NEW SKILL',
                  description: '',
                  enabled: true,
                  sort_order: skills.length + 1,
                });
                setIsCreatingSkill(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="bg-[#151515] border border-[#262626] rounded-lg divide-y divide-[#262626]">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold uppercase text-white">{skill.name}</h4>
                  {skill.description && (
                    <p className="text-xs text-[#8A8A8A] mt-0.5">{skill.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      saveSkills(
                        skills.map((s) => (s.id === skill.id ? { ...s, enabled: !s.enabled } : s))
                      );
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase ${
                      skill.enabled
                        ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                        : 'bg-[#262626] text-[#8A8A8A]'
                    }`}
                  >
                    {skill.enabled ? 'Active' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => {
                      setEditingSkill({ ...skill });
                      setIsCreatingSkill(false);
                    }}
                    className="p-1.5 text-[#8A8A8A] hover:text-[#FF2027]"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteSkillId(skill.id)}
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
                setEditingSoft({
                  id: 'soft-' + Math.random().toString(36).substring(2, 9),
                  name: 'NEW SOFTWARE',
                  description: '',
                  logo_url: '',
                  website_url: '',
                  enabled: true,
                  sort_order: software.length + 1,
                });
                setIsCreatingSoft(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Software</span>
            </button>
          </div>

          <div className="bg-[#151515] border border-[#262626] rounded-lg divide-y divide-[#262626]">
            {software.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt={item.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-[#262626] text-white flex items-center justify-center text-xs font-bold">
                      {item.name.substring(0, 2)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    {item.description && (
                      <p className="text-xs text-[#8A8A8A] mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      saveSoftware(
                        software.map((s) =>
                          s.id === item.id ? { ...s, enabled: !s.enabled } : s
                        )
                      );
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase ${
                      item.enabled
                        ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                        : 'bg-[#262626] text-[#8A8A8A]'
                    }`}
                  >
                    {item.enabled ? 'Active' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => {
                      setEditingSoft({ ...item });
                      setIsCreatingSoft(false);
                    }}
                    className="p-1.5 text-[#8A8A8A] hover:text-[#FF2027]"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteSoftId(item.id)}
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

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#151515] border border-[#262626] rounded-xl p-6">
            <h3 className="text-base font-bold uppercase text-white mb-4">Edit Skill</h3>
            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  SKILL NAME
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  DESCRIPTION
                </label>
                <input
                  type="text"
                  value={editingSkill.description || ''}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, description: e.target.value })
                  }
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
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

      {/* Edit Software Modal */}
      {editingSoft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#151515] border border-[#262626] rounded-xl p-6">
            <h3 className="text-base font-bold uppercase text-white mb-4">Edit Software Tool</h3>
            <form onSubmit={handleSaveSoft} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  SOFTWARE NAME
                </label>
                <input
                  type="text"
                  required
                  value={editingSoft.name}
                  onChange={(e) => setEditingSoft({ ...editingSoft, name: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  DESCRIPTION
                </label>
                <input
                  type="text"
                  value={editingSoft.description || ''}
                  onChange={(e) =>
                    setEditingSoft({ ...editingSoft, description: e.target.value })
                  }
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  LOGO ICON URL (SVG OR PNG)
                </label>
                <input
                  type="url"
                  value={editingSoft.logo_url || ''}
                  onChange={(e) => setEditingSoft({ ...editingSoft, logo_url: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  OFFICIAL WEBSITE URL
                </label>
                <input
                  type="url"
                  value={editingSoft.website_url || ''}
                  onChange={(e) => setEditingSoft({ ...editingSoft, website_url: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setEditingSoft(null)}
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

      {/* Delete Modals */}
      <ConfirmModal
        isOpen={Boolean(deleteSkillId)}
        title="Delete Skill"
        message="Are you sure you want to delete this skill?"
        onConfirm={() => {
          if (deleteSkillId) {
            saveSkills(skills.filter((s) => s.id !== deleteSkillId));
            setDeleteSkillId(null);
          }
        }}
        onCancel={() => setDeleteSkillId(null)}
      />

      <ConfirmModal
        isOpen={Boolean(deleteSoftId)}
        title="Delete Software"
        message="Are you sure you want to delete this software tool?"
        onConfirm={() => {
          if (deleteSoftId) {
            saveSoftware(software.filter((s) => s.id !== deleteSoftId));
            setDeleteSoftId(null);
          }
        }}
        onCancel={() => setDeleteSoftId(null)}
      />
    </div>
  );
};
