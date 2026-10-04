import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Testimonial } from '../../types/database';
import { Plus, Trash2, Edit, Eye, EyeOff, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const TestimonialsEditor: React.FC = () => {
  const { testimonials, saveTestimonials } = useCMS();
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: Testimonial[];
    if (isCreating) {
      updated = [...testimonials, editingItem];
    } else {
      updated = testimonials.map((t) => (t.id === editingItem.id ? editingItem : t));
    }
    saveTestimonials(updated);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    const updated = testimonials.filter((t) => t.id !== id);
    saveTestimonials(updated);
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
            TESTIMONIALS & REVIEWS
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Manage client reviews, creator endorsements, author roles, and companies.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem({
              id: 'test-' + Math.random().toString(36).substring(2, 9),
              quote: 'Outstanding rhythm and sound design. Brought our film together perfectly.',
              name: 'CLIENT NAME',
              role: 'Producer / Director',
              company: 'Media Production Co.',
              profile_image: '',
              published: true,
              sort_order: testimonials.length + 1,
              created_at: new Date().toISOString(),
            });
            setIsCreating(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-all cursor-pointer shadow-lg shadow-[#FF2027]/20"
        >
          <Plus className="w-4 h-4" />
          <span>ADD TESTIMONIAL</span>
        </button>
      </div>

      <div className="space-y-4">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-[#151515] border border-[#262626] rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div>
              <p className="text-sm text-white italic mb-2">"{item.quote}"</p>
              <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A8A]">
                <strong className="text-white uppercase font-sans">{item.name}</strong>
                <span>·</span>
                <span>{item.role}</span>
                {item.company && <span>({item.company})</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() =>
                  saveTestimonials(
                    testimonials.map((t) =>
                      t.id === item.id ? { ...t, published: !t.published } : t
                    )
                  )
                }
                className="p-1.5 rounded text-[#8A8A8A] hover:text-white"
              >
                {item.published ? (
                  <Eye className="w-4 h-4 text-emerald-400" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => {
                  setEditingItem({ ...item });
                  setIsCreating(false);
                }}
                className="p-1.5 rounded text-[#8A8A8A] hover:text-[#FF2027]"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDeleteConfirmId(item.id)}
                className="p-1.5 rounded text-[#8A8A8A] hover:text-red-400"
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
              {isCreating ? 'ADD TESTIMONIAL' : 'EDIT TESTIMONIAL'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  QUOTE *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.quote}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                    CLIENT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                    ROLE / TITLE
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                    COMPANY / STUDIO
                  </label>
                  <input
                    type="text"
                    value={editingItem.company || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                    AVATAR IMAGE URL
                  </label>
                  <input
                    type="url"
                    value={editingItem.profile_image || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, profile_image: e.target.value })
                    }
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                  />
                </div>
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
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial?"
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
