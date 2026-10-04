import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { BeforeAfterItem } from '../../types/database';
import { Plus, Trash2, Edit, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const BeforeAfterEditor: React.FC = () => {
  const { beforeAfter, saveBeforeAfter } = useCMS();
  const [editingItem, setEditingItem] = useState<BeforeAfterItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: BeforeAfterItem[];
    if (isCreating) {
      updated = [...beforeAfter, editingItem];
    } else {
      updated = beforeAfter.map((i) => (i.id === editingItem.id ? editingItem : i));
    }
    saveBeforeAfter(updated);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    const updated = beforeAfter.filter((i) => i.id !== id);
    saveBeforeAfter(updated);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            BEFORE / AFTER COLOR GRADE SLIDERS
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Configure interactive comparison widgets to showcase RAW log footage versus graded film master.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem({
              id: 'ba-' + Math.random().toString(36).substring(2, 9),
              title: 'NEW COLOR COMPARISON',
              description: 'Camera LOG vs. Final 35mm film grade.',
              before_media:
                'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=30',
              after_media:
                'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=90',
              media_type: 'image',
              initial_slider_position: 50,
              enabled: true,
              sort_order: beforeAfter.length + 1,
            });
            setIsCreating(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-all cursor-pointer shadow-lg shadow-[#FF2027]/20"
        >
          <Plus className="w-4 h-4" />
          <span>ADD COMPARISON</span>
        </button>
      </div>

      <div className="space-y-6">
        {beforeAfter.map((item) => (
          <div
            key={item.id}
            className="bg-[#151515] border border-[#262626] rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-18 rounded overflow-hidden bg-black flex-shrink-0 border border-[#262626]">
                <img
                  src={item.after_media}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/80 px-1 rounded text-white">
                  {item.initial_slider_position}%
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold uppercase text-white">{item.title}</h4>
                {item.description && (
                  <p className="text-xs text-[#8A8A8A] mt-1">{item.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() =>
                  saveBeforeAfter(
                    beforeAfter.map((i) =>
                      i.id === item.id ? { ...i, enabled: !i.enabled } : i
                    )
                  )
                }
                className={`px-3 py-1 rounded text-[11px] font-mono uppercase ${
                  item.enabled
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                    : 'bg-[#262626] text-[#8A8A8A]'
                }`}
              >
                {item.enabled ? 'Enabled' : 'Disabled'}
              </button>

              <button
                onClick={() => {
                  setEditingItem({ ...item });
                  setIsCreating(false);
                }}
                className="p-1.5 text-[#8A8A8A] hover:text-[#FF2027]"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDeleteConfirmId(item.id)}
                className="p-1.5 text-[#8A8A8A] hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#151515] border border-[#262626] rounded-xl p-6 shadow-2xl">
            <h3 className="text-base font-bold uppercase text-white mb-4">
              {isCreating ? 'CREATE COMPARISON' : 'EDIT COMPARISON'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  COMPARISON TITLE
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  DESCRIPTION
                </label>
                <input
                  type="text"
                  value={editingItem.description || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  BEFORE MEDIA URL (RAW LOG IMAGE)
                </label>
                <input
                  type="url"
                  required
                  value={editingItem.before_media}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, before_media: e.target.value })
                  }
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  AFTER MEDIA URL (GRADED MASTER IMAGE)
                </label>
                <input
                  type="url"
                  required
                  value={editingItem.after_media}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, after_media: e.target.value })
                  }
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs uppercase font-mono text-[#8A8A8A] mb-1">
                  <span>INITIAL SLIDER POSITION</span>
                  <span>{editingItem.initial_slider_position}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={editingItem.initial_slider_position}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      initial_slider_position: Number(e.target.value),
                    })
                  }
                  className="w-full accent-[#FF2027]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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
        isOpen={Boolean(deleteConfirmId)}
        title="Delete Comparison"
        message="Are you sure you want to remove this before/after comparison?"
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
