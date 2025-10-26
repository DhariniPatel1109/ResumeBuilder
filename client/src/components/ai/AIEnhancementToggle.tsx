// AI Enhancement Toggle Component
import React from 'react';
import './AIEnhancementToggle.css';

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
    <div className="ai-enhancement-toggle-container">
      <div 
        className={`ai-toggle ${getToggleState()}`}
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
        <div className="toggle-content">
          <span className="toggle-icon">{getToggleIcon()}</span>
          <span className="toggle-text">{getToggleText()}</span>
        </div>
        
        <div className={`toggle-switch ${isEnabled ? 'on' : 'off'}`}>
          <div className="toggle-slider" />
        </div>
      </div>

      {!hasJobDescription && isEnabled && (
        <div className="toggle-warning">
          <span className="warning-icon">⚠️</span>
          <span>Please add a job description to enable AI enhancement</span>
        </div>
      )}

      {isEnabled && hasJobDescription && !isProcessing && (
        <div className="toggle-info">
          <span className="info-icon">💡</span>
          <span>AI will analyze your job description and enhance your resume content</span>
        </div>
      )}
    </div>
  );
};

export default AIEnhancementToggle;
