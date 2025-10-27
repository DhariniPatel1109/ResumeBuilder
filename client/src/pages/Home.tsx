/**
 * Home Page - Refactored with centralized theme system
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FileUpload from '../components/FileUpload';
const Home: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleUploadSuccess = (responseData: any) => {
    // Extract the actual data from the response
    const resumeData = responseData.data || responseData;
    console.log('📋 Storing resume data:', resumeData);
    
    // Store parsed data in sessionStorage for the editor
    sessionStorage.setItem('resumeData', JSON.stringify(resumeData));
    navigate('/editor');
  };

  const features = [
    {
      icon: '🎯',
      title: 'Targeted Customization',
      description: 'Edit specific bullet points to match job requirements'
    },
    {
      icon: '📄',
      title: 'Format Preservation',
      description: 'Maintain your original resume formatting'
    },
    {
      icon: '💾',
      title: 'Version Management',
      description: 'Save multiple versions for different companies'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Upload Resume',
      description: 'Upload your existing resume in Word or PDF format'
    },
    {
      number: '2',
      title: 'Auto-Parse Sections',
      description: 'We automatically detect and parse your resume sections'
    },
    {
      number: '3',
      title: 'Edit Content',
      description: 'Modify specific bullet points to match job requirements'
    },
    {
      number: '4',
      title: 'Export & Save',
      description: 'Generate customized resumes and save versions'
    }
  ];

  return (
    <PageLayout
      title="ResumeBuilder"
      subtitle="Upload your resume and customize it for different job applications"
    >
      <div className="space-y-16">
        {/* Hero Section */}
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Build Better Resumes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your resume into a targeted, job-specific document that gets you noticed. 
              Upload once, customize for every application.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <Card key={index} variant="elevated" padding="lg" className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <Card variant="floating" padding="lg" className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upload Your Resume
            </h2>
            <p className="text-gray-600">
              Get started by uploading your existing resume
            </p>
          </div>

          <FileUpload 
            onUploadSuccess={handleUploadSuccess}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Supported formats: .docx, .doc, .pdf
            </p>
          </div>
        </Card>

        {/* How It Works Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to create the perfect resume for any job
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform translate-x-4"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Upload your resume and start creating targeted versions today
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              fileInput?.click();
            }}
            className="bg-white text-primary-600 hover:bg-gray-50 border-white"
          >
            Upload Resume Now
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;