/**
 * Resume Service - Centralized API calls for resume management
 */

import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export interface UploadRequest {
  file: File;
}

export interface UploadResponse {
  success: boolean;
  data?: {
    sections: any;
    originalText: string;
    originalDocument: {
      fileName: string;
      filePath: string;
      fileType: string;
      uploadDate: string;
    };
  };
  error?: string;
}

export interface ResumeData {
  sections: {
    personalSummary?: string;
    workExperience?: any[];
    projects?: any[];
    education?: any[];
    skills?: string[];
    [key: string]: any;
  };
  originalText: string;
  companyName?: string;
  originalDocument?: {
    fileName: string;
    filePath: string;
    fileType: string;
    uploadDate: string;
  };
}

class ResumeService {
  private static instance: ResumeService;

  public static getInstance(): ResumeService {
    if (!ResumeService.instance) {
      ResumeService.instance = new ResumeService();
    }
    return ResumeService.instance;
  }

  /**
   * Upload resume file
   */
  async uploadResume(file: File): Promise<UploadResponse> {
    try {
      console.log('📤 Uploading resume file:', file.name);
      
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword', // .doc
        'application/pdf' // .pdf
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid file (.docx, .doc, or .pdf)');
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post<UploadResponse>(API_ENDPOINTS.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to upload file. Please try again.'
      );
    }
  }

  /**
   * Load resume data from session storage
   */
  loadResumeFromStorage(): ResumeData | null {
    try {
      const storedData = sessionStorage.getItem('resumeData');
      if (!storedData) return null;

      const parsedData = JSON.parse(storedData);
      console.log('📋 Loaded resume data from storage:', parsedData);
      
      // Validate and normalize the data structure
      const normalizedData: ResumeData = {
        sections: {
          personalSummary: parsedData.sections?.personalSummary || parsedData.personalSummary || '',
          workExperience: parsedData.sections?.workExperience || parsedData.workExperience || [],
          projects: parsedData.sections?.projects || parsedData.projects || [],
          education: parsedData.sections?.education || parsedData.education || [],
          skills: parsedData.sections?.skills || parsedData.skills || [],
          ...parsedData.sections // Include any dynamic sections
        },
        originalText: parsedData.originalText || '',
        companyName: parsedData.companyName,
        originalDocument: parsedData.originalDocument
      };

      console.log('📋 Normalized resume data:', normalizedData);
      return normalizedData;
    } catch (error) {
      console.error('❌ Error parsing resume data from storage:', error);
      return null;
    }
  }

  /**
   * Save resume data to session storage
   */
  saveResumeToStorage(resumeData: ResumeData): void {
    try {
      sessionStorage.setItem('resumeData', JSON.stringify(resumeData));
      console.log('💾 Resume data saved to storage');
    } catch (error) {
      console.error('❌ Error saving resume data to storage:', error);
    }
  }

  /**
   * Clear resume data from session storage
   */
  clearResumeFromStorage(): void {
    try {
      sessionStorage.removeItem('resumeData');
      console.log('🗑️ Resume data cleared from storage');
    } catch (error) {
      console.error('❌ Error clearing resume data from storage:', error);
    }
  }

  /**
   * Update a specific section in resume data
   */
  updateSection(resumeData: ResumeData, sectionType: string, data: any): ResumeData {
    return {
      ...resumeData,
      sections: {
        ...resumeData.sections,
        [sectionType]: data
      }
    };
  }

  /**
   * Update a dynamic section in resume data
   */
  updateDynamicSection(resumeData: ResumeData, sectionName: string, content: any): ResumeData {
    return {
      ...resumeData,
      sections: {
        ...resumeData.sections,
        [sectionName]: content
      }
    };
  }

  /**
   * Validate resume data structure
   */
  validateResumeData(data: any): { isValid: boolean; error?: string } {
    if (!data) {
      return { isValid: false, error: 'Resume data is required' };
    }

    if (!data.sections) {
      return { isValid: false, error: 'Resume sections are required' };
    }

    if (typeof data.sections !== 'object') {
      return { isValid: false, error: 'Resume sections must be an object' };
    }

    return { isValid: true };
  }

  /**
   * Get resume preview text
   */
  getResumePreview(sections: any): string {
    const preview = [];
    if (sections.personalSummary) preview.push('Summary');
    if (sections.workExperience?.length) preview.push(`${sections.workExperience.length} Experience${sections.workExperience.length > 1 ? 's' : ''}`);
    if (sections.projects?.length) preview.push(`${sections.projects.length} Project${sections.projects.length > 1 ? 's' : ''}`);
    if (sections.education?.length) preview.push(`${sections.education.length} Education`);
    if (sections.skills?.length) preview.push(`${sections.skills.length} Skills`);
    return preview.slice(0, 4).join(' • ');
  }

  /**
   * Get resume highlights (job titles, skills, etc.)
   */
  getResumeHighlights(sections: any): string[] {
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

  /**
   * Check if resume data exists in storage
   */
  hasResumeInStorage(): boolean {
    return sessionStorage.getItem('resumeData') !== null;
  }

  /**
   * Get file type from file name
   */
  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'doc':
        return 'application/msword';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default ResumeService.getInstance();
