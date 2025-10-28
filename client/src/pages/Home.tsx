/**
 * Home Page - Modern, Clean Design
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FileUpload from '../components/forms/FileUpload';
import { 
  Target,
  FileText,
  Zap,
  Upload,
  Bot,
  Edit3,
  Download,
  ArrowRight,
  Sparkles,
  ArrowDown
} from 'lucide-react';

const Home: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleUploadSuccess = (responseData: any) => {
    const resumeData = responseData.data || responseData;
    console.log('📋 Storing resume data:', resumeData);
    sessionStorage.setItem('resumeData', JSON.stringify(resumeData));
    navigate('/editor');
  };

  return (
    <PageLayout hideHeader={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 bg-white dark:bg-gray-900">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-50">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8">
              <Sparkles className="w-3 h-3 mr-2" />
              AI-Powered Resume Builder
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Build Resumes That
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Get You Hired
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Upload once, customize for every job. Our AI helps you create targeted resumes that match exactly what employers want.
            </p>

            {/* Learn More Button */}
            <div className="flex justify-center items-center mb-16">
              <Button
                variant="outline"
                size="xl"
                className="px-8 py-4 text-lg font-semibold flex items-center gap-2"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn How It Works
                <ArrowDown className="w-5 h-5" />
              </Button>
            </div>

            {/* Upload Component */}
            <div className="max-w-2xl mx-auto">
              <Card variant="elevated" padding="lg" className="border-0 shadow-2xl bg-white dark:bg-gray-800">
                <FileUpload 
                  onUploadSuccess={handleUploadSuccess}
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                />
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supports .docx, .doc, .pdf • Free to use
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose ResumeBuilder?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need to create professional, job-winning resumes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card variant="elevated" padding="lg" className="text-center group hover:scale-105 transition-transform duration-200 bg-white dark:bg-gray-800">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  AI-Powered Targeting
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our AI analyzes job descriptions and suggests improvements to make your resume stand out for specific roles.
                </p>
              </Card>

              {/* Feature 2 */}
              <Card variant="elevated" padding="lg" className="text-center group hover:scale-105 transition-transform duration-200 bg-white dark:bg-gray-800">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Format Preservation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Keep your original formatting, fonts, and layout while updating content. No more starting from scratch.
                </p>
              </Card>

              {/* Feature 3 */}
              <Card variant="elevated" padding="lg" className="text-center group hover:scale-105 transition-transform duration-200 bg-white dark:bg-gray-800">
                <div className="w-16 h-16 bg-gradient-to-r from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Create multiple versions in minutes, not hours. Perfect for applying to multiple jobs efficiently.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Get started in 4 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Upload Resume',
                  description: 'Upload your existing resume in any format',
                  icon: Upload
                },
                {
                  step: '02', 
                  title: 'AI Analysis',
                  description: 'Our AI parses and structures your content',
                  icon: Bot
                },
                {
                  step: '03',
                  title: 'Customize',
                  description: 'Edit content to match job requirements',
                  icon: Edit3
                },
                {
                  step: '04',
                  title: 'Export',
                  description: 'Download your customized resume',
                  icon: Download
                }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="relative">
                  <Card variant="elevated" padding="lg" className="text-center h-full bg-white dark:bg-gray-800">
                    <div className="text-6xl font-bold text-primary-500 dark:text-primary-400 mb-4">
                      {item.step}
                    </div>
                    <div className="flex justify-center mb-4">
                      <IconComponent className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </Card>
                  
                  {/* Arrow */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who've already created winning resumes with our platform.
            </p>
            <Button
              size="xl"
              variant="outline"
              className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-white dark:border-gray-600 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Upload className="w-5 h-5" />
              Start by Uploading Your Resume
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Home;