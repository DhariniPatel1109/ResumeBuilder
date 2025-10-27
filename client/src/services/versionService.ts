/**
 * Version Service - Centralized API calls for version management
 */

import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export interface Version {
  id: string;
  companyName: string;
  sections: any;
  createdAt: string;
  originalDocument?: {
    fileName: string;
    filePath: string;
    fileType: string;
    uploadDate: string;
  };
}

export interface SaveVersionRequest {
  companyName: string;
  sections: any;
  originalDocument?: any;
}

export interface SaveVersionResponse {
  success: boolean;
  data?: {
    id: string;
    message: string;
  };
  error?: string;
}

export interface GetVersionsResponse {
  success: boolean;
  data?: {
    versions: Version[];
  };
  versions?: Version[];
  error?: string;
}

class VersionService {
  private static instance: VersionService;

  public static getInstance(): VersionService {
    if (!VersionService.instance) {
      VersionService.instance = new VersionService();
    }
    return VersionService.instance;
  }

  /**
   * Get all saved versions
   */
  async getVersions(): Promise<Version[]> {
    try {
      console.log('📋 Fetching versions...');
      
      const response = await axios.get<GetVersionsResponse>(API_ENDPOINTS.GET_VERSIONS);
      console.log('📋 API Response:', response.data);
      
      // Handle different response structures
      if (response.data.success && response.data.data && response.data.data.versions) {
        return response.data.data.versions;
      } else if (Array.isArray(response.data.versions)) {
        return response.data.versions;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Unexpected API response structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching versions:', error);
      throw new Error('Failed to load saved versions');
    }
  }

  /**
   * Save a new version
   */
  async saveVersion(request: SaveVersionRequest): Promise<SaveVersionResponse> {
    try {
      console.log('💾 Saving version for company:', request.companyName);
      
      const response = await axios.post<SaveVersionResponse>(API_ENDPOINTS.SAVE_VERSION, {
        companyName: request.companyName.trim(),
        sections: request.sections,
        originalDocument: request.originalDocument
      });

      if (response.data.success) {
        console.log('✅ Version saved successfully:', response.data);
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to save version');
      }
    } catch (error) {
      console.error('❌ Error saving version:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to save version. Please try again.'
      );
    }
  }

  /**
   * Delete a version
   */
  async deleteVersion(versionId: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting version:', versionId);
      
      await axios.delete(`${API_ENDPOINTS.DELETE_VERSION}/${versionId}`);
      console.log('✅ Version deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting version:', error);
      throw new Error('Failed to delete version. Please try again.');
    }
  }

  /**
   * Load a version for editing
   */
  loadVersionForEditing(version: Version): any {
    try {
      console.log('📝 Loading version for editing:', version);
      
      // Create resume data object with the version's sections
      const resumeData = {
        sections: version.sections,
        originalText: '', // We don't store original text in versions
        companyName: version.companyName,
        originalDocument: version.originalDocument
      };
      
      // Store in sessionStorage for the editor
      sessionStorage.setItem('resumeData', JSON.stringify(resumeData));
      
      return resumeData;
    } catch (error) {
      console.error('❌ Error loading version:', error);
      throw new Error('Failed to load version. Please try again.');
    }
  }

  /**
   * Get version statistics
   */
  getVersionStats(versions: Version[]): {
    totalVersions: number;
    thisWeek: number;
    thisMonth: number;
  } {
    const totalVersions = versions.length;
    
    const thisWeek = versions.filter(v => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(v.createdAt) > weekAgo;
    }).length;
    
    const thisMonth = versions.filter(v => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return new Date(v.createdAt) > monthAgo;
    }).length;
    
    return { totalVersions, thisWeek, thisMonth };
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get relative time (e.g., "2h ago", "3d ago")
   */
  getRelativeTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return this.formatDate(dateString);
  }

  /**
   * Get version preview text
   */
  getVersionPreview(sections: any): string {
    const preview = [];
    if (sections.personalSummary) preview.push('Summary');
    if (sections.workExperience?.length) preview.push(`${sections.workExperience.length} Experience${sections.workExperience.length > 1 ? 's' : ''}`);
    if (sections.projects?.length) preview.push(`${sections.projects.length} Project${sections.projects.length > 1 ? 's' : ''}`);
    if (sections.education?.length) preview.push(`${sections.education.length} Education`);
    if (sections.skills?.length) preview.push(`${sections.skills.length} Skills`);
    return preview.slice(0, 4).join(' • ');
  }

  /**
   * Get version highlights (job titles, skills, etc.)
   */
  getVersionHighlights(sections: any): string[] {
    const highlights = [];
    if (sections.workExperience?.length > 0) {
      const latestExp = sections.workExperience[0];
      if (latestExp.title) highlights.push(latestExp.title);
    }
    if (sections.skills?.length > 0) {
      highlights.push(sections.skills.slice(0, 3).join(', '));
    }
    return highlights.slice(0, 2);
  }
}

export default VersionService.getInstance();
