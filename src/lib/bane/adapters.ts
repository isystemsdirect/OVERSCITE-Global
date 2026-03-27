// adapters.ts
import type { Context } from './context';
import type { Decision } from './decision';

export interface NetworkAdapter {
  call<T>(url: string, context: Context, decision: Decision): Promise<T>;
}

export interface CameraAdapter {
  capture<T>(settings: string, context: Context, decision: Decision): Promise<T>;
}

export interface FileAdapter {
  handle<T>(pathAndOp: string, context: Context, decision: Decision): Promise<T>;
}

export interface LidarAdapter {
  scan<T>(resolution: string, context: Context, decision: Decision): Promise<T>;
}

export interface FindingAdapter {
  review<T>(resource: string, context: Context, decision: Decision): Promise<T>;
  ingest<T>(resource: string, context: Context, decision: Decision): Promise<T>;
}

export interface ReportAdapter {
  finalize<T>(resource: string, context: Context, decision: Decision): Promise<T>;
}

export interface Adapters {
  network: NetworkAdapter;
  camera: CameraAdapter;
  file: FileAdapter;
  lidar: LidarAdapter;
  finding: FindingAdapter;
  report: ReportAdapter;
}

// Minimal implementations
export const DefaultAdapters: Adapters = {
  network: {
    async call<T>(url: string, _context: Context, _decision: Decision) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      return (await res.json()) as T;
    },
  },
  camera: {
    async capture<T>(_settings: string, _context: Context, _decision: Decision) {
      return { imageId: 'stub-image-id' } as unknown as T;
    },
  },
  file: {
    async handle<T>(pathAndOp: string, _context: Context, _decision: Decision) {
      const [op, path] = pathAndOp.split(':');
      
      // Browser-safe fallback
      if (typeof window !== 'undefined') {
        console.warn(`File operation ${op} on ${path} is not supported in the browser context.`);
        return { path, status: 'MOCK_SUCCESS' } as unknown as T;
      }

      // Server-side logic (dynamic import to avoid browser bundling)
      try {
        const fs = await import('fs/promises');
        if (op === 'write') {
          await fs.writeFile(path, '');
          return { path } as unknown as T;
        }
        if (op === 'read') {
          const content = await fs.readFile(path, 'utf8');
          return { path, content } as unknown as T;
        }
      } catch (err) {
        console.error('File operation failed', err);
        throw err;
      }
      throw new Error(`Unsupported file op: ${op}`);
    },
  },
  lidar: {
    async scan<T>(_resolution: string, _context: Context, _decision: Decision) {
      return { pointCloudId: 'stub-pc-id' } as unknown as T;
    },
  },
  finding: {
    async review<T>(_resource: string, _context: Context, _decision: Decision) {
      return { success: true } as unknown as T;
    },
    async ingest<T>(_resource: string, _context: Context, _decision: Decision) {
      return { success: true } as unknown as T;
    },
  },
  report: {
    async finalize<T>(_resource: string, _context: Context, _decision: Decision) {
      return { success: true } as unknown as T;
    },
  },
};
