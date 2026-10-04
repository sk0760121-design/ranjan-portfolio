import React, { useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { MediaAsset } from '../../types/database';
import {
  Upload,
  Copy,
  Trash2,
  Check,
  Search,
  Filter,
  Film,
  Image,
  File,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const MediaLibrary: React.FC = () => {
  const { mediaAssets, addMedia, deleteMedia } = useCMS();
  const { isConfigured } = useAuth();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 50MB
    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File size exceeds 50MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      setUploadError('Only video (MP4, WebM) or image files (JPG, PNG, WebP) are allowed.');
      setIsUploading(false);
      return;
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `uploads/${Date.now()}_${cleanName}`;

    try {
      let finalUrl = '';

      if (isSupabaseConfigured && supabase) {
        // Real upload to Supabase Storage bucket 'portfolio-media'
        const { data, error } = await supabase.storage
          .from('portfolio-media')
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          throw error;
        }

        // Retrieve public URL
        const { data: publicUrlData } = supabase.storage
          .from('portfolio-media')
          .getPublicUrl(path);

        finalUrl = publicUrlData.publicUrl;
      } else {
        // Local preview fallback using Data URL / Object URL
        finalUrl = URL.createObjectURL(file);
      }

      const newAsset: MediaAsset = {
        id: 'med-' + Math.random().toString(36).substring(2, 9),
        filename: file.name,
        file_type: isVideo ? 'video' : 'image',
        mime_type: file.type,
        size_bytes: file.size,
        url: finalUrl,
        storage_path: path,
        alt_text: file.name,
        created_at: new Date().toISOString(),
      };

      addMedia(newAsset);
      setUploadSuccess(`Uploaded "${file.name}" successfully!`);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'File upload failed. Ensure bucket permissions are enabled.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = mediaAssets.filter((a) => {
    const matchSearch = a.filename.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || a.file_type === typeFilter;
    return matchSearch && matchType;
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            MEDIA ASSET LIBRARY
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Storage repository for project trailers, showreels, thumbnails, and photography.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/mp4,video/webm"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#FF2027]/20"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'UPLOADING...' : 'UPLOAD ASSET'}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {uploadError && (
        <div className="p-4 rounded bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#FF2027]" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-4 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
          <input
            type="text"
            placeholder="Search media by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151515] border border-[#262626] rounded pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#505050] focus:outline-none focus:border-[#FF2027]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['all', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded text-xs uppercase font-mono tracking-wider transition-colors cursor-pointer flex-1 sm:flex-initial text-center ${
                typeFilter === t
                  ? 'bg-[#FF2027] text-white font-bold'
                  : 'bg-[#151515] text-[#8A8A8A] border border-[#262626]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className="group relative bg-[#151515] border border-[#262626] rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#FF2027]/60 transition-all"
          >
            {/* Thumbnail preview */}
            <div className="relative aspect-[16/10] bg-black overflow-hidden flex items-center justify-center">
              {asset.file_type === 'video' ? (
                <div className="relative w-full h-full flex items-center justify-center bg-[#0A0A0A]">
                  <video
                    src={asset.url}
                    muted
                    preload="metadata"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute p-2 rounded-full bg-black/60 text-white">
                    <Film className="w-5 h-5 text-[#FF2027]" />
                  </div>
                </div>
              ) : (
                <img
                  src={asset.url}
                  alt={asset.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}

              <span className="absolute top-2 left-2 text-[9px] font-mono uppercase bg-black/75 px-1.5 py-0.5 rounded text-white">
                {asset.file_type}
              </span>
            </div>

            {/* Info and Actions */}
            <div className="p-3">
              <span className="text-xs font-bold text-white block truncate mb-1">
                {asset.filename}
              </span>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8A8A8A]">
                <span>{formatSize(asset.size_bytes)}</span>
                <span>{new Date(asset.created_at).toLocaleDateString()}</span>
              </div>

              <div className="mt-3 pt-2 border-t border-[#262626] flex items-center justify-between">
                <button
                  onClick={() => handleCopyUrl(asset)}
                  className="flex items-center gap-1 text-[11px] font-mono uppercase text-[#8A8A8A] hover:text-[#FF2027] transition-colors cursor-pointer"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setDeleteId(asset.id)}
                  className="p-1 rounded text-[#8A8A8A] hover:text-red-400 hover:bg-[#262626] transition-colors cursor-pointer"
                  title="Delete Asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Media Asset"
        message="Are you sure you want to remove this media asset from your library?"
        onConfirm={() => {
          if (deleteId) {
            deleteMedia(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
