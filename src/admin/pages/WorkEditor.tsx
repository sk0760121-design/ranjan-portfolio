import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Project } from '../../types/database';
import {
  Plus,
  Trash2,
  Copy,
  Edit,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Search,
  ExternalLink,
  Film,
  Check,
  X,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const WorkEditor: React.FC = () => {
  const { projects, saveProjects, addProject, updateProject, deleteProject } = useCMS();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Project>>({});

  const startCreate = () => {
    const newProj: Project = {
      id: 'proj-' + Math.random().toString(36).substring(2, 9),
      title: 'NEW PROJECT TITLE',
      slug: 'new-project-' + Date.now().toString(36),
      category: 'Cinematic Film',
      short_description: 'Concise editorial summary of the project and creative treatment.',
      long_description: 'Full narrative breakdown, client goals, timeline, and post-production techniques.',
      thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      hero_media: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      video_url: '',
      instagram_url: '',
      youtube_url: '',
      client: '',
      year: '2026',
      tags: ['Cinematic', 'Editing'],
      featured: false,
      published: true,
      sort_order: projects.length + 1,
      created_at: new Date().toISOString(),
    };
    setFormData(newProj);
    setIsCreating(true);
    setEditingProject(newProj);
  };

  const startEdit = (proj: Project) => {
    setFormData({ ...proj });
    setIsCreating(false);
    setEditingProject(proj);
  };

  const handleDuplicate = (proj: Project) => {
    const duplicated: Project = {
      ...proj,
      id: 'proj-' + Math.random().toString(36).substring(2, 9),
      title: `${proj.title} (COPY)`,
      slug: `${proj.slug}-copy-${Math.random().toString(36).substring(2, 6)}`,
      sort_order: projects.length + 1,
      created_at: new Date().toISOString(),
    };
    addProject(duplicated);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) return;

    if (isCreating) {
      addProject(formData as Project);
    } else {
      updateProject(formData as Project);
    }

    setEditingProject(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // re-assign sort_orders
    updated.forEach((p, idx) => {
      p.sort_order = idx + 1;
    });

    saveProjects(updated);
  };

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            PROJECT CMS
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Add, edit, duplicate, reorder, and manage portfolio project showcases.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-all cursor-pointer shadow-lg shadow-[#FF2027]/20"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PROJECT</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
          <input
            type="text"
            placeholder="Search projects by title, category, or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151515] border border-[#262626] rounded pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#505050] focus:outline-none focus:border-[#FF2027]"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full sm:w-auto bg-[#151515] border border-[#262626] rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF2027] cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="Cinematic Film">Cinematic Film</option>
          <option value="Short Form">Short Form</option>
          <option value="Wedding Film">Wedding Film</option>
          <option value="Brand Videos">Brand Videos</option>
        </select>
      </div>

      {/* Projects List Table */}
      <div className="bg-[#151515] border border-[#262626] rounded-lg overflow-hidden">
        <div className="divide-y divide-[#262626]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8A8A8A]">
              No projects match your search criteria.
            </div>
          ) : (
            filtered.map((proj, idx) => (
              <div
                key={proj.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#1a1a1a] transition-colors"
              >
                {/* Thumbnail & Title */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-16 h-12 rounded overflow-hidden bg-black flex-shrink-0 border border-[#262626]">
                    <img
                      src={proj.thumbnail}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold uppercase text-white truncate">
                        {proj.title}
                      </h4>
                      {!proj.published && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/70 border border-amber-800 text-amber-300">
                          Draft
                        </span>
                      )}
                      {proj.featured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-950/70 border border-red-800 text-red-300">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8A8A8A] font-mono mt-0.5">
                      {proj.category} · {proj.year || '2026'} {proj.client ? `· ${proj.client}` : ''}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded text-[#8A8A8A] hover:text-white hover:bg-[#262626] disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === filtered.length - 1}
                    className="p-1.5 rounded text-[#8A8A8A] hover:text-white hover:bg-[#262626] disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      updateProject({ ...proj, published: !proj.published })
                    }
                    className="p-1.5 rounded text-[#8A8A8A] hover:text-white hover:bg-[#262626] cursor-pointer"
                    title={proj.published ? 'Unpublish' : 'Publish'}
                  >
                    {proj.published ? (
                      <Eye className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDuplicate(proj)}
                    className="p-1.5 rounded text-[#8A8A8A] hover:text-white hover:bg-[#262626] cursor-pointer"
                    title="Duplicate Project"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => startEdit(proj)}
                    className="p-1.5 rounded text-[#8A8A8A] hover:text-[#FF2027] hover:bg-[#262626] cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(proj.id)}
                    className="p-1.5 rounded text-[#8A8A8A] hover:text-red-400 hover:bg-[#262626] cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit / Create Project Modal Form */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#151515] border border-[#262626] rounded-xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
              <h3 className="text-lg font-bold uppercase tracking-tight text-white">
                {isCreating ? 'CREATE NEW PROJECT' : 'EDIT PROJECT'}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-[#8A8A8A] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                    PROJECT TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      })
                    }
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                    URL SLUG *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                    CATEGORY
                  </label>
                  <select
                    value={formData.category || 'Cinematic Film'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                  >
                    <option value="Cinematic Film">Cinematic Film</option>
                    <option value="Short Form">Short Form</option>
                    <option value="Wedding Film">Wedding Film</option>
                    <option value="Brand Videos">Brand Videos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                    CLIENT NAME
                  </label>
                  <input
                    type="text"
                    value={formData.client || ''}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                    placeholder="e.g. Red Bull / Studio"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                    PRODUCTION YEAR
                  </label>
                  <input
                    type="text"
                    value={formData.year || '2026'}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                  SHORT CARD DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={formData.short_description || ''}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                  FULL NARRATIVE / PRODUCTION BREAKDOWN
                </label>
                <textarea
                  rows={4}
                  value={formData.long_description || ''}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                    THUMBNAIL IMAGE URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.thumbnail || ''}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                    PROJECT VIDEO URL (MP4 / WebM / CDN)
                  </label>
                  <input
                    type="url"
                    value={formData.video || ''}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                    placeholder="https://.../video.mp4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                    INSTAGRAM REEL LINK
                  </label>
                  <input
                    type="url"
                    value={formData.instagram_url || ''}
                    onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                    placeholder="https://instagram.com/p/..."
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                    YOUTUBE VIDEO LINK
                  </label>
                  <input
                    type="url"
                    value={formData.youtube_url || ''}
                    onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                  TAGS (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  value={formData.tags ? formData.tags.join(', ') : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2027]"
                  placeholder="Cinematic, Sound FX, Color Grade"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs uppercase font-mono text-white">
                  <input
                    type="checkbox"
                    checked={formData.published !== false}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="accent-[#FF2027]"
                  />
                  <span>Published to Live Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs uppercase font-mono text-white">
                  <input
                    type="checkbox"
                    checked={formData.featured === true}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="accent-[#FF2027]"
                  />
                  <span>Featured On Top</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] border border-[#262626] hover:bg-[#202020] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-all shadow-lg shadow-[#FF2027]/20"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action will remove it from the database and public portfolio."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteProject(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
