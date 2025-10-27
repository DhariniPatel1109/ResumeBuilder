// AI Service for API Integration
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { 
  AIEnhancementRequest, 
  AIEnhancementResponse, 
  AIProcessingStatus 
} from '../types/ai';

class AIService {
  private static instance: AIService;

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Enhance resume content based on job description
   */
  async enhanceResume(request: AIEnhancementRequest): Promise<AIEnhancementResponse> {
    try {
      console.log('🤖 Sending AI enhancement request...');
      
      const response = await axios.post(API_ENDPOINTS.AI_ENHANCE, request, {
        timeout: 60000, // 60 seconds timeout for AI processing
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        console.log('✅ AI enhancement completed successfully');
        return response.data;
      } else {
        throw new Error(response.data.error || 'AI enhancement failed');
      }
    } catch (error) {
      console.error('❌ AI enhancement error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to enhance resume with AI'
      );
    }
  }

  /**
   * Get processing status for AI enhancement
   */
  async getProcessingStatus(sessionId: string): Promise<AIProcessingStatus> {
    try {
      const response = await axios.get(`${API_ENDPOINTS.AI_STATUS}/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting AI processing status:', error);
      throw new Error('Failed to get processing status');
    }
  }

  /**
   * Apply selected AI suggestions
   */
  async applySuggestions(sessionId: string, suggestionIds: string[]): Promise<boolean> {
    try {
      const response = await axios.post(API_ENDPOINTS.AI_APPLY, {
        sessionId,
        suggestionIds,
      });

      return response.data.success;
    } catch (error) {
      console.error('❌ Error applying AI suggestions:', error);
      throw new Error('Failed to apply suggestions');
    }
  }

  /**
   * Validate job description
   */
  validateJobDescription(jobDescription: string): { isValid: boolean; error?: string } {
    if (!jobDescription.trim()) {
      return { isValid: false, error: 'Job description cannot be empty' };
    }

    if (jobDescription.length > 2000) {
      return { isValid: false, error: 'Job description should be less than 2000 characters' };
    }

    return { isValid: true };
  }

  /**
   * Simulate AI processing stages (for development)
   */
  simulateProcessingStages(): AIProcessingStatus[] {
    return [
      { stage: 'analyzing', progress: 20, message: 'Analyzing job requirements...' },
      { stage: 'enhancing', progress: 50, message: 'Enhancing bullet points...' },
      { stage: 'optimizing', progress: 80, message: 'Optimizing keywords...' },
      { stage: 'complete', progress: 100, message: 'Enhancement complete!' },
    ];
  }
}

export default AIService.getInstance();
