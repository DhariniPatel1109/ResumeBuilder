// Custom Hook for AI Enhancement State Management
import { useState, useCallback } from 'react';
import { AIEnhancementState, AIEnhancementRequest, AIEnhancementResponse } from '../types/ai';
import aiService from '../services/aiService';

export const useAIEnhancement = () => {
  const [state, setState] = useState<AIEnhancementState>({
    isEnabled: false,
    jobDescription: '',
    isProcessing: false,
    suggestions: null,
    sessionId: null,
    appliedSuggestions: [],
    error: null,
  });

  const updateJobDescription = useCallback((jobDescription: string) => {
    setState(prev => ({
      ...prev,
      jobDescription,
      error: null,
    }));
  }, []);

  const toggleAIEnhancement = useCallback((enabled: boolean) => {
    setState(prev => ({
      ...prev,
      isEnabled: enabled,
      error: null,
    }));
  }, []);

  const startEnhancement = useCallback(async (resumeData: any) => {
    const validation = aiService.validateJobDescription(state.jobDescription);
    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        error: validation.error || 'Job description is required for AI enhancement',
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
    }));

    try {
      const request: AIEnhancementRequest = {
        jobDescription: state.jobDescription,
        resumeData: {
          personalSummary: resumeData.sections?.personalSummary || '',
          workExperience: resumeData.sections?.workExperience || [],
          projects: resumeData.sections?.projects || []
        },
      };

      const response: AIEnhancementResponse = await aiService.enhanceResume(request);
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        suggestions: response.suggestions,
        sessionId: response.sessionId,
        error: null,
      }));

      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'AI enhancement failed',
      }));
      throw error;
    }
  }, [state.jobDescription]);

  const applySuggestions = useCallback(async (suggestionIds: string[]) => {
    if (!state.sessionId) {
      throw new Error('No active AI session');
    }

    try {
      const success = await aiService.applySuggestions(state.sessionId, suggestionIds);
      
      if (success) {
        setState(prev => ({
          ...prev,
          appliedSuggestions: prev.appliedSuggestions.concat(suggestionIds),
        }));
      }
      
      return success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to apply suggestions',
      }));
      throw error;
    }
  }, [state.sessionId]);

  const clearSuggestions = useCallback(() => {
    setState(prev => ({
      ...prev,
      suggestions: null,
      sessionId: null,
      appliedSuggestions: [],
      error: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isEnabled: false,
      jobDescription: '',
      isProcessing: false,
      suggestions: null,
      sessionId: null,
      appliedSuggestions: [],
      error: null,
    });
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    updateJobDescription,
    toggleAIEnhancement,
    startEnhancement,
    applySuggestions,
    clearSuggestions,
    clearError,
    reset,
    
    // Computed values
    hasJobDescription: state.jobDescription.trim().length > 0,
    canStartEnhancement: aiService.validateJobDescription(state.jobDescription).isValid && !state.isProcessing,
    hasSuggestions: state.suggestions !== null,
    hasError: state.error !== null,
  };
};
