/**
 * File Upload Component - Refactored with centralized theme system
 */

import React, { useRef, useState } from 'react';
import axios from 'axios';
import Button from './ui/Button';
import Card from './ui/Card';
import { API_ENDPOINTS } from '../config/api';

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

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'application/pdf' // .pdf
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid file (.docx, .doc, or .pdf)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(API_ENDPOINTS.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);
      onUploadSuccess(response.data);
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(
        error.response?.data?.error || 
        'Failed to upload file. Please try again.'
      );
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
        className={`relative transition-all duration-200 ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-200 hover:border-primary-300'
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Processing Resume...
                </h3>
                <p className="text-gray-600">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {dragActive ? 'Drop your resume here' : 'Upload Resume'}
                </h3>
                <p className="text-gray-600 mb-4">
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

              <div className="text-sm text-gray-500">
                <p>Supported formats: .docx, .doc, .pdf</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-error-600 text-lg">⚠️</span>
            <p className="text-error-800 font-medium">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto text-error-600 hover:text-error-800"
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