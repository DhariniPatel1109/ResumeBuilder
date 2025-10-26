// Job Description Input Component
import React, { useState } from 'react';
import './JobDescriptionInput.css';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  value,
  onChange,
  onClear,
  disabled = false,
  placeholder = "Paste job description here for AI enhancement...",
  maxLength = 2000,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData?.getData('text') || '';
    console.log('Paste event detected:', pastedText);
    
    if (disabled) {
      console.log('Textarea is disabled, preventing paste');
      e.preventDefault();
      return;
    }
    
    // Calculate new value after paste
    const textarea = e.target as HTMLTextAreaElement;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const newValue = value.substring(0, start) + pastedText + value.substring(end);
    
    if (newValue.length <= maxLength) {
      onChange(newValue);
    } else {
      // Truncate if too long
      const truncatedValue = newValue.substring(0, maxLength);
      onChange(truncatedValue);
    }
  };

  const handleClear = () => {
    onClear();
    setIsFocused(false);
  };

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isAtLimit = characterCount >= maxLength;

  return (
    <div className="job-description-input-container">
      <div className="input-header">
        <label className="input-label">
          💼 Job Description
          <span className="optional-text">(Optional - for AI enhancement)</span>
          {disabled && <span className="disabled-indicator"> - Disabled during AI processing</span>}
        </label>
        <div className="character-count">
          <span className={isAtLimit ? 'at-limit' : isNearLimit ? 'near-limit' : ''}>
            {characterCount}/{maxLength}
          </span>
        </div>
      </div>

      <div className={`input-wrapper ${isFocused ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}>
        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          className="job-description-textarea"
          rows={4}
          autoComplete="off"
          spellCheck="false"
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-button"
            disabled={disabled}
            title="Clear job description"
          >
            ✕
          </button>
        )}
      </div>

      {value && (
        <div className="input-help">
          <div className="help-text">
            <span className="help-icon">💡</span>
            <span>
              AI will analyze this job description to enhance your resume content with relevant keywords and requirements.
            </span>
          </div>
        </div>
      )}

      {isAtLimit && (
        <div className="limit-warning">
          <span className="warning-icon">⚠️</span>
          <span>Character limit reached</span>
        </div>
      )}

      {/* Debug section - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <small>
            Debug: Disabled={disabled ? 'Yes' : 'No'}, 
            Value length={value.length}, 
            Focused={isFocused ? 'Yes' : 'No'}
          </small>
        </div>
      )}
    </div>
  );
};

export default JobDescriptionInput;
