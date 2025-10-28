/**
 * File Upload Component - Refactored with centralized theme system
 */

import React, { useRef, useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { ResumeService } from '../../services';

interface FileUploadProps {
  onUploadSuccess: (data: any) => void;
  isUploading: boolean;
  setIsUploading: (loading: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadSuccess, 
  isUploading, 
  setIsUploading 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const response = await ResumeService.uploadResume(file);
      console.log('Upload response:', response);
      onUploadSuccess(response);
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <Card 
        variant="elevated" 
        padding="lg"
        className={`relative transition-all duration-200 bg-white dark:bg-gray-800 ${
          dragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
        }`}
      >
        <div
          className="relative p-8 text-center cursor-pointer"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.doc,.pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Processing Resume...
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Please wait while we parse your resume
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl mb-4">
                {dragActive ? '📁' : '📄'}
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {dragActive ? 'Drop your resume here' : 'Upload Resume'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Drag and drop your resume file here, or click to browse
                </p>
                
                <Button
                  variant="primary"
                  size="lg"
                  disabled={isUploading}
                >
                  Choose File
                </Button>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Supported formats: .docx, .doc, .pdf</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-error-600 dark:text-error-400 text-lg">⚠️</span>
            <p className="text-error-800 dark:text-error-200 font-medium">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto text-error-600 dark:text-error-400 hover:text-error-800 dark:hover:text-error-200"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;