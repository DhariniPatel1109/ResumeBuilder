/**
 * Dynamic Resume Renderer
 * Renders resume sections dynamically based on AI-determined structure
 */

import React from 'react';
import { ResumeSection } from '../types';
import './DynamicResumeRenderer.css';

interface DynamicResumeRendererProps {
  sections: ResumeSection;
  onUpdate?: (sectionKey: string, content: any) => void;
  isEditing?: boolean;
}

const DynamicResumeRenderer: React.FC<DynamicResumeRendererProps> = ({
  sections,
  onUpdate,
  isEditing = false
}) => {
  const renderSection = (sectionKey: string, sectionContent: any) => {
    // Skip if it's a core section that's handled elsewhere
    if (['personalSummary', 'workExperience', 'projects'].includes(sectionKey)) {
      return null;
    }

    return (
      <div key={sectionKey} className="dynamic-section">
        <h3 className="section-title">
          {sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </h3>
        <div className="section-content">
          {renderSectionContent(sectionKey, sectionContent)}
        </div>
      </div>
    );
  };

  const renderSectionContent = (sectionKey: string, content: any) => {
    if (typeof content === 'string') {
      return (
        <div className="text-content">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => onUpdate?.(sectionKey, e.target.value)}
              className="editable-text"
              rows={4}
            />
          ) : (
            <p>{content}</p>
          )}
        </div>
      );
    }

    if (Array.isArray(content)) {
      return (
        <div className="list-content">
          {content.map((item, index) => (
            <div key={index} className="list-item">
              {typeof item === 'string' ? (
                isEditing ? (
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newContent = [...content];
                      newContent[index] = e.target.value;
                      onUpdate?.(sectionKey, newContent);
                    }}
                    className="editable-input"
                  />
                ) : (
                  <span>{item}</span>
                )
              ) : (
                <div className="structured-item">
                  {Object.entries(item).map(([key, value]) => (
                    <div key={key} className="item-field">
                      <strong>{key}:</strong> {String(value)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() => {
                const newContent = [...content, ''];
                onUpdate?.(sectionKey, newContent);
              }}
              className="add-item-button"
            >
              + Add Item
            </button>
          )}
        </div>
      );
    }

    if (typeof content === 'object' && content !== null) {
      return (
        <div className="object-content">
          {Object.entries(content).map(([key, value]) => (
            <div key={key} className="object-field">
              <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
              {renderSectionContent(key, value)}
            </div>
          ))}
        </div>
      );
    }

    return <div className="unknown-content">{String(content)}</div>;
  };

  const getSectionKeys = () => {
    return Object.keys(sections).filter(key => 
      !['personalSummary', 'workExperience', 'projects'].includes(key)
    );
  };

  const dynamicSections = getSectionKeys();

  if (dynamicSections.length === 0) {
    return null;
  }

  return (
    <div className="dynamic-resume-renderer">
      <h2 className="renderer-title">Additional Sections</h2>
      <p className="renderer-description">
        These sections were automatically detected from your resume by AI.
      </p>
      {dynamicSections.map(sectionKey => 
        renderSection(sectionKey, sections[sectionKey])
      )}
    </div>
  );
};

export default DynamicResumeRenderer;
