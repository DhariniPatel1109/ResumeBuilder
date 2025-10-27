// AI Enhancement Toggle Component
import React from 'react';

interface AIEnhancementToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  isProcessing: boolean;
  hasJobDescription: boolean;
  disabled?: boolean;
}

const AIEnhancementToggle: React.FC<AIEnhancementToggleProps> = ({
  isEnabled,
  onToggle,
  isProcessing,
  hasJobDescription,
  disabled = false,
}) => {
  const handleToggle = () => {
    if (!disabled && !isProcessing) {
      onToggle(!isEnabled);
    }
  };

  const getToggleState = () => {
    if (disabled) return 'disabled';
    if (isProcessing) return 'processing';
    if (!hasJobDescription && isEnabled) return 'warning';
    return isEnabled ? 'enabled' : 'disabled';
  };

  const getToggleText = () => {
    if (isProcessing) return 'AI Processing...';
    if (!hasJobDescription && isEnabled) return 'Add Job Description';
    return isEnabled ? 'AI Enhancement Enabled' : 'Enable AI Enhancement';
  };

  const getToggleIcon = () => {
    if (isProcessing) return '⏳';
    if (!hasJobDescription && isEnabled) return '⚠️';
    return isEnabled ? '🤖' : '🤖';
  };

  return (
    <div className="space-y-3">
      <div 
        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
          getToggleState() === 'disabled' 
            ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-60'
            : getToggleState() === 'processing'
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 cursor-wait'
            : getToggleState() === 'warning'
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
            : isEnabled
            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
        }`}
        onClick={handleToggle}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{getToggleIcon()}</span>
          <span className={`font-medium ${
            getToggleState() === 'disabled' 
              ? 'text-gray-500 dark:text-gray-400'
              : getToggleState() === 'processing'
              ? 'text-blue-700 dark:text-blue-300'
              : getToggleState() === 'warning'
              ? 'text-yellow-700 dark:text-yellow-300'
              : isEnabled
              ? 'text-green-700 dark:text-green-300'
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {getToggleText()}
          </span>
        </div>
        
        <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          isEnabled 
            ? 'bg-primary-600 dark:bg-primary-500' 
            : 'bg-gray-300 dark:bg-gray-600'
        }`}>
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
            isEnabled ? 'translate-x-6' : 'translate-x-0'
          }`} />
        </div>
      </div>

      {!hasJobDescription && isEnabled && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
          <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
          <span className="text-sm text-yellow-700 dark:text-yellow-300">
            Please add a job description to enable AI enhancement
          </span>
        </div>
      )}

      {isEnabled && hasJobDescription && !isProcessing && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md">
          <span className="text-blue-600 dark:text-blue-400">💡</span>
          <span className="text-sm text-blue-700 dark:text-blue-300">
            AI will analyze your job description and enhance your resume content
          </span>
        </div>
      )}
    </div>
  );
};

export default AIEnhancementToggle;
