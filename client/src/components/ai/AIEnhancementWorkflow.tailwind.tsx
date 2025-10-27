/**
 * AI Enhancement Workflow Component - Tailwind Version
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
    <div className="mb-8">
      {/* AI Enhancement Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 mb-5">
        <div className="text-center mb-6">
          <h2 className="text-gray-800 text-3xl font-bold mb-3 flex items-center justify-center gap-3">
            🤖 AI Resume Enhancement
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Get AI-powered suggestions to improve your resume for specific job applications
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <JobDescriptionInput
            value={jobDescription}
            onChange={updateJobDescription}
            onClear={() => updateJobDescription('')}
            disabled={aiProcessing}
          />

          <div className="flex items-center gap-4 justify-center flex-wrap">
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
              className={`px-6 py-3 rounded-lg font-semibold text-base cursor-pointer transition-all duration-300 shadow-lg ${
                aiProcessing 
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none'
              }`}
            >
              {aiProcessing ? '🔄 Processing...' : '✨ Enhance Resume'}
            </button>
          </div>

          {hasError && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 mt-4 flex items-center justify-between gap-4">
              <p className="text-red-800 font-medium m-0">❌ {aiError}</p>
              <button 
                onClick={clearError} 
                className="bg-red-600 text-white border-none px-4 py-2 rounded-md text-sm cursor-pointer transition-colors duration-200 hover:bg-red-700"
              >
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
