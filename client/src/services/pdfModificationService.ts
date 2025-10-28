/**
 * PDF Modification Service
 * Client-side service for PDF file modification
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5001';

export interface PDFModificationRequest {
  pdfFile: File;
  originalText: string;
  newText: string;
}

export interface PDFModificationResponse {
  success: boolean;
  outputPath?: string;
  changes?: {
    originalText: string;
    newText: string;
  };
  error?: string;
}

export interface TextExtractionResponse {
  success: boolean;
  data?: {
    text: string;
  };
  error?: string;
}

export interface TextValidationResponse {
  success: boolean;
  data?: {
    exists: boolean;
  };
  error?: string;
}

export class PDFModificationService {
  /**
   * Modify text in a PDF file
   */
  public static async modifyPDF(request: PDFModificationRequest): Promise<PDFModificationResponse> {
    const formData = new FormData();
    formData.append('pdfFile', request.pdfFile);
    formData.append('originalText', request.originalText);
    formData.append('newText', request.newText);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/pdf/modify`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob', // Important for downloading files
        }
      );

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `modified_${request.pdfFile.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error: any) {
      console.error('Error modifying PDF:', error);
      // Attempt to parse error message from blob if available
      if (error.response && error.response.data instanceof Blob) {
        const errorText = await error.response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          return { success: false, error: errorJson.error || 'Failed to modify PDF' };
        } catch (parseError) {
          return { success: false, error: errorText || 'Failed to modify PDF' };
        }
      }
      return { success: false, error: error.message || 'Failed to modify PDF' };
    }
  }

  /**
   * Extract text from PDF file
   */
  public static async extractText(filePath: string): Promise<TextExtractionResponse> {
    try {
      const response = await axios.post<TextExtractionResponse>(
        `${API_BASE_URL}/api/pdf/extract-text`,
        { filePath }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error extracting text from PDF:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Failed to extract text from PDF' 
      };
    }
  }

  /**
   * Validate if text exists in PDF file
   */
  public static async validateText(filePath: string, text: string): Promise<TextValidationResponse> {
    try {
      const response = await axios.post<TextValidationResponse>(
        `${API_BASE_URL}/api/pdf/validate-text`,
        { filePath, text }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error validating text in PDF:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Failed to validate text in PDF' 
      };
    }
  }
}
