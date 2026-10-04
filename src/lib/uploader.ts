import * as tus from 'tus-js-client';
import { supabase, isSupabaseConfigured } from './supabase';

export interface UploadProgressInfo {
  bytesUploaded: number;
  bytesTotal: number;
  percentage: number;
  speedMBps: number;
  estimatedSecondsRemaining: number;
  status: 'idle' | 'uploading' | 'paused' | 'completed' | 'error';
  errorMessage?: string;
}

export interface VideoMetadata {
  duration: number; // in seconds
  width: number;
  height: number;
  resolution: string; // e.g. "3840x2160 (4K UHD)"
}

// Client-side non-destructive metadata extractor
export async function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    // Default fallback if browser fails to decode metadata
    const fallback: VideoMetadata = {
      duration: 0,
      width: 1920,
      height: 1080,
      resolution: '1920x1080 (1080p)',
    };

    if (!file.type.startsWith('video/')) {
      resolve(fallback);
      return;
    }

    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      const objUrl = URL.createObjectURL(file);
      video.src = objUrl;

      const timer = setTimeout(() => {
        URL.revokeObjectURL(objUrl);
        resolve(fallback);
      }, 4000);

      video.onloadedmetadata = () => {
        clearTimeout(timer);
        URL.revokeObjectURL(objUrl);

        const width = video.videoWidth || 1920;
        const height = video.videoHeight || 1080;
        const duration = video.duration || 0;

        let resLabel = `${width}x${height}`;
        if (width >= 3840 || height >= 2160) {
          resLabel = `${width}x${height} (4K UHD)`;
        } else if (width >= 2560 || height >= 1440) {
          resLabel = `${width}x${height} (1440p QHD)`;
        } else if (width >= 1920 || height >= 1080) {
          resLabel = `${width}x${height} (1080p FHD)`;
        } else if (width >= 1280 || height >= 720) {
          resLabel = `${width}x${height} (720p HD)`;
        }

        resolve({
          duration: Math.round(duration * 10) / 10,
          width,
          height,
          resolution: resLabel,
        });
      };

      video.onerror = () => {
        clearTimeout(timer);
        URL.revokeObjectURL(objUrl);
        resolve(fallback);
      };
    } catch {
      resolve(fallback);
    }
  });
}

export class ResumableUploader {
  private file: File;
  private bucket: string;
  private path: string;
  private onProgress: (info: UploadProgressInfo) => void;
  private onComplete: (publicUrl: string) => void;
  private onError: (errorMsg: string) => void;

  private tusUpload: tus.Upload | null = null;
  private startTime: number = 0;
  private lastBytes: number = 0;
  private lastTime: number = 0;
  private status: 'idle' | 'uploading' | 'paused' | 'completed' | 'error' = 'idle';

  constructor(options: {
    file: File;
    bucket?: string;
    path: string;
    onProgress: (info: UploadProgressInfo) => void;
    onComplete: (publicUrl: string) => void;
    onError: (errorMsg: string) => void;
  }) {
    this.file = options.file;
    this.bucket = options.bucket || 'portfolio-media';
    this.path = options.path;
    this.onProgress = options.onProgress;
    this.onComplete = options.onComplete;
    this.onError = options.onError;
  }

  public async start(): Promise<void> {
    this.status = 'uploading';
    this.startTime = Date.now();
    this.lastTime = Date.now();
    this.lastBytes = 0;

    const supabaseUrl =
      import.meta.env.VITE_SUPABASE_URL ||
      (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : '') ||
      '';
    const supabaseAnonKey =
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_ANON_KEY : '') ||
      '';

    if (!isSupabaseConfigured || !supabase) {
      // Local development simulation for instant testing without remote keys
      let uploaded = 0;
      const total = this.file.size;
      const interval = setInterval(() => {
        if (this.status === 'paused') return;
        uploaded += Math.min(total - uploaded, Math.max(1024 * 512, Math.floor(total / 20)));
        const pct = Math.round((uploaded / total) * 100);

        this.onProgress({
          bytesUploaded: uploaded,
          bytesTotal: total,
          percentage: pct,
          speedMBps: 3.2,
          estimatedSecondsRemaining: Math.max(0, Math.round((total - uploaded) / (3.2 * 1024 * 1024))),
          status: 'uploading',
        });

        if (uploaded >= total) {
          clearInterval(interval);
          this.status = 'completed';
          const localUrl = URL.createObjectURL(this.file);
          this.onProgress({
            bytesUploaded: total,
            bytesTotal: total,
            percentage: 100,
            speedMBps: 0,
            estimatedSecondsRemaining: 0,
            status: 'completed',
          });
          this.onComplete(localUrl);
        }
      }, 150);
      return;
    }

