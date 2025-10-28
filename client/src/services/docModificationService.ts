/**
 * DOC Modification Service - Client Side
 * Handles API calls for modifying DOC files
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export interface DocModificationRequest {
  filePath: string;
  originalSentence: string;
  newSentence: string;
  outputPath?: string;
}

export interface DocModificationResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    outputPath?: string;
    changes?: {
      originalSentence: string;
      newSentence: string;
      paragraphText?: string;
    };
  };
}

export interface TextExtractionResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    text: string;
  };
}

export interface SentenceValidationResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    exists: boolean;
  };
}

export class DocModificationService {
  /**
   * Modify a sentence in a DOC file
   */
  static async modifySentence(request: DocModificationRequest): Promise<DocModificationResponse> {
    try {
      console.log('🔄 Modifying DOC file...', {
        filePath: request.filePath,
        originalSentence: request.originalSentence.substring(0, 50) + '...',
        newSentence: request.newSentence.substring(0, 50) + '...'
      });

      const response = await axios.post(`${API_BASE_URL}/api/doc/modify`, request);
      
      console.log('✅ DOC modification successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ DOC modification failed:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        success: false,
        error: error.message || 'Failed to modify DOC file'
      };
    }
  }

  /**
   * Extract text content from a DOC file
   */
  static async extractText(filePath: string): Promise<TextExtractionResponse> {
    try {
      console.log('📄 Extracting text from DOC file...', { filePath });

      const response = await axios.post(`${API_BASE_URL}/api/doc/extract-text`, {
        filePath
      });
      
      console.log('✅ Text extraction successful');
      return response.data;
    } catch (error: any) {
      console.error('❌ Text extraction failed:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        success: false,
        error: error.message || 'Failed to extract text from DOC file'
      };
    }
  }

  /**
   * Validate if a sentence exists in a DOC file
   */
  static async validateSentence(filePath: string, sentence: string): Promise<SentenceValidationResponse> {
    try {
      console.log('🔍 Validating sentence in DOC file...', { 
        filePath, 
        sentence: sentence.substring(0, 50) + '...' 
      });

      const response = await axios.post(`${API_BASE_URL}/api/doc/validate-sentence`, {
        filePath,
        sentence
      });
      
      console.log('✅ Sentence validation successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Sentence validation failed:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        success: false,
        error: error.message || 'Failed to validate sentence in DOC file'
      };
    }
  }

  /**
   * Download a modified DOC file
   */
  static async downloadFile(filePath: string): Promise<void> {
    try {
      console.log('⬇️ Downloading modified file...', { filePath });

      const response = await axios.get(`${API_BASE_URL}/${filePath}`, {
        responseType: 'blob'
      });

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filePath.split('/').pop() || 'modified_document.docx';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ File download initiated');
    } catch (error: any) {
      console.error('❌ File download failed:', error);
      throw new Error(error.message || 'Failed to download file');
    }
  }
}
