/**
 * DOC Modification Tool Component
 * UI for modifying DOC files
 */

import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { DocModificationService, DocModificationRequest } from '../../services/docModificationService';
import { FileText, Upload, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface DocModificationToolProps {
  filePath?: string;
  onFileSelect?: (file: File) => void;
}

const DocModificationTool: React.FC<DocModificationToolProps> = ({ 
  filePath: initialFilePath,
  onFileSelect 
}) => {
  const [filePath, setFilePath] = useState(initialFilePath || '');
  const [originalSentence, setOriginalSentence] = useState('');
  const [newSentence, setNewSentence] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For demo purposes, we'll use a placeholder path
      // In a real implementation, you'd upload the file first
      setFilePath(`uploads/${file.name}`);
      onFileSelect?.(file);
    }
  };

  const handleExtractText = async () => {
    if (!filePath) {
      setError('Please provide a file path');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await DocModificationService.extractText(filePath);
      
      if (response.success) {
        setExtractedText(response.data?.text || '');
        setResult({ type: 'extract', data: response.data });
      } else {
        setError(response.error || 'Failed to extract text');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to extract text');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateSentence = async () => {
    if (!filePath || !originalSentence) {
      setError('Please provide file path and original sentence');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await DocModificationService.validateSentence(filePath, originalSentence);
      
      if (response.success) {
        setResult({ 
          type: 'validate', 
          data: response.data,
          message: response.data?.exists 
            ? 'Sentence found in document' 
            : 'Sentence not found in document'
        });
      } else {
        setError(response.error || 'Failed to validate sentence');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to validate sentence');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifyDocument = async () => {
    if (!filePath || !originalSentence || !newSentence) {
      setError('Please provide all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: DocModificationRequest = {
        filePath,
        originalSentence,
        newSentence
      };

      const response = await DocModificationService.modifySentence(request);
      
      if (response.success) {
        setResult({ 
          type: 'modify', 
          data: response.data,
          message: 'Document modified successfully!'
        });
      } else {
        setError(response.error || 'Failed to modify document');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to modify document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.data?.outputPath) {
      setError('No modified file available for download');
      return;
    }

    try {
      await DocModificationService.downloadFile(result.data.outputPath);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to download file');
    }
  };

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg" className="bg-white dark:bg-gray-800">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                DOC Modification Tool
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Modify specific sentences in DOC files while preserving formatting
              </p>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                DOC File
              </label>
              <div className="flex gap-3">
                <input
                  type="file"
                  accept=".doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Choose File
                </label>
                <Input
                  placeholder="Or enter file path..."
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Extract Text Button */}
            <Button
              variant="outline"
              onClick={handleExtractText}
              disabled={!filePath || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              Extract Text
            </Button>

            {/* Extracted Text Preview */}
            {extractedText && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Extracted Text Preview
                </label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 max-h-40 overflow-y-auto">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {extractedText.substring(0, 500)}
                    {extractedText.length > 500 && '...'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sentence Modification */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sentence Modification
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original Sentence (to find and replace)
              </label>
              <textarea
                value={originalSentence}
                onChange={(e) => setOriginalSentence(e.target.value)}
                placeholder="Enter the exact sentence you want to replace..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Sentence (replacement)
              </label>
              <textarea
                value={newSentence}
                onChange={(e) => setNewSentence(e.target.value)}
                placeholder="Enter the new sentence to replace with..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleValidateSentence}
                disabled={!filePath || !originalSentence || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Validate Sentence
              </Button>

              <Button
                variant="primary"
                onClick={handleModifyDocument}
                disabled={!filePath || !originalSentence || !newSentence || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Modify Document
              </Button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-green-800 dark:text-green-200 font-semibold mb-2">
                    {result.message}
                  </h4>
                  {result.data?.outputPath && (
                    <div className="space-y-2">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Modified file saved to: {result.data.outputPath}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="flex items-center gap-2 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                      >
                        <Download className="w-4 h-4" />
                        Download Modified File
                      </Button>
                    </div>
                  )}
                  {result.data?.changes && (
                    <div className="mt-3 text-sm">
                      <p className="text-green-700 dark:text-green-300">
                        <strong>Original:</strong> {result.data.changes.originalSentence}
                      </p>
                      <p className="text-green-700 dark:text-green-300">
                        <strong>New:</strong> {result.data.changes.newSentence}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <h4 className="text-red-800 dark:text-red-200 font-semibold mb-1">
                    Error
                  </h4>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DocModificationTool;
