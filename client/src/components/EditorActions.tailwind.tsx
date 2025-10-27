/**
 * Editor Actions Component - Tailwind Version
 * Handles save, export, and other editor actions
 */

import React from 'react';
import ExportButtons from './ExportButtons';

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
    <div className="bg-white border border-gray-200 rounded-xl p-6 mt-8 shadow-lg">
      <div className="mb-6">
        <label htmlFor="company-name" className="block text-gray-700 text-base font-semibold mb-2">
          Company Name (for versioning):
        </label>
        <input
          id="company-name"
          type="text"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="Enter company name..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-200 bg-gray-50 focus:outline-none focus:border-primary-500 focus:shadow-lg focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
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
