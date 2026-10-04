import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { ServiceItem } from '../../types/database';
import { Plus, Trash2, Edit, MoveUp, MoveDown, Check, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const ServicesEditor: React.FC = () => {
  const { services, saveServices } = useCMS();
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const startCreate = () => {
    const newItem: ServiceItem = {
      id: 'srv-' + Math.random().toString(36).substring(2, 9),
      number: `0${services.length + 1}`,
      title: 'NEW SERVICE TITLE',
      description: 'Describe the editing workflow and creative deliverable.',
      enabled: true,
      sort_order: services.length + 1,
    };
    setEditingItem(newItem);
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: ServiceItem[];
    if (isCreating) {
      updated = [...services, editingItem];
    } else {
      updated = services.map((s) => (s.id === editingItem.id ? editingItem : s));
    }
    saveServices(updated);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    const updated = services.filter((s) => s.id !== id);
    saveServices(updated);
    setDeleteConfirmId(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= services.length) return;

    const copy = [...services];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;

    copy.forEach((s, idx) => {
      s.sort_order = idx + 1;
      s.number = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;
    });

    saveServices(copy);
  };

  const handleToggle = (id: string) => {
    const updated = services.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    saveServices(updated);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            SERVICES MANAGEMENT
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Manage editing offerings, descriptions, numbering, and display order.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-all cursor-pointer shadow-lg shadow-[#FF2027]/20"
        >
          <Plus className="w-4 h-4" />
          <span>ADD SERVICE</span>
        </button>
      </div>

      <div className="bg-[#151515] border border-[#262626] rounded-lg divide-y divide-[#262626]">
        {services.map((item, idx) => (
          <div
            key={item.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-bold text-[#FF2027] mt-1">
                {item.number}
              </span>
              <div>
                <h4 className="text-sm font-bold uppercase text-white">{item.title}</h4>
                <p className="text-xs text-[#8A8A8A] mt-1 max-w-xl">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleToggle(item.id)}
                className={`px-3 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  item.enabled
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                    : 'bg-[#262626] text-[#8A8A8A]'
                }`}
              >
                {item.enabled ? 'Enabled' : 'Disabled'}
              </button>

              <button
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 rounded text-[#8A8A8A] hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <MoveUp className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === services.length - 1}
                className="p-1.5 rounded text-[#8A8A8A] hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <MoveDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setEditingItem({ ...item });
                  setIsCreating(false);
                }}
                className="p-1.5 rounded text-[#8A8A8A] hover:text-[#FF2027] cursor-pointer"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDeleteConfirmId(item.id)}
                className="p-1.5 rounded text-[#8A8A8A] hover:text-red-400 cursor-pointer"
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
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <h3 className="text-base font-bold uppercase text-white">
                {isCreating ? 'ADD SERVICE' : 'EDIT SERVICE'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-[#8A8A8A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  SERVICE NUMBER (E.G. 01)
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.number}
                  onChange={(e) => setEditingItem({ ...editingItem, number: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  TITLE
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded text-xs uppercase font-semibold text-[#8A8A8A] border border-[#262626]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#FF2027] text-white text-xs uppercase font-bold hover:bg-[#E0181F]"
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
        title="Delete Service"
        message="Are you sure you want to delete this service offering?"
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
