import * as tus from 'tus-js-client';
import { supabase, isSupabaseConfigured } from './supabase';

export interface StoragePlanInfo {
  maxSizeBytes: number;
  planName: 'Free Plan (50 MB)' | 'Pro Plan (5 GB)' | 'Enterprise (50 GB)' | 'Custom Limit';
  isFreeTier: boolean;
  bucketLimitBytes: number | null;
  source: 'detected_bucket' | 'user_override' | 'default';
}

const STORAGE_PLAN_KEY = 'ranjan_cms_storage_plan_override';

export class VideoUploadService {
  /**
   * Detects real Supabase Storage upload limit or returns configured plan.
   * Free plan default in Supabase is 50MB per file.
   * Pro plan is 5GB per file.
   */
  static async detectStoragePlan(): Promise<StoragePlanInfo> {
    const savedOverride = localStorage.getItem(STORAGE_PLAN_KEY);

    let bucketLimit: number | null = null;
    let detectedFromBucket = false;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.storage.getBucket('portfolio-media');
        if (!error && data) {
          if (data.file_size_limit && typeof data.file_size_limit === 'number' && data.file_size_limit > 0) {
            bucketLimit = data.file_size_limit;
            detectedFromBucket = true;
          }
        }
      } catch (e) {
        console.warn('Could not inspect Supabase bucket configuration:', e);
      }
    }

    if (savedOverride) {
      try {
        const parsed = JSON.parse(savedOverride);
        return {
          ...parsed,
          bucketLimitBytes: bucketLimit,
          source: 'user_override',
        };
      } catch (e) {}
    }

    if (detectedFromBucket && bucketLimit) {
      const is50MB = bucketLimit <= 52428800;
      return {
        maxSizeBytes: bucketLimit,
        planName: is50MB ? 'Free Plan (50 MB)' : 'Pro Plan (5 GB)',
        isFreeTier: is50MB,
        bucketLimitBytes: bucketLimit,
        source: 'detected_bucket',
      };
    }

    // Default Supabase free tier is 50 MB
    return {
      maxSizeBytes: 50 * 1024 * 1024,
      planName: 'Free Plan (50 MB)',
      isFreeTier: true,
      bucketLimitBytes: bucketLimit,
      source: 'default',
    };
  }

  static setStoragePlanOverride(plan: 'free' | 'pro' | 'enterprise') {
    let info: StoragePlanInfo;
    if (plan === 'pro') {
      info = {
        maxSizeBytes: 5 * 1024 * 1024 * 1024, // 5 GB
        planName: 'Pro Plan (5 GB)',
        isFreeTier: false,
        bucketLimitBytes: 5 * 1024 * 1024 * 1024,
        source: 'user_override',
      };
    } else if (plan === 'enterprise') {
      info = {
        maxSizeBytes: 50 * 1024 * 1024 * 1024, // 50 GB
        planName: 'Enterprise (50 GB)',
        isFreeTier: false,
        bucketLimitBytes: 50 * 1024 * 1024 * 1024,
        source: 'user_override',
      };
    } else {
      info = {
        maxSizeBytes: 50 * 1024 * 1024, // 50 MB
        planName: 'Free Plan (50 MB)',
        isFreeTier: true,
        bucketLimitBytes: 50 * 1024 * 1024,
        source: 'user_override',
      };
    }
    localStorage.setItem(STORAGE_PLAN_KEY, JSON.stringify(info));
    return info;
  }

  /**
   * Extract video resolution, dimensions, and duration from video file before upload
   * (Does NOT modify or compress the video file!).
   */
  static extractVideoMetadata(file: File): Promise<{
    width: number;
    height: number;
    duration: number;
    resolution: string;
  }> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const cleanup = () => {
        URL.revokeObjectURL(url);
        video.remove();
      };

      video.onloadedmetadata = () => {
        const width = video.videoWidth || 0;
        const height = video.videoHeight || 0;
        const duration = Math.round(video.duration || 0);

        let resolution = `${width}x${height}`;
        if (width >= 3840 || height >= 2160) {
          resolution = `${width}x${height} (4K UHD)`;
        } else if (width >= 2560 || height >= 1440) {
          resolution = `${width}x${height} (1440p QHD)`;
        } else if (width >= 1920 || height >= 1080) {
          resolution = `${width}x${height} (1080p FHD)`;
        } else if (width >= 1280 || height >= 720) {
          resolution = `${width}x${height} (720p HD)`;
        }

        cleanup();
        resolve({ width, height, duration, resolution });
      };

      video.onerror = () => {
        cleanup();
        resolve({ width: 0, height: 0, duration: 0, resolution: 'Original' });
      };

      video.src = url;
    });
  }

  /**
   * Resumable chunked upload using TUS protocol for Supabase Storage.
   * Streams large files in chunks without reading the entire file into memory!
   */
  static uploadResumable({
    file,
    storagePath,
    bucket = 'portfolio-media',
    onProgress,
    onSuccess,
    onError,
  }: {
    file: File;
    storagePath: string;
    bucket?: string;
    onProgress: (info: {
      percentage: number;
      bytesUploaded: number;
      bytesTotal: number;
      speedBytesPerSec: number;
      etaSeconds: number;
    }) => void;
    onSuccess: (publicUrl: string) => void;
    onError: (error: Error) => void;
  }) {
    const supabaseUrl =
      import.meta.env.VITE_SUPABASE_URL ||
      (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : '') ||
      '';
    const supabaseAnonKey =
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_ANON_KEY : '') ||
      '';

    let lastTime = Date.now();
    let lastBytes = 0;
    let speed = 0;

    // Supabase resumable upload endpoint: ${supabaseUrl}/storage/v1/upload/resumable
    const endpoint = `${supabaseUrl}/storage/v1/upload/resumable`;

    let activeUpload: tus.Upload | null = null;
    let isPaused = false;

    // Get current session token if available
    let authToken = supabaseAnonKey;
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.access_token) {
          authToken = data.session.access_token;
        }
        initiateTus();
      }).catch(() => {
        initiateTus();
      });
    } else {
      initiateTus();
    }

    function initiateTus() {
      if (!isSupabaseConfigured || !supabaseUrl) {
        // Fallback for demo / preview environment when Supabase is not configured
        simulateProgressUpload();
        return;
      }

      try {
        activeUpload = new tus.Upload(file, {
          endpoint,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          chunkSize: 6 * 1024 * 1024, // 6MB chunks recommended by Supabase
          headers: {
            Authorization: `Bearer ${authToken}`,
            apikey: supabaseAnonKey,
            'x-upsert': 'true',
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName: bucket,
            objectName: storagePath,
            contentType: file.type || 'video/mp4',
            cacheControl: '3600',
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const now = Date.now();
            const timeDelta = (now - lastTime) / 1000;
            if (timeDelta >= 0.5) {
              const bytesDelta = bytesUploaded - lastBytes;
              speed = Math.max(0, bytesDelta / timeDelta);
              lastBytes = bytesUploaded;
              lastTime = now;
            }

            const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
            const remainingBytes = bytesTotal - bytesUploaded;
            const etaSeconds = speed > 0 ? Math.round(remainingBytes / speed) : 0;

            onProgress({
              percentage,
              bytesUploaded,
              bytesTotal,
              speedBytesPerSec: speed,
              etaSeconds,
            });
          },
          onSuccess: () => {
            const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`;
            onSuccess(publicUrl);
          },
          onError: (error) => {
            console.error('TUS upload error:', error);
            // Check for standard 413 Payload Too Large
            const msg = error.message || '';
            if (msg.includes('413') || msg.toLowerCase().includes('payload too large') || msg.toLowerCase().includes('entity too large')) {
              onError(
                new Error(
                  `Upload blocked by Supabase Storage limit: Free tier maximum is 50MB. Upgrade project to Pro for 5GB support, or adjust plan in Admin.`
                )
              );
            } else {
              onError(error);
            }
          },
        });

        // Check if there are previous uploads to resume
        activeUpload.findPreviousUploads().then((previousUploads) => {
          if (previousUploads.length > 0) {
            activeUpload?.resumeFromPreviousUpload(previousUploads[0]);
          }
          activeUpload?.start();
        });
      } catch (err: any) {
        console.error('Failed to initialize TUS upload, falling back to standard upload:', err);
        fallbackStandardUpload();
      }
    }

    async function fallbackStandardUpload() {
      if (!supabase) return;
      try {
        const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

        if (error) throw error;

        const { data: pData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
        onProgress({
          percentage: 100,
          bytesUploaded: file.size,
          bytesTotal: file.size,
          speedBytesPerSec: 0,
          etaSeconds: 0,
        });
        onSuccess(pData.publicUrl);
      } catch (err: any) {
        onError(err);
      }
    }

    function simulateProgressUpload() {
      let progress = 0;
      const total = file.size;
      const interval = setInterval(() => {
        if (isPaused) return;
        progress += Math.round(total / 25);
        if (progress >= total) {
          clearInterval(interval);
          onProgress({
            percentage: 100,
            bytesUploaded: total,
            bytesTotal: total,
            speedBytesPerSec: 0,
            etaSeconds: 0,
          });
          const localUrl = URL.createObjectURL(file);
          onSuccess(localUrl);
        } else {
          onProgress({
            percentage: Math.round((progress / total) * 100),
            bytesUploaded: progress,
            bytesTotal: total,
            speedBytesPerSec: 1024 * 1024 * 4,
            etaSeconds: Math.round((total - progress) / (1024 * 1024 * 4)),
          });
        }
      }, 200);
    }

    return {
      pause: () => {
        isPaused = true;
        if (activeUpload) {
          activeUpload.abort();
        }
      },
      resume: () => {
        isPaused = false;
        if (activeUpload) {
          activeUpload.start();
        }
      },
      cancel: () => {
        isPaused = true;
        if (activeUpload) {
          activeUpload.abort();
        }
      },
    };
  }
}
