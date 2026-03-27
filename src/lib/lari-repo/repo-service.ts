// src/lib/lari-repo/repo-service.ts
import { RepoFile, ArtifactType } from './types';

export class RepoService {
  private files: RepoFile[] = [];

  constructor() {
    // Mock initial data if needed, or fetch from storage
  }

  async listFiles(filters: {
    jobId?: string;
    type?: ArtifactType;
    reviewStatus?: string;
  }): Promise<RepoFile[]> {
    return this.files.filter(f => {
      if (filters.jobId && f.jobId !== filters.jobId) return false;
      if (filters.type && f.type !== filters.type) return false;
      if (filters.reviewStatus && f.reviewStatus !== filters.reviewStatus) return false;
      return true;
    });
  }

  async getFile(id: string): Promise<RepoFile | undefined> {
    return this.files.find(f => f.id === id);
  }

  async fileArtifact(file: RepoFile): Promise<void> {
    this.files.push(file);
    // Persist to storage
  }
}

export const repoService = new RepoService();
