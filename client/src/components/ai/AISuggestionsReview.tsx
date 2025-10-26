// AI Suggestions Review Component
import React, { useState } from 'react';
import { AIEnhancementResponse, AISuggestion, AISuggestionAction } from '../../types/ai';
import DiffView from './DiffView';
import './AISuggestionsReview.css';

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
    <div className="ai-suggestions-review">
      <div className="review-header">
        <div className="header-content">
          <h2>🤖 Review AI Suggestions</h2>
          <p>Review and apply AI enhancements to your resume</p>
        </div>
        <div className="suggestion-stats">
          <div className="stat-item">
            <span className="stat-number">{getAppliedCount()}</span>
            <span className="stat-label">Applied</span>
          </div>
          <div className="stat-divider">/</div>
          <div className="stat-item">
            <span className="stat-number">{getTotalSuggestions()}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>

      <div className="review-content">
        {suggestions.personalSummary && (
          <div className="suggestion-section">
            <h3>📝 Personal Summary</h3>
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
          <div className="suggestion-section">
            <h3>💼 Work Experience</h3>
            {suggestions.workExperience.map((suggestion) => (
              <div key={suggestion.id} className="work-experience-suggestion">
                <div className="suggestion-context">
                  <span className="job-title">{suggestion.jobTitle}</span>
                  {suggestion.company && (
                    <span className="company-name">at {suggestion.company}</span>
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
        )}

        {suggestions.projects.length > 0 && (
          <div className="suggestion-section">
            <h3>🚀 Projects</h3>
            {suggestions.projects.map((suggestion) => (
              <div key={suggestion.id} className="project-suggestion">
                <div className="suggestion-context">
                  <span className="project-name">{suggestion.projectName}</span>
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
        )}
      </div>

      <div className="review-actions">
        <div className="action-buttons">
          <button
            onClick={onCancel}
            disabled={isApplying}
            className="action-button cancel-button"
          >
            Cancel
          </button>
          
          <button
            onClick={handleApplySelected}
            disabled={isApplying || appliedSuggestions.size === 0}
            className="action-button apply-selected-button"
          >
            Apply Selected ({getAppliedCount()})
          </button>
          
          <button
            onClick={handleApplyAll}
            disabled={isApplying}
            className="action-button apply-all-button"
          >
            Apply All
          </button>
        </div>
        
        {isApplying && (
          <div className="applying-indicator">
            <div className="spinner-small"></div>
            <span>Applying suggestions...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestionsReview;
