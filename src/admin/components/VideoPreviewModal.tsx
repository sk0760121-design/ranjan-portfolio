import React, { useState, useRef, useEffect } from 'react';
import { MediaAsset } from '../../types/database';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Copy,
  Check,
  Film,
  ExternalLink,
  Info,
} from 'lucide-react';

interface VideoPreviewModalProps {
  asset: MediaAsset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  asset,
  isOpen,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSpecs, setShowSpecs] = useState(true);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [isOpen, asset]);

  if (!isOpen || !asset) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pos * (duration || 1);
    setCurrentTime(videoRef.current.currentTime);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVol: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = newVol;
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const changeRate = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-4 bg-[#181818] border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF2027]/10 flex items-center justify-center text-[#FF2027]">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-md">
                {asset.filename}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/60 text-[#FF2027] border border-[#FF2027]/30">
                  {asset.resolution || 'Original Quality'}
                </span>
                <span className="text-[10px] font-mono text-[#8A8A8A]">
                  Uncompressed Source
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSpecs(!showSpecs)}
              className={`p-2 rounded text-xs transition-colors cursor-pointer ${
                showSpecs ? 'bg-[#FF2027]/20 text-[#FF2027]' : 'text-[#8A8A8A] hover:text-white'
              }`}
              title="Toggle Technical Specs"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded text-[#8A8A8A] hover:text-white hover:bg-[#262626] transition-colors cursor-pointer"
              title="Copy Asset URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded text-[#8A8A8A] hover:text-white hover:bg-[#262626] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Display */}
        <div className="relative bg-black flex-grow flex items-center justify-center overflow-hidden min-h-[320px]">
          <video
            ref={videoRef}
            src={asset.url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onLoadedMetadata={handleTimeUpdate}
            loop={isLooping}
            playsInline
            preload="auto"
            onClick={togglePlay}
            className="w-full h-full max-h-[58vh] object-contain cursor-pointer"
          />

          {/* Centered big play button when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute w-16 h-16 rounded-full bg-[#FF2027]/90 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform cursor-pointer"
            >
              <Play className="w-8 h-8 fill-white ml-1" />
            </button>
          )}

          {/* Quality Badge Top Right */}
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-white/10 rounded px-2.5 py-1 text-[11px] font-mono text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{asset.resolution || 'Original Quality'}</span>
          </div>
        </div>

        {/* Custom Video Controls Bar */}
        <div className="bg-[#151515] border-t border-[#262626] px-4 py-3 space-y-2">
          {/* Timeline Seeking Scrubber */}
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="relative w-full h-2 bg-[#262626] rounded-full overflow-hidden cursor-pointer group"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#FF2027] transition-all rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Buttons & Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-1.5 rounded text-white hover:text-[#FF2027] transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              {/* Time display */}
              <div className="text-xs font-mono text-[#8A8A8A] flex items-center gap-1">
                <span className="text-white font-bold">{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration || asset.duration || 0)}</span>
              </div>

              {/* Volume & Mute */}
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={toggleMute}
                  className="p-1 rounded text-[#8A8A8A] hover:text-white cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 accent-[#FF2027] h-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Playback rate */}
              <div className="flex items-center gap-1 bg-[#0A0A0A] border border-[#262626] rounded p-0.5">
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => changeRate(rate)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                      playbackRate === rate
                        ? 'bg-[#FF2027] text-white font-bold'
                        : 'text-[#8A8A8A] hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Loop toggle */}
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-1.5 rounded text-xs font-mono uppercase cursor-pointer transition-colors ${
                  isLooping ? 'bg-[#FF2027]/20 text-[#FF2027]' : 'text-[#8A8A8A] hover:text-white'
                }`}
                title={isLooping ? 'Loop is On' : 'Loop is Off'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded text-[#8A8A8A] hover:text-white transition-colors cursor-pointer"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Technical Specs Drawer */}
        {showSpecs && (
          <div className="bg-[#0D0D0D] border-t border-[#262626] px-5 py-3.5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono">
            <div>
              <span className="text-[10px] uppercase text-[#666666] block">Resolution</span>
              <span className="text-white font-bold">{asset.resolution || 'Auto / Original'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#666666] block">File Size</span>
              <span className="text-white font-bold">{formatSize(asset.size_bytes)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#666666] block">MIME Type</span>
              <span className="text-white">{asset.mime_type || 'video/mp4'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#666666] block">Duration</span>
              <span className="text-white">{formatTime(duration || asset.duration || 0)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#666666] block">Storage Status</span>
              <span className="text-emerald-400 font-bold">Public (Original)</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#666666] block">Storage Path</span>
              <span className="text-[#8A8A8A] truncate block" title={asset.storage_path}>
                {asset.storage_path}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
