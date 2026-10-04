import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useAuth } from '../../context/AuthContext';
import { MediaAsset } from '../../types/database';
import { VideoUploadService, StoragePlanInfo } from '../../lib/videoUpload';
import {
  Upload,
  Copy,
  Trash2,
  Check,
  Search,
  Film,
  Image,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  XCircle,
  HardDrive,
  Info,
  Clock,
  Gauge,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { VideoPreviewModal } from '../components/VideoPreviewModal';

interface ActiveUploadState {
  filename: string;
  fileSize: number;
  percentage: number;
  bytesUploaded: number;
  bytesTotal: number;
  speedBytesPerSec: number;
  etaSeconds: number;
  isPaused: boolean;
  error: string | null;
  controller: {
    pause: () => void;
    resume: () => void;
    cancel: () => void;
  } | null;
}

export const MediaLibrary: React.FC = () => {
  const { mediaAssets, addMedia, deleteMedia } = useCMS();
  const { isConfigured } = useAuth();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  // Storage plan detection
  const [storagePlan, setStoragePlan] = useState<StoragePlanInfo>({
    maxSizeBytes: 50 * 1024 * 1024,
    planName: 'Free Plan (50 MB)',
    isFreeTier: true,
    bucketLimitBytes: null,
    source: 'default',
  });
  const [showPlanSwitcher, setShowPlanSwitcher] = useState(false);

  // Active resumable upload state
  const [activeUpload, setActiveUpload] = useState<ActiveUploadState | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    VideoUploadService.detectStoragePlan().then((plan) => {
      setStoragePlan(plan);
    });
  }, [isConfigured]);

  const handlePlanChange = (plan: 'free' | 'pro' | 'enterprise') => {
    const updated = VideoUploadService.setStoragePlanOverride(plan);
    setStoragePlan(updated);
    setShowPlanSwitcher(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    // Check against real Supabase Storage provider limit
    if (file.size > storagePlan.maxSizeBytes) {
      setUploadError(
        `File size (${formatSize(file.size)}) exceeds your configured storage provider limit (${formatSize(
          storagePlan.maxSizeBytes
        )}). If your Supabase project is on Pro plan (5GB limit), click "Change Plan" above to unlock large uploads.`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      setUploadError('Only video (MP4, WebM, MOV) or image files (JPG, PNG, WebP) are allowed.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `uploads/${Date.now()}_${cleanName}`;

    // Extract video resolution and duration without modifying or compressing
    let videoMeta = { width: 0, height: 0, duration: 0, resolution: '' };
    if (isVideo) {
      videoMeta = await VideoUploadService.extractVideoMetadata(file);
    }

    // Set initial upload state
    const initialUploadState: ActiveUploadState = {
      filename: file.name,
      fileSize: file.size,
      percentage: 0,
      bytesUploaded: 0,
      bytesTotal: file.size,
      speedBytesPerSec: 0,
      etaSeconds: 0,
      isPaused: false,
      error: null,
      controller: null,
    };
    setActiveUpload(initialUploadState);

    // Launch resumable chunked upload
    const controller = VideoUploadService.uploadResumable({
      file,
      storagePath,
      bucket: 'portfolio-media',
      onProgress: (progress) => {
        setActiveUpload((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            percentage: progress.percentage,
            bytesUploaded: progress.bytesUploaded,
            bytesTotal: progress.bytesTotal,
            speedBytesPerSec: progress.speedBytesPerSec,
            etaSeconds: progress.etaSeconds,
          };
        });
      },
      onSuccess: (finalUrl) => {
        const newAsset: MediaAsset = {
          id: 'med-' + Math.random().toString(36).substring(2, 9),
          filename: file.name,
          file_type: isVideo ? 'video' : 'image',
          mime_type: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
          size_bytes: file.size,
          url: finalUrl,
          storage_path: storagePath,
          alt_text: file.name,
          resolution: videoMeta.resolution || (isVideo ? 'Original Quality' : ''),
          duration: videoMeta.duration,
          width: videoMeta.width,
          height: videoMeta.height,
          category: isVideo ? 'Videos' : 'Images',
          created_at: new Date().toISOString(),
        };

        addMedia(newAsset);
        setActiveUpload(null);
        setUploadSuccess(
          `Successfully uploaded "${file.name}" in original uncompressed quality (${formatSize(
            file.size
          )}${videoMeta.resolution ? ` · ${videoMeta.resolution}` : ''})!`
        );
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: (err) => {
        console.error('Upload failed:', err);
        setActiveUpload((prev) => (prev ? { ...prev, error: err.message } : null));
        setUploadError(err.message || 'Upload failed. Check storage credentials and bucket rules.');
      },
    });

    setActiveUpload((prev) => (prev ? { ...prev, controller } : null));
  };

  const handlePauseResume = () => {
    if (!activeUpload || !activeUpload.controller) return;
    if (activeUpload.isPaused) {
      activeUpload.controller.resume();
      setActiveUpload({ ...activeUpload, isPaused: false });
    } else {
      activeUpload.controller.pause();
      setActiveUpload({ ...activeUpload, isPaused: true });
    }
  };

  const handleCancelUpload = () => {
    if (activeUpload?.controller) {
      activeUpload.controller.cancel();
    }
    setActiveUpload(null);
    setUploadError('Upload was cancelled.');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const formatSpeed = (bytesPerSec: number) => {
    if (!bytesPerSec || bytesPerSec <= 0) return '0 KB/s';
    if (bytesPerSec < 1024 * 1024) return `${(bytesPerSec / 1024).toFixed(0)} KB/s`;
    return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
  };

  const formatEta = (seconds: number) => {
    if (!seconds || seconds <= 0 || !isFinite(seconds)) return 'Calculating...';
    if (seconds < 60) return `${seconds}s remaining`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s remaining`;
  };

  const filtered = mediaAssets.filter((a) => {
    const matchSearch =
      a.filename.toLowerCase().includes(search.toLowerCase()) ||
      (a.resolution && a.resolution.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'all' || a.file_type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            MEDIA & VIDEO ASSET LIBRARY
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Original-quality storage for 4K / HD trailers, showreels, raw clips, and project photography. Zero compression applied.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/mp4,video/webm,video/quicktime"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={Boolean(activeUpload)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#FF2027]/20"
          >
            <Upload className="w-4 h-4" />
            <span>{activeUpload ? 'UPLOADING...' : 'UPLOAD MEDIA / VIDEO'}</span>
          </button>
        </div>
      </div>

      {/* Provider Limit & Storage Status Banner */}
      <div className="p-4 bg-[#151515] border border-[#262626] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FF2027]/10 flex items-center justify-center text-[#FF2027]">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                SUPABASE STORAGE LIMIT: {storagePlan.planName}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  storagePlan.isFreeTier
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {storagePlan.isFreeTier ? 'Free Provider Limit: 50MB' : 'Large 4K / 5GB Enabled'}
              </span>
            </div>
            <p className="text-[11px] text-[#8A8A8A] mt-0.5">
              {storagePlan.isFreeTier
                ? 'Supabase Free plan enforces a strict 50MB per-file upload limit. Upgraded to Pro? Switch tier below.'
                : 'Pro/Enterprise tier active. Chunked TUS streaming allows large HD & 4K video uploads without browser memory limits.'}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowPlanSwitcher(!showPlanSwitcher)}
            className="text-xs font-mono uppercase px-3 py-1.5 rounded bg-[#202020] hover:bg-[#282828] text-[#8A8A8A] hover:text-white border border-[#303030] transition-colors cursor-pointer"
          >
            Change Plan Setting ▾
          </button>

          {showPlanSwitcher && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#181818] border border-[#333333] rounded-lg shadow-2xl p-2 z-30 space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#666666] px-2 py-1 block">
                Select Supabase Storage Plan
              </span>
              <button
                onClick={() => handlePlanChange('free')}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-colors cursor-pointer ${
                  storagePlan.planName.includes('Free')
                    ? 'bg-[#FF2027] text-white font-bold'
                    : 'text-[#8A8A8A] hover:bg-[#222222] hover:text-white'
                }`}
              >
                Free Plan (50 MB Max per file)
              </button>
              <button
                onClick={() => handlePlanChange('pro')}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-colors cursor-pointer ${
                  storagePlan.planName.includes('Pro')
                    ? 'bg-[#FF2027] text-white font-bold'
                    : 'text-[#8A8A8A] hover:bg-[#222222] hover:text-white'
                }`}
              >
                Pro Plan (5 GB Max per file)
              </button>
              <button
                onClick={() => handlePlanChange('enterprise')}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-colors cursor-pointer ${
                  storagePlan.planName.includes('Enterprise')
                    ? 'bg-[#FF2027] text-white font-bold'
                    : 'text-[#8A8A8A] hover:bg-[#222222] hover:text-white'
                }`}
              >
                Enterprise Plan (50 GB Max)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Resumable Upload Progress Bar */}
      {activeUpload && (
        <div className="p-5 bg-[#181818] border border-[#FF2027]/40 rounded-xl space-y-3 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#FF2027] animate-pulse" />
              <span className="text-xs font-bold text-white truncate max-w-md">
                Uploading &quot;{activeUpload.filename}&quot;
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-[#FF2027]">
                TUS Resumable Stream
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Pause / Resume */}
              <button
                onClick={handlePauseResume}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#252525] hover:bg-[#303030] text-xs font-mono uppercase text-white transition-colors cursor-pointer"
              >
                {activeUpload.isPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-white" />
                    <span>Pause</span>
                  </>
                )}
              </button>

              {/* Cancel */}
              <button
                onClick={handleCancelUpload}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/40 hover:bg-red-900/60 text-xs font-mono uppercase text-red-300 border border-red-800 transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full bg-[#0A0A0A] h-3 rounded-full overflow-hidden border border-[#282828] relative">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                activeUpload.isPaused ? 'bg-amber-500' : 'bg-[#FF2027]'
              }`}
              style={{ width: `${activeUpload.percentage}%` }}
            />
          </div>

          {/* Metrics: MB / Total, Speed, ETA */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8A8A8A]">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold">{activeUpload.percentage}%</span>
              <span>•</span>
              <span>
                {formatSize(activeUpload.bytesUploaded)} / {formatSize(activeUpload.bytesTotal)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#FF2027]" />
                <span>{activeUpload.isPaused ? 'Paused' : formatSpeed(activeUpload.speedBytesPerSec)}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FF2027]" />
                <span>{activeUpload.isPaused ? 'Paused' : formatEta(activeUpload.etaSeconds)}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Feedback Alerts */}
      {uploadError && (
        <div className="p-4 rounded bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#FF2027] shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="text-red-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-4 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
          <button
            onClick={() => setUploadSuccess(null)}
            className="text-emerald-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
          <input
            type="text"
            placeholder="Search media by filename, resolution (4K, 1080p)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151515] border border-[#262626] rounded pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#505050] focus:outline-none focus:border-[#FF2027]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['all', 'video', 'image'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded text-xs uppercase font-mono tracking-wider transition-colors cursor-pointer flex-1 sm:flex-initial text-center ${
                typeFilter === t
                  ? 'bg-[#FF2027] text-white font-bold'
                  : 'bg-[#151515] text-[#8A8A8A] border border-[#262626]'
              }`}
            >
              {t === 'all' ? 'All Assets' : t === 'video' ? 'Videos' : 'Images'}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className="group relative bg-[#151515] border border-[#262626] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#FF2027]/60 transition-all shadow-lg"
          >
            {/* Thumbnail / Video Preview Area */}
            <div
              onClick={() => {
                if (asset.file_type === 'video') {
                  setPreviewAsset(asset);
                }
              }}
              className="relative aspect-[16/10] bg-black overflow-hidden flex items-center justify-center cursor-pointer group/thumb"
            >
              {asset.file_type === 'video' ? (
                <div className="relative w-full h-full flex items-center justify-center bg-[#0A0A0A]">
                  <video
                    src={asset.url}
                    muted
                    preload="metadata"
                    className="w-full h-full object-cover opacity-80 group-hover/thumb:opacity-100 transition-opacity"
                  />
                  <div className="absolute w-12 h-12 rounded-full bg-[#FF2027]/90 text-white flex items-center justify-center shadow-xl group-hover/thumb:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              ) : (
                <img
                  src={asset.url}
                  alt={asset.filename}
                  className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase bg-black/80 backdrop-blur px-2 py-0.5 rounded text-white border border-white/10">
                  {asset.file_type}
                </span>
                {asset.resolution && (
                  <span className="text-[10px] font-mono uppercase bg-[#FF2027] px-2 py-0.5 rounded text-white font-bold shadow">
                    {asset.resolution}
                  </span>
                )}
              </div>

              {/* Status */}
              <div className="absolute top-2 right-2">
                <span className="text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.5 rounded">
                  Public
                </span>
              </div>
            </div>

            {/* Asset Metadata & Details */}
            <div className="p-4 space-y-2">
              <h4 className="text-sm font-bold text-white truncate" title={asset.filename}>
                {asset.filename}
              </h4>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#8A8A8A] pt-1">
                <div>
                  <span className="text-[#555555] block text-[9px] uppercase">Size</span>
                  <span className="text-white">{formatSize(asset.size_bytes)}</span>
                </div>
                <div>
                  <span className="text-[#555555] block text-[9px] uppercase">MIME Type</span>
                  <span className="text-white truncate block">{asset.mime_type || 'image/jpeg'}</span>
                </div>
                <div>
                  <span className="text-[#555555] block text-[9px] uppercase">Uploaded</span>
                  <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-[#555555] block text-[9px] uppercase">Quality</span>
                  <span className="text-emerald-400 font-bold">Original</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-3 pt-3 border-t border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {asset.file_type === 'video' && (
                    <button
                      onClick={() => setPreviewAsset(asset)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-white hover:text-[#FF2027] transition-colors cursor-pointer font-bold"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Preview</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCopyUrl(asset)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-[#8A8A8A] hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>

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

      {/* Video Preview Modal */}
      <VideoPreviewModal
        asset={previewAsset}
        isOpen={Boolean(previewAsset)}
        onClose={() => setPreviewAsset(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Media Asset"
        message="Are you sure you want to permanently remove this asset from your storage library?"
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
