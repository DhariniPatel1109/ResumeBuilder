import React, { useRef } from 'react';
import axios from 'axios';
import './FileUpload.css';

interface FileUploadProps {
  onUploadSuccess: (data: any) => void;
  isUploading: boolean;
  setIsUploading: (loading: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, isUploading, setIsUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onUploadSuccess(response.data);
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please check your file format and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        handleFileUpload({ target: { files: [file] } } as any);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="file-upload">
      <div 
        className={`upload-area ${isUploading ? 'uploading' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,.doc,.pdf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        
        {isUploading ? (
          <div className="upload-content">
            <div className="spinner"></div>
            <p>Processing your resume...</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📄</div>
            <h3>Drop your resume here or click to browse</h3>
            <p>Supports .docx, .doc, and .pdf files</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
