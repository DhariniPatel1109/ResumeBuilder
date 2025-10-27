/**
 * AI Enhancement Workflow Component
 * Handles the complete AI enhancement process
 */

import React, { useState } from 'react';
import JobDescriptionInput from './JobDescriptionInput';
import AIEnhancementToggle from './AIEnhancementToggle';
import AIProcessingIndicator from './AIProcessingIndicator';
import AISuggestionsReview from './AISuggestionsReview';
import { useAIEnhancement } from '../../hooks/useAIEnhancement';
import { ResumeData } from '../../types';

interface AIEnhancementWorkflowProps {
  resumeData: ResumeData | null;
  onApplySuggestions: (suggestionIds: string[]) => void;
}

const AIEnhancementWorkflow: React.FC<AIEnhancementWorkflowProps> = ({
  resumeData,
  onApplySuggestions
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isApplyingSuggestions, setIsApplyingSuggestions] = useState(false);

  const {
    isEnabled: aiEnabled,
    jobDescription,
    isProcessing: aiProcessing,
    suggestions,
    error: aiError,
    hasJobDescription,
    canStartEnhancement,
    hasSuggestions,
    hasError,
    updateJobDescription,
    toggleAIEnhancement,
    startEnhancement,
    applySuggestions,
    clearSuggestions,
    clearError,
  } = useAIEnhancement();

  const handleStartAIEnhancement = async () => {
    if (!resumeData || !canStartEnhancement) return;

    try {
      await startEnhancement(resumeData);
      setShowSuggestions(true);
    } catch (error) {
      console.error('❌ AI Enhancement failed:', error);
    }
  };

  const handleApplyAISuggestions = async (suggestionIds: string[]) => {
    if (!resumeData) return;

    setIsApplyingSuggestions(true);
    try {
      await onApplySuggestions(suggestionIds);
      setShowSuggestions(false);
    } catch (error) {
      console.error('❌ Error applying suggestions:', error);
    } finally {
      setIsApplyingSuggestions(false);
    }
  };

  const handleCancelAISuggestions = () => {
    setShowSuggestions(false);
    clearSuggestions();
  };

  return (
    <div className="ai-enhancement-workflow">
      {/* AI Enhancement Section */}
      <div className="ai-section">
        <div className="ai-header">
          <h2>🤖 AI Resume Enhancement</h2>
          <p>Get AI-powered suggestions to improve your resume for specific job applications</p>
        </div>

        <div className="ai-controls">
          <JobDescriptionInput
            value={jobDescription}
            onChange={updateJobDescription}
            onClear={() => updateJobDescription('')}
            disabled={aiProcessing}
          />

          <div className="ai-actions">
            <AIEnhancementToggle
              isEnabled={aiEnabled}
              onToggle={toggleAIEnhancement}
              isProcessing={aiProcessing}
              hasJobDescription={hasJobDescription}
              disabled={aiProcessing}
            />

            <button
              onClick={handleStartAIEnhancement}
              disabled={!canStartEnhancement || aiProcessing}
              className={`enhance-button ${aiProcessing ? 'processing' : ''}`}
            >
              {aiProcessing ? '🔄 Processing...' : '✨ Enhance Resume'}
            </button>
          </div>

          {hasError && (
            <div className="ai-error">
              <p>❌ {aiError}</p>
              <button onClick={clearError} className="clear-error-button">
                Clear Error
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Processing Indicator */}
      {aiProcessing && (
        <AIProcessingIndicator isVisible={aiProcessing} />
      )}

      {/* AI Suggestions Review */}
      {showSuggestions && hasSuggestions && suggestions && (
        <AISuggestionsReview
          suggestions={suggestions}
          onApplySuggestions={handleApplyAISuggestions}
          onCancel={handleCancelAISuggestions}
          isApplying={isApplyingSuggestions}
        />
      )}
    </div>
  );
};

export default AIEnhancementWorkflow;
