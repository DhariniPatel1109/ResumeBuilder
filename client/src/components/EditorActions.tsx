/**
 * Editor Actions Component
 * Handles save, export, and other editor actions
 */

import React from 'react';
import ExportButtons from './ui/buttons/ExportButtons';

interface EditorActionsProps {
  companyName: string;
  onCompanyNameChange: (name: string) => void;
  onSave: () => void;
  onExport: (format: 'word' | 'pdf') => void;
  isSaving: boolean;
}

const EditorActions: React.FC<EditorActionsProps> = ({
  companyName,
  onCompanyNameChange,
  onSave,
  onExport,
  isSaving
}) => {
  return (
    <div className="editor-actions">
      <div className="company-input-section">
        <label htmlFor="company-name" className="company-label">
          Company Name (for versioning):
        </label>
        <input
          id="company-name"
          type="text"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="Enter company name..."
          className="company-input"
          disabled={isSaving}
        />
      </div>

      <ExportButtons
        onSave={onSave}
        onExportWord={() => onExport('word')}
        onExportPDF={() => onExport('pdf')}
        isSaving={isSaving}
        companyName={companyName}
      />
    </div>
  );
};

export default EditorActions;
