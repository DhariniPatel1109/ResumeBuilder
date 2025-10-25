import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SavedVersion, ResumeSection } from '../types';

export class VersionManager {
  private static readonly VERSIONS_DIR = path.join(__dirname, '../../versions');

  /**
   * Ensure versions directory exists
   */
  static async ensureVersionsDir(): Promise<void> {
    await fs.ensureDir(this.VERSIONS_DIR);
  }

  /**
   * Save a resume version
   */
  static async saveVersion(companyName: string, sections: ResumeSection): Promise<string> {
    await this.ensureVersionsDir();
    
    const versionId = uuidv4();
    const versionData: SavedVersion = {
      id: versionId,
      companyName,
      sections,
      createdAt: new Date().toISOString()
    };

    const versionPath = path.join(this.VERSIONS_DIR, `${companyName.replace(/\s+/g, '_')}_${versionId}.json`);
    await fs.writeJson(versionPath, versionData);

    return versionId;
  }

  /**
   * Get all saved versions
   */
  static async getAllVersions(): Promise<SavedVersion[]> {
    await this.ensureVersionsDir();
    
    const files = await fs.readdir(this.VERSIONS_DIR);
    const versions: SavedVersion[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const versionPath = path.join(this.VERSIONS_DIR, file);
        const versionData = await fs.readJson(versionPath);
        versions.push(versionData);
      }
    }

    return versions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get a specific version by ID
   */
  static async getVersion(versionId: string): Promise<SavedVersion | null> {
    await this.ensureVersionsDir();
    
    const files = await fs.readdir(this.VERSIONS_DIR);
    
    for (const file of files) {
      if (file.includes(versionId)) {
        const versionPath = path.join(this.VERSIONS_DIR, file);
        return await fs.readJson(versionPath);
      }
    }

    return null;
  }

  /**
   * Delete a version
   */
  static async deleteVersion(versionId: string): Promise<boolean> {
    await this.ensureVersionsDir();
    
    const files = await fs.readdir(this.VERSIONS_DIR);
    
    for (const file of files) {
      if (file.includes(versionId)) {
        const versionPath = path.join(this.VERSIONS_DIR, file);
        await fs.remove(versionPath);
        return true;
      }
    }

    return false;
  }
}
