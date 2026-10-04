import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  Film,
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Check,
  Eye,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

interface StoryItem {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  posterUrl: string;
  duration?: string;
  views?: string;
  client?: string;
}

export const StoriesEditor: React.FC = () => {
  const { sections, updateSection } = useCMS();
  const storiesSection = sections.stories || {
    id: 'stories',
    name: 'Stories & Reels Marquee',
    enabled: true,
    sort_order: 3.5,
    content: {},
  };
  const content = storiesSection.content || {};

  const items: StoryItem[] = content.items || [];

  const [editingItem, setEditingItem] = useState<StoryItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const handleUpdateContent = (field: string, val: any) => {
    updateSection('stories', {
      content: {
        ...content,
        [field]: val,
      },
    });
  };

  const handleToggleEnabled = (enabled: boolean) => {
    updateSection('stories', { enabled });
  };

  const handleSaveItem = (item: StoryItem) => {
    let updated: StoryItem[];
    if (items.some((i) => i.id === item.id)) {
      updated = items.map((i) => (i.id === item.id ? item : i));
    } else {
      updated = [item, ...items];
    }
    handleUpdateContent('items', updated);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    handleUpdateContent('items', updated);
    setDeleteItemId(null);
  };

  const handleAddNewStory = () => {
    const newStory: StoryItem = {
      id: 'story-' + Date.now(),
      title: 'NEW VERTICAL EDIT',
      category: 'Instagram Reel',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      duration: '0:20',
      views: '100K Views',
      client: 'Brand Partner',
    };
    setEditingItem(newStory);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            STORIES & REELS CONTINUOUS MARQUEE
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Configure the infinite right-to-left 9:16 vertical video marquee, autoplay rules, playback speeds and card geometry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono uppercase text-[#8A8A8A]">
            <span>SECTION VISIBILITY</span>
            <input
              type="checkbox"
              checked={storiesSection.enabled !== false}
              onChange={(e) => handleToggleEnabled(e.target.checked)}
              className="accent-[#FF2027] w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Marquee Motion Controls Panel */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#262626]">
          <Sliders className="w-4 h-4 text-[#FF2027]" />
          <h3 className="text-sm font-bold uppercase text-white tracking-wider">
            CONTINUOUS MARQUEE ENGINE SETTINGS
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Continuous Loop Toggle */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-2">
              INFINITE MARQUEE
            </label>
            <select
              value={content.marqueeEnabled !== false ? 'on' : 'off'}
              onChange={(e) => handleUpdateContent('marqueeEnabled', e.target.value === 'on')}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
            >
              <option value="on">Enabled (Continuous Loop)</option>
              <option value="off">Disabled (Static Row)</option>
            </select>
          </div>

          {/* Direction */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-2">
              MOVEMENT DIRECTION
            </label>
            <select
              value={content.direction || 'left'}
              onChange={(e) => handleUpdateContent('direction', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
            >
              <option value="left">RIGHT → LEFT (Standard)</option>
            </select>
          </div>

          {/* Speed Preset */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-2">
              MARQUEE SPEED
            </label>
            <select
              value={content.speed || 'medium'}
              onChange={(e) => handleUpdateContent('speed', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
            >
              <option value="slow">Slow (52s duration)</option>
              <option value="medium">Medium (32s duration)</option>
              <option value="fast">Fast (20s duration)</option>
              <option value="custom">Custom Speed</option>
            </select>
          </div>

          {/* Pause on Hover */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-2">
              HOVER RESTRAINT
            </label>
            <select
              value={content.pauseOnHover !== false ? 'pause' : 'continue'}
              onChange={(e) => handleUpdateContent('pauseOnHover', e.target.value === 'pause')}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
            >
              <option value="pause">Subtly Pause on Hover</option>
              <option value="continue">Continuous (Never Pause)</option>
            </select>
          </div>
        </div>

        {/* Custom Speed Slider if custom selected */}
        {content.speed === 'custom' && (
          <div className="pt-2">
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>CUSTOM CYCLE DURATION (SECONDS)</span>
              <span className="text-white font-bold">{content.customSpeedSeconds || 32}s</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              value={content.customSpeedSeconds || 32}
              onChange={(e) => handleUpdateContent('customSpeedSeconds', parseInt(e.target.value, 10))}
              className="w-full accent-[#FF2027]"
            />
          </div>
        )}

        {/* Geometry Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#202020]">
          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>CARD WIDTH (PX)</span>
              <span className="text-white font-bold">{content.cardWidthPx || 280}px</span>
            </div>
            <input
              type="range"
              min="220"
              max="380"
              value={content.cardWidthPx || 280}
              onChange={(e) => handleUpdateContent('cardWidthPx', parseInt(e.target.value, 10))}
              className="w-full accent-[#FF2027]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>CARD HEIGHT (PX)</span>
              <span className="text-white font-bold">{content.cardHeightPx || 498}px</span>
            </div>
            <input
              type="range"
              min="380"
              max="640"
              value={content.cardHeightPx || 498}
              onChange={(e) => handleUpdateContent('cardHeightPx', parseInt(e.target.value, 10))}
              className="w-full accent-[#FF2027]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-[#8A8A8A] mb-2">
              <span>CARD GAP SPACING</span>
              <span className="text-white font-bold">{content.gapPx || 24}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="48"
              value={content.gapPx || 24}
              onChange={(e) => handleUpdateContent('gapPx', parseInt(e.target.value, 10))}
              className="w-full accent-[#FF2027]"
            />
          </div>
        </div>

        {/* Autoplay & Audio Rules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#202020]">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1.5">
              AUTOPLAY ON VIEWPORT
            </label>
            <select
              value={content.autoplay !== false ? 'true' : 'false'}
              onChange={(e) => handleUpdateContent('autoplay', e.target.value === 'true')}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-1.5 text-xs text-white"
            >
              <option value="true">Enabled (Browser Muted Safe)</option>
              <option value="false">Disabled (Click to Play)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1.5">
              LOOP REELS
            </label>
            <select
              value={content.loop !== false ? 'true' : 'false'}
              onChange={(e) => handleUpdateContent('loop', e.target.value === 'true')}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-1.5 text-xs text-white"
            >
              <option value="true">Infinite Loop</option>
              <option value="false">Play Once</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1.5">
              INITIAL AUDIO STATE
            </label>
            <select
              value={content.muted !== false ? 'true' : 'false'}
              onChange={(e) => handleUpdateContent('muted', e.target.value === 'true')}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-1.5 text-xs text-white"
            >
              <option value="true">Muted (Complies with Web Autoplay Policy)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section Headings & Copy */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-xl space-y-4">
        <h3 className="text-sm font-bold uppercase text-white tracking-wider pb-2 border-b border-[#262626]">
          SECTION HEADINGS & COPY
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1">
              EYEBROW LABEL
            </label>
            <input
              type="text"
              value={content.eyebrow || ''}
              onChange={(e) => handleUpdateContent('eyebrow', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1">
              MAIN HEADING
            </label>
            <input
              type="text"
              value={content.heading || ''}
              onChange={(e) => handleUpdateContent('heading', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1">
              HIGHLIGHT ACCENT
            </label>
            <input
              type="text"
              value={content.headingHighlight || ''}
              onChange={(e) => handleUpdateContent('headingHighlight', e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1">
            SUPPORTING DESCRIPTION
          </label>
          <textarea
            rows={2}
            value={content.description || ''}
            onChange={(e) => handleUpdateContent('description', e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
          />
        </div>
      </div>

      {/* Story Video Items List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#FF2027]" />
            <h3 className="text-sm font-bold uppercase text-white tracking-wider">
              VERTICAL REELS & STORIES ({items.length})
            </h3>
          </div>

          <button
            onClick={handleAddNewStory}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-all cursor-pointer shadow-lg shadow-[#FF2027]/20"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEW REEL</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#151515] border border-[#262626] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#383838] transition-all"
            >
              <div className="relative aspect-[9/14] bg-black overflow-hidden flex items-center justify-center">
                <video
                  src={item.videoUrl}
                  poster={item.posterUrl}
                  muted
                  preload="metadata"
                  className="w-full h-full object-cover opacity-80"
                />
                <span className="absolute top-2 left-2 text-[10px] font-mono uppercase bg-black/80 px-2 py-0.5 rounded text-white font-bold border border-white/10">
                  {item.category}
                </span>
                {item.views && (
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-400 bg-black/80 px-2 py-0.5 rounded border border-white/10">
                    {item.views}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                {item.client && (
                  <p className="text-[11px] font-mono text-[#8A8A8A] truncate">
                    Client: {item.client}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-[#262626] flex items-center justify-between">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="inline-flex items-center gap-1 text-xs font-mono uppercase text-[#8A8A8A] hover:text-white transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteItemId(item.id)}
                    className="p-1 rounded text-[#8A8A8A] hover:text-red-400 hover:bg-[#262626] transition-colors cursor-pointer"
                    title="Delete Story"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Story Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2B2B2B] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              EDIT STORY / REEL DETAILS
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1">
                  TITLE
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1">
                  CATEGORY TAG
                </label>
                <input
                  type="text"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1">
                  VIDEO URL (MP4 / WEBM)
                </label>
                <input
                  type="text"
                  value={editingItem.videoUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1">
                  POSTER IMAGE URL
                </label>
                <input
                  type="text"
                  value={editingItem.posterUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, posterUrl: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1">
                    VIEWS STAT
                  </label>
                  <input
                    type="text"
                    value={editingItem.views || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, views: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#8A8A8A] mb-1">
                    CLIENT / BRAND
                  </label>
                  <input
                    type="text"
                    value={editingItem.client || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, client: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF2027]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#262626] flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded text-xs text-[#8A8A8A] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveItem(editingItem)}
                className="px-5 py-2 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] cursor-pointer"
              >
                Save Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteItemId)}
        title="Delete Story Reel"
        message="Are you sure you want to remove this story reel from the marquee?"
        onConfirm={() => {
          if (deleteItemId) {
            handleDeleteItem(deleteItemId);
          }
        }}
        onCancel={() => setDeleteItemId(null)}
      />
    </div>
  );
};
