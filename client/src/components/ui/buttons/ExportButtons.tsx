import React from 'react';

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
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={onSave}
          disabled={isDisabled}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
            isDisabled
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md'
          }`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
            isDisabled
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
          }`}
        >
          📄 Export Word
        </button>
        
        <button
          onClick={onExportPDF}
          disabled={isDisabled}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
            isDisabled
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md'
          }`}
        >
          📋 Export PDF
        </button>
      </div>

      {!companyName.trim() && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
          <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Please enter a company name to save or export
          </p>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Save versions for different companies</li>
          <li>• Export in Word or PDF format</li>
          <li>• Files will be named with company prefix</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportButtons;
