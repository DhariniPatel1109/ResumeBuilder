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
    if (!state.jobDescription.trim()) {
      setState(prev => ({
        ...prev,
        error: 'Job description is required for AI enhancement',
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
        resumeData,
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
    canStartEnhancement: state.isEnabled && state.jobDescription.trim().length > 0 && !state.isProcessing,
    hasSuggestions: state.suggestions !== null,
    hasError: state.error !== null,
  };
};
