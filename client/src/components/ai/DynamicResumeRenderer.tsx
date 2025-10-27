import React from 'react';
import { ResumeSection, DynamicSection } from '../../types';
import DynamicSectionEditor from './DynamicSectionEditor';

interface DynamicResumeRendererProps {
  sections: ResumeSection;
  onUpdate?: (sectionKey: string, content: any) => void;
  onDelete?: (sectionKey: string) => void;
  isEditing?: boolean;
}

const DynamicResumeRenderer: React.FC<DynamicResumeRendererProps> = ({
  sections,
  onUpdate,
  onDelete,
  isEditing = false
}) => {
  const getDynamicSections = (): Array<{ key: string; section: DynamicSection }> => {
    const dynamicSections: Array<{ key: string; section: DynamicSection }> = [];
    
    // Skip core sections that are handled elsewhere
    const coreSections = ['personalSummary', 'workExperience', 'projects'];
    
    Object.entries(sections).forEach(([key, value]) => {
      if (coreSections.includes(key)) return;
      
      // Check if this looks like a dynamic section
      if (value && typeof value === 'object' && 'type' in value && 'content' in value && 'originalHeader' in value) {
        dynamicSections.push({ key, section: value as DynamicSection });
      }
    });
    
    return dynamicSections;
  };

  const dynamicSections = getDynamicSections();

  if (dynamicSections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🤖</span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            AI-Detected Additional Sections
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          These sections were automatically detected from your resume by AI and can be edited or removed.
        </p>
      </div>

      <div className="space-y-4">
        {dynamicSections.map(({ key, section }) => (
          <DynamicSectionEditor
            key={key}
            sectionName={key}
            section={section}
            onUpdate={(content) => onUpdate?.(key, content)}
            onDelete={onDelete ? () => onDelete(key) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default DynamicResumeRenderer;
