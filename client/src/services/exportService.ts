/**
 * Export Service - Centralized API calls for resume export functionality
 */

import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export type ExportFormat = 'word' | 'pdf';

export interface ExportRequest {
  sections: any;
  companyName: string;
  originalDocument?: any;
}

export interface ExportResponse {
  success: boolean;
  data?: Blob;
  error?: string;
}

class ExportService {
  private static instance: ExportService;

  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  /**
   * Export resume to specified format
   */
  async exportResume(format: ExportFormat, request: ExportRequest): Promise<void> {
    try {
      console.log(`📄 Exporting resume as ${format.toUpperCase()}...`);
      
      const endpoint = format === 'word' ? API_ENDPOINTS.EXPORT_WORD : API_ENDPOINTS.EXPORT_PDF;
      
      const response = await axios.post(endpoint, {
        sections: request.sections,
        companyName: request.companyName.trim(),
        originalDocument: request.originalDocument
      }, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = this.generateFileName(request.companyName, format);
      link.setAttribute('download', fileName);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      console.log(`✅ Resume exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      console.error(`❌ Error exporting ${format.toUpperCase()}:`, error);
      throw new Error(`Failed to export ${format.toUpperCase()}. Please try again.`);
    }
  }

  /**
   * Export version to specified format
   */
  async exportVersion(format: ExportFormat, version: any): Promise<void> {
    try {
      console.log(`📄 Exporting version as ${format.toUpperCase()}...`);
      
      const request: ExportRequest = {
        sections: version.sections,
        companyName: version.companyName,
        originalDocument: version.originalDocument
      };

      await this.exportResume(format, request);
    } catch (error) {
      console.error(`❌ Error exporting version as ${format.toUpperCase()}:`, error);
      throw error;
    }
  }

  /**
   * Generate file name for export
   */
  private generateFileName(companyName: string, format: ExportFormat): string {
    const sanitizedName = companyName.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_');
    const extension = format === 'word' ? 'docx' : 'pdf';
    return `Resume_${sanitizedName}.${extension}`;
  }

  /**
   * Validate export request
   */
  validateExportRequest(request: ExportRequest): { isValid: boolean; error?: string } {
    if (!request.sections) {
      return { isValid: false, error: 'Resume sections are required for export' };
    }

    if (!request.companyName || !request.companyName.trim()) {
      return { isValid: false, error: 'Company name is required for export' };
    }

    if (typeof request.sections !== 'object') {
      return { isValid: false, error: 'Resume sections must be an object' };
    }

    return { isValid: true };
  }

  /**
   * Get supported export formats
   */
  getSupportedFormats(): { format: ExportFormat; label: string; icon: string }[] {
    return [
      { format: 'pdf', label: 'PDF', icon: '📄' },
      { format: 'word', label: 'Word', icon: '📝' }
    ];
  }

  /**
   * Get format-specific MIME type
   */
  getMimeType(format: ExportFormat): string {
    switch (format) {
      case 'pdf':
        return 'application/pdf';
      case 'word':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return 'application/octet-stream';
    }
  }

  /**
   * Check if format is supported
   */
  isFormatSupported(format: string): format is ExportFormat {
    return format === 'pdf' || format === 'word';
  }

  /**
   * Get export status message
   */
  getExportStatusMessage(format: ExportFormat, isExporting: boolean): string {
    if (isExporting) {
      return `Exporting as ${format.toUpperCase()}...`;
    }
    return `Export as ${format.toUpperCase()}`;
  }

  /**
   * Simulate export progress (for UI feedback)
   */
  simulateExportProgress(): Promise<void> {
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
}

export default ExportService.getInstance();
