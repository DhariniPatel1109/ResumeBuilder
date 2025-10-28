/**
 * Resume Template Page
 * Page for generating resumes from templates
 */

import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import ResumeTemplateGenerator from '../components/template/ResumeTemplateGenerator';

const ResumeTemplate: React.FC = () => {
  const handleGenerate = (resumeData: any) => {
    console.log('Resume generated:', resumeData);
    // You can add additional logic here, like saving to versions
  };

  return (
    <PageLayout
      title="Resume Template Generator"
      subtitle="Create professional resumes using our template-based system. Fill in your information and generate a perfectly formatted resume."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Resume Template' }
      ]}
    >
      <div className="py-8">
        <ResumeTemplateGenerator onGenerate={handleGenerate} />
      </div>
    </PageLayout>
  );
};

export default ResumeTemplate;
