// AI Suggestions Review Component
import React, { useState } from 'react';
import { AIEnhancementResponse, AISuggestion, AISuggestionAction } from '../../../types/ai';
import DiffView from './DiffView';

interface AISuggestionsReviewProps {
  suggestions: AIEnhancementResponse['suggestions'];
  onApplySuggestions: (suggestionIds: string[]) => void;
  onCancel: () => void;
  isApplying?: boolean;
}

const AISuggestionsReview: React.FC<AISuggestionsReviewProps> = ({
  suggestions,
  onApplySuggestions,
  onCancel,
  isApplying = false,
}) => {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [editedSuggestions, setEditedSuggestions] = useState<Map<string, string>>(new Map());

  const handleSuggestionAction = (suggestionId: string, action: AISuggestionAction, editedText?: string) => {
    switch (action) {
      case 'accept':
        setAppliedSuggestions(prev => {
          const newSet = new Set(prev);
          newSet.add(suggestionId);
          return newSet;
        });
        break;
      case 'reject':
        setAppliedSuggestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(suggestionId);
          return newSet;
        });
        break;
      case 'edit':
        if (editedText) {
          setEditedSuggestions(prev => {
            const newMap = new Map(prev);
            newMap.set(suggestionId, editedText);
            return newMap;
          });
          setAppliedSuggestions(prev => {
            const newSet = new Set(prev);
            newSet.add(suggestionId);
            return newSet;
          });
        }
        break;
    }
  };

  const handleApplySelected = () => {
    const suggestionIds = Array.from(appliedSuggestions);
    onApplySuggestions(suggestionIds);
  };

  const handleApplyAll = () => {
    const allSuggestionIds: string[] = [];
    
    if (suggestions.personalSummary) {
      allSuggestionIds.push(suggestions.personalSummary.id);
    }
    
    suggestions.workExperience.forEach(suggestion => {
      allSuggestionIds.push(suggestion.id);
    });
    
    suggestions.projects.forEach(suggestion => {
      allSuggestionIds.push(suggestion.id);
    });
    
    onApplySuggestions(allSuggestionIds);
  };

  const getTotalSuggestions = () => {
    let total = 0;
    if (suggestions.personalSummary) total += 1;
    total += suggestions.workExperience.length;
    total += suggestions.projects.length;
    return total;
  };

  const getAppliedCount = () => {
    return appliedSuggestions.size;
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              🤖 Review AI Suggestions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Review and apply AI enhancements to your resume</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{getAppliedCount()}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Applied</div>
            </div>
            <div className="text-gray-400 dark:text-gray-500">/</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{getTotalSuggestions()}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {suggestions.personalSummary && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              📝 Personal Summary
            </h3>
            <DiffView
              suggestion={suggestions.personalSummary}
              onAccept={(id) => handleSuggestionAction(id, 'accept')}
              onReject={(id) => handleSuggestionAction(id, 'reject')}
              onEdit={(id, text) => handleSuggestionAction(id, 'edit', text)}
              disabled={isApplying}
            />
          </div>
        )}

        {suggestions.workExperience.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              💼 Work Experience
            </h3>
            <div className="space-y-4">
              {suggestions.workExperience.map((suggestion) => (
                <div key={suggestion.id} className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                  <div className="mb-3">
                    <span className="font-medium text-gray-900 dark:text-white">{suggestion.jobTitle}</span>
                    {suggestion.company && (
                      <span className="text-gray-600 dark:text-gray-400 ml-2">at {suggestion.company}</span>
                    )}
                  </div>
                  <DiffView
                    suggestion={suggestion}
                    onAccept={(id) => handleSuggestionAction(id, 'accept')}
                    onReject={(id) => handleSuggestionAction(id, 'reject')}
                    onEdit={(id, text) => handleSuggestionAction(id, 'edit', text)}
                    disabled={isApplying}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {suggestions.projects.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              🚀 Projects
            </h3>
            <div className="space-y-4">
              {suggestions.projects.map((suggestion) => (
                <div key={suggestion.id} className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                  <div className="mb-3">
                    <span className="font-medium text-gray-900 dark:text-white">{suggestion.projectName}</span>
                  </div>
                  <DiffView
                    suggestion={suggestion}
                    onAccept={(id) => handleSuggestionAction(id, 'accept')}
                    onReject={(id) => handleSuggestionAction(id, 'reject')}
                    onEdit={(id, text) => handleSuggestionAction(id, 'edit', text)}
                    disabled={isApplying}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isApplying}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              onClick={handleApplySelected}
              disabled={isApplying || appliedSuggestions.size === 0}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Selected ({getAppliedCount()})
            </button>
            
            <button
              onClick={handleApplyAll}
              disabled={isApplying}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50"
            >
              Apply All
            </button>
          </div>
          
          {isApplying && (
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
              <span className="text-sm">Applying suggestions...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsReview;
