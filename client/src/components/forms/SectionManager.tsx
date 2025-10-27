/**
 * Section Manager Component
 * Manages all resume sections (standard + dynamic)
 */

import React from 'react';
import SectionEditor from './SectionEditor';
import DynamicResumeRenderer from '../ai/resume/DynamicResumeRenderer';
import { ResumeData } from '../../types';

interface SectionManagerProps {
  resumeData: ResumeData | null;
  onUpdateSection: (sectionType: string, data: any) => void;
  onUpdateDynamicSection: (sectionName: string, content: any) => void;
}

const SectionManager: React.FC<SectionManagerProps> = ({
  resumeData,
  onUpdateSection,
  onUpdateDynamicSection
}) => {
  if (!resumeData) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading resume data...</p>
      </div>
    );
  }

  return (
    <div className="section-manager">
      {/* Standard Sections */}
      <div className="standard-sections">
        <SectionEditor
          title="Personal Summary"
          content={resumeData.sections?.personalSummary || ''}
          onUpdate={(content) => onUpdateSection('personalSummary', content)}
          type="text"
        />

        <SectionEditor
          title="Work Experience"
          content={resumeData.sections?.workExperience || []}
          onUpdate={(content) => onUpdateSection('workExperience', content)}
          type="experience"
        />

        <SectionEditor
          title="Projects"
          content={resumeData.sections?.projects || []}
          onUpdate={(content) => onUpdateSection('projects', content)}
          type="projects"
        />
      </div>

      {/* Dynamic Sections - AI-driven approach */}
      <DynamicResumeRenderer
        sections={resumeData.sections}
        onUpdate={onUpdateDynamicSection}
        isEditing={true}
      />
    </div>
  );
};

export default SectionManager;
