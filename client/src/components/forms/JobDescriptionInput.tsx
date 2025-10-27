// Job Description Input Component
import React, { useState } from 'react';

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          💼 Job Description
          <span className="text-gray-500 dark:text-gray-400 ml-1">(Optional - for AI enhancement)</span>
          {disabled && <span className="text-orange-600 dark:text-orange-400 ml-1"> - Disabled during AI processing</span>}
        </label>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span className={isAtLimit ? 'text-red-600 dark:text-red-400 font-semibold' : isNearLimit ? 'text-yellow-600 dark:text-yellow-400' : ''}>
            {characterCount}/{maxLength}
          </span>
        </div>
      </div>

      <div className={`relative ${isFocused ? 'ring-2 ring-primary-500 ring-offset-2' : ''} ${disabled ? 'opacity-60' : ''}`}>
        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400 resize-none ${
            disabled ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''
          }`}
          rows={4}
          autoComplete="off"
          spellCheck="false"
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            disabled={disabled}
            title="Clear job description"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {value && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md">
          <span className="text-blue-600 dark:text-blue-400 mt-0.5">💡</span>
          <span className="text-sm text-blue-700 dark:text-blue-300">
            AI will analyze this job description to enhance your resume content with relevant keywords and requirements.
          </span>
        </div>
      )}

      {isAtLimit && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md">
          <span className="text-red-600 dark:text-red-400">⚠️</span>
          <span className="text-sm text-red-700 dark:text-red-300">Character limit reached</span>
        </div>
      )}

      {/* Debug section - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
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
