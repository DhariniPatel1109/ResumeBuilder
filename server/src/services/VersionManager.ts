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
   * Save a resume version (update existing or create new)
   */
  static async saveVersion(companyName: string, sections: ResumeSection): Promise<string> {
    await this.ensureVersionsDir();
    
    // Check if a version with this company name already exists
    const existingVersion = await this.findVersionByCompanyName(companyName);
    
    let versionId: string;
    let versionData: SavedVersion;
    
    if (existingVersion) {
      // Update existing version
      versionId = existingVersion.id;
      versionData = {
        ...existingVersion,
        sections,
        updatedAt: new Date().toISOString()
      };
      
      // Remove the old file
      const oldVersionPath = path.join(this.VERSIONS_DIR, `${companyName.replace(/\s+/g, '_')}_${versionId}.json`);
      if (await fs.pathExists(oldVersionPath)) {
        await fs.remove(oldVersionPath);
      }
    } else {
      // Create new version
      versionId = uuidv4();
      versionData = {
        id: versionId,
        companyName,
        sections,
        createdAt: new Date().toISOString()
      };
    }

    const versionPath = path.join(this.VERSIONS_DIR, `${companyName.replace(/\s+/g, '_')}_${versionId}.json`);
    await fs.writeJson(versionPath, versionData);

    return versionId;
  }

  /**
   * Find a version by company name
   */
  static async findVersionByCompanyName(companyName: string): Promise<SavedVersion | null> {
    await this.ensureVersionsDir();
    
    const files = await fs.readdir(this.VERSIONS_DIR);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const versionPath = path.join(this.VERSIONS_DIR, file);
        const versionData = await fs.readJson(versionPath);
        
        if (versionData.companyName === companyName) {
          return versionData;
        }
      }
    }
    
    return null;
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
   * Update a version's company name
   */
  static async updateVersionCompanyName(versionId: string, newCompanyName: string): Promise<boolean> {
    await this.ensureVersionsDir();
    
    try {
      // Find the version file
      const files = await fs.readdir(this.VERSIONS_DIR);
      let versionFile: string | null = null;
      
      for (const file of files) {
        if (file.endsWith('.json') && file.includes(versionId)) {
          versionFile = file;
          break;
        }
      }
      
      if (!versionFile) {
        return false;
      }
      
      const versionPath = path.join(this.VERSIONS_DIR, versionFile);
      const versionData = await fs.readJson(versionPath);
      
      // Update the company name
      const oldCompanyName = versionData.companyName;
      versionData.companyName = newCompanyName;
      versionData.updatedAt = new Date().toISOString();
      
      // Remove the old file
      await fs.remove(versionPath);
      
      // Create new file with updated name
      const newVersionPath = path.join(this.VERSIONS_DIR, `${newCompanyName.replace(/\s+/g, '_')}_${versionId}.json`);
      await fs.writeJson(newVersionPath, versionData);
      
      return true;
    } catch (error) {
      console.error('Error updating version company name:', error);
      return false;
    }
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
