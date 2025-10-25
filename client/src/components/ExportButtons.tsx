import React from 'react';
import './ExportButtons.css';

interface ExportButtonsProps {
  onSave: () => void;
  onExportWord: () => void;
  onExportPDF: () => void;
  isSaving: boolean;
  companyName: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
  onSave,
  onExportWord,
  onExportPDF,
  isSaving,
  companyName
}) => {
  const isDisabled = !companyName.trim() || isSaving;

  return (
    <div className="export-buttons">
      <h3>Actions</h3>
      
      <div className="button-group">
        <button
          onClick={onSave}
          disabled={isDisabled}
          className={`action-button save-button ${isDisabled ? 'disabled' : ''}`}
        >
          {isSaving ? (
            <>
              <div className="spinner-small"></div>
              Saving...
            </>
          ) : (
            <>
              💾 Save Version
            </>
          )}
        </button>
        
        <button
          onClick={onExportWord}
          disabled={isDisabled}
          className={`action-button export-button ${isDisabled ? 'disabled' : ''}`}
        >
          📄 Export Word
        </button>
        
        <button
          onClick={onExportPDF}
          disabled={isDisabled}
          className={`action-button export-button ${isDisabled ? 'disabled' : ''}`}
        >
          📋 Export PDF
        </button>
      </div>

      {!companyName.trim() && (
        <p className="warning-text">
          Please enter a company name to save or export
        </p>
      )}

      <div className="help-text">
        <h4>💡 Tips:</h4>
        <ul>
          <li>Save versions for different companies</li>
          <li>Export in Word or PDF format</li>
          <li>Files will be named with company prefix</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportButtons;
