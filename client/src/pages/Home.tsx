import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import './Home.css';

const Home: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleUploadSuccess = (data: any) => {
    // Store parsed data in sessionStorage for the editor
    sessionStorage.setItem('resumeData', JSON.stringify(data));
    navigate('/editor');
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>ResumeBuilder</h1>
        <p className="subtitle">
          Upload your resume and customize it for different job applications
        </p>
        <div className="features">
          <div className="feature">
            <h3>🎯 Targeted Customization</h3>
            <p>Edit specific bullet points to match job requirements</p>
          </div>
          <div className="feature">
            <h3>📄 Format Preservation</h3>
            <p>Maintain your original resume formatting</p>
          </div>
          <div className="feature">
            <h3>💾 Version Management</h3>
            <p>Save multiple versions for different companies</p>
          </div>
        </div>
      </div>

      <div className="upload-section">
        <h2>Upload Your Resume</h2>
        <FileUpload 
          onUploadSuccess={handleUploadSuccess}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />
        <div className="supported-formats">
          <p>Supported formats: .docx, .doc, .pdf</p>
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload Resume</h3>
            <p>Upload your existing resume in Word or PDF format</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Auto-Parse Sections</h3>
            <p>We automatically detect and parse your resume sections</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Edit Content</h3>
            <p>Modify specific bullet points to match job requirements</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Export & Save</h3>
            <p>Generate customized resumes and save versions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
