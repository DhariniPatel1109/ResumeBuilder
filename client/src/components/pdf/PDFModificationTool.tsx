/**
 * PDF Modification Tool Component
 * Provides UI for PDF file text modification
 */

import React, { useState, useRef } from 'react';
import { PDFModificationService } from '../../services/pdfModificationService';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { Upload, FileText, CheckCircle, XCircle, Loader2, File } from 'lucide-react';

const PDFModificationTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalText, setOriginalText] = useState('');
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setMessage(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile || !originalText || !newText) {
      setMessage({ type: 'error', text: 'Please select a PDF file and enter both texts.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await PDFModificationService.modifyPDF({
        pdfFile: selectedFile,
        originalText,
        newText,
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'PDF modified and downloaded successfully!' });
        setSelectedFile(null);
        setOriginalText('');
        setNewText('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to modify PDF.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="max-w-2xl mx-auto bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        PDF File Content Modifier
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload PDF File
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              disabled={loading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Browse
            </Button>
          </div>
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <File className="w-4 h-4" />
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Original Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Original Text to Replace
          </label>
          <Input
            type="text"
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Enter the exact text to find..."
            className="w-full"
            disabled={loading}
          />
        </div>

        {/* New Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Text
          </label>
          <Input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Enter the new text to insert..."
            className="w-full"
            disabled={loading}
          />
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`p-3 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-success-50 dark:bg-success-900/20 text-success-800 dark:text-success-200 border border-success-200 dark:border-success-800'
                : 'bg-error-50 dark:bg-error-900/20 text-error-800 dark:text-error-200 border border-error-200 dark:border-error-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!selectedFile || !originalText || !newText || loading}
          className="flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Modifying...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Modify & Download PDF
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default PDFModificationTool;