    try {
      // Extract Supabase auth token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token || supabaseAnonKey;

      // Supabase Storage TUS Endpoint
      const endpoint = `${supabaseUrl}/storage/v1/upload/resumable`;

      this.tusUpload = new tus.Upload(this.file, {
        endpoint,
        retryDelays: [0, 1000, 3000, 5000],
        headers: {
          authorization: `Bearer ${token}`,
          apikey: supabaseAnonKey,
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: this.bucket,
          objectName: this.path,
          contentType: this.file.type || 'video/mp4',
          cacheControl: '3600',
        },
        chunkSize: 6 * 1024 * 1024, // 6MB chunks for reliability
        onError: (err) => {
          this.status = 'error';
          console.error('TUS upload error:', err);

          // Clear explanation if file exceeds provider limit
          let msg = err.message || 'Upload failed.';
          if (msg.includes('413') || msg.includes('Payload Too Large') || msg.includes('exceeded')) {
            msg = `Provider Limit: The file (${(this.file.size / (1024 * 1024)).toFixed(1)} MB) exceeds your Supabase Storage quota limit. Free tier projects allow files up to 50MB. Upgrade your Supabase plan to upload up to 50GB.`;
          }

          this.onProgress({
            bytesUploaded: this.lastBytes,
            bytesTotal: this.file.size,
            percentage: Math.round((this.lastBytes / this.file.size) * 100),
            speedMBps: 0,
            estimatedSecondsRemaining: 0,
            status: 'error',
            errorMessage: msg,
          });
          this.onError(msg);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const now = Date.now();
          const elapsedSec = (now - this.lastTime) / 1000;
          let speedMBps = 0;

          if (elapsedSec > 0.5) {
            const diffBytes = bytesUploaded - this.lastBytes;
            speedMBps = Math.round((diffBytes / (1024 * 1024 * elapsedSec)) * 10) / 10;
            this.lastBytes = bytesUploaded;
            this.lastTime = now;
          }

          const remainingBytes = bytesTotal - bytesUploaded;
          const estimatedSecondsRemaining =
            speedMBps > 0 ? Math.round(remainingBytes / (speedMBps * 1024 * 1024)) : 0;
          const percentage = Math.round((bytesUploaded / bytesTotal) * 100);

          this.onProgress({
            bytesUploaded,
            bytesTotal,
            percentage,
            speedMBps,
            estimatedSecondsRemaining,
            status: 'uploading',
          });
        },
        onSuccess: () => {
          this.status = 'completed';
          // Compute public URL
          let finalPublicUrl = '';
          if (supabase) {
            const { data: publicData } = supabase.storage
              .from(this.bucket)
              .getPublicUrl(this.path);
            finalPublicUrl = publicData.publicUrl;
          }

          this.onProgress({
            bytesUploaded: this.file.size,
            bytesTotal: this.file.size,
            percentage: 100,
            speedMBps: 0,
            estimatedSecondsRemaining: 0,
            status: 'completed',
          });
          this.onComplete(finalPublicUrl);
        },
      });

      this.tusUpload.start();
    } catch (e: any) {
      this.status = 'error';
      this.onError(e.message || 'Failed to initialize resumable upload.');
    }
  }

  public pause(): void {
    if (this.tusUpload) {
      this.tusUpload.abort();
      this.status = 'paused';
      this.onProgress({
        bytesUploaded: this.lastBytes,
        bytesTotal: this.file.size,
        percentage: Math.round((this.lastBytes / this.file.size) * 100),
        speedMBps: 0,
        estimatedSecondsRemaining: 0,
        status: 'paused',
      });
    }
  }

  public resume(): void {
    if (this.tusUpload) {
      this.status = 'uploading';
      this.tusUpload.start();
    }
  }

  public cancel(): void {
    if (this.tusUpload) {
      this.tusUpload.abort();
    }
    this.status = 'idle';
  }
}
