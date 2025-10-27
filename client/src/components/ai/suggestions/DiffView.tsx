// Diff View Component for AI Suggestions
import React, { useState } from 'react';
import { AISuggestion } from '../../../types/ai';

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
    <div className={`border rounded-lg p-4 ${suggestion.applied ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600'}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            {suggestion.type === 'personalSummary' ? '📝' : 
             suggestion.type === 'workExperience' ? '💼' : '🚀'}
            {suggestion.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </span>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getConfidenceColor(suggestion.confidence) }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {getConfidenceText(suggestion.confidence)} Confidence
            </span>
          </div>
        </div>
        
        {suggestion.reasoning && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <span className="text-blue-600 dark:text-blue-400 mt-0.5">💡</span>
            <span className="text-sm text-blue-700 dark:text-blue-300">{suggestion.reasoning}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-600 rounded-md">
            <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Original</span>
            </div>
            <div className="p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{displayOriginal}</p>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-600 rounded-md">
            <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Enhanced</span>
            </div>
            <div className="p-3">
              {isEditing ? (
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400 resize-none"
                  rows={4}
                />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{displayEnhanced}</p>
              )}
            </div>
          </div>
        </div>

        {(suggestion.original.length > 200 || suggestion.enhanced.length > 200) && (
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
          >
            {showFullText ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleEdit}
              disabled={disabled}
              className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
            >
              💾 Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={disabled}
              className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition-colors disabled:opacity-50"
            >
              ❌ Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleAccept}
              disabled={disabled || suggestion.applied}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
            >
              ✅ Accept
            </button>
            <button
              onClick={handleEdit}
              disabled={disabled}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleReject}
              disabled={disabled}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
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
