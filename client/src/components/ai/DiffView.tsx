// Diff View Component for AI Suggestions
import React, { useState } from 'react';
import { AISuggestion } from '../../types/ai';
import './DiffView.css';

interface DiffViewProps {
  suggestion: AISuggestion;
  onAccept: (suggestionId: string) => void;
  onReject: (suggestionId: string) => void;
  onEdit: (suggestionId: string, editedText: string) => void;
  disabled?: boolean;
}

const DiffView: React.FC<DiffViewProps> = ({
  suggestion,
  onAccept,
  onReject,
  onEdit,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(suggestion.enhanced);
  const [showFullText, setShowFullText] = useState(false);

  const handleAccept = () => {
    onAccept(suggestion.id);
  };

  const handleReject = () => {
    onReject(suggestion.id);
  };

  const handleEdit = () => {
    if (isEditing) {
      onEdit(suggestion.id, editedText);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditedText(suggestion.enhanced);
    setIsEditing(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#28a745';
    if (confidence >= 0.6) return '#f39c12';
    return '#dc3545';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const displayOriginal = showFullText ? suggestion.original : truncateText(suggestion.original);
  const displayEnhanced = showFullText ? suggestion.enhanced : truncateText(suggestion.enhanced);

  return (
    <div className={`diff-view ${suggestion.applied ? 'applied' : ''}`}>
      <div className="diff-header">
        <div className="suggestion-info">
          <span className="suggestion-type">
            {suggestion.type === 'personalSummary' ? '📝' : 
             suggestion.type === 'workExperience' ? '💼' : '🚀'}
            {suggestion.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </span>
          <div className="confidence-indicator">
            <span 
              className="confidence-dot"
              style={{ backgroundColor: getConfidenceColor(suggestion.confidence) }}
            />
            <span className="confidence-text">
              {getConfidenceText(suggestion.confidence)} Confidence
            </span>
          </div>
        </div>
        
        {suggestion.reasoning && (
          <div className="reasoning">
            <span className="reasoning-icon">💡</span>
            <span className="reasoning-text">{suggestion.reasoning}</span>
          </div>
        )}
      </div>

      <div className="diff-content">
        <div className="diff-columns">
          <div className="diff-column original">
            <div className="column-header">
              <span className="column-label">Original</span>
            </div>
            <div className="column-content">
              <p className="text-content">{displayOriginal}</p>
            </div>
          </div>

          <div className="diff-column enhanced">
            <div className="column-header">
              <span className="column-label">AI Enhanced</span>
            </div>
            <div className="column-content">
              {isEditing ? (
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="edit-textarea"
                  rows={4}
                />
              ) : (
                <p className="text-content">{displayEnhanced}</p>
              )}
            </div>
          </div>
        </div>

        {(suggestion.original.length > 200 || suggestion.enhanced.length > 200) && (
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="toggle-full-text"
          >
            {showFullText ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>

      <div className="diff-actions">
        {isEditing ? (
          <>
            <button
              onClick={handleEdit}
              disabled={disabled}
              className="action-button save-button"
            >
              💾 Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={disabled}
              className="action-button cancel-button"
            >
              ❌ Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleAccept}
              disabled={disabled || suggestion.applied}
              className="action-button accept-button"
            >
              ✅ Accept
            </button>
            <button
              onClick={handleEdit}
              disabled={disabled}
              className="action-button edit-button"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleReject}
              disabled={disabled}
              className="action-button reject-button"
            >
              ❌ Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DiffView;
