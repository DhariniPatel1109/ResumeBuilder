/**
 * Resume Editor Page - Refactored with centralized theme system
 */

import React, { useState } from 'react';
import SectionManager from '../components/SectionManager';
import EditorActions from '../components/EditorActions';
import AIEnhancementWorkflow from '../components/ai/AIEnhancementWorkflow';
import { useResumeData } from '../hooks/useResumeData';
import { useAIEnhancement } from '../hooks/useAIEnhancement';
import PageLayout from '../components/layout/PageLayout';
import './ResumeEditor.css';

const ResumeEditor: React.FC = () => {
  // Resume data management
  const {
    resumeData,
    setResumeData,
    companyName,
    setCompanyName,
    isSaving,
    updateSection,
    updateDynamicSection,
    saveVersion,
    exportResume
  } = useResumeData();

  // AI Enhancement
  const {
    isEnabled: aiEnabled,
    jobDescription,
    isProcessing: aiProcessing,
    suggestions,
    error: aiError,
    hasJobDescription,
    canStartEnhancement,
    hasSuggestions,
    hasError,
    updateJobDescription,
    toggleAIEnhancement,
    startEnhancement,
    applySuggestions,
    clearSuggestions,
    clearError,
  } = useAIEnhancement();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isApplyingSuggestions, setIsApplyingSuggestions] = useState(false);

  // AI Enhancement handlers
  const handleStartAIEnhancement = async () => {
    if (!resumeData || !canStartEnhancement) return;

    try {
      await startEnhancement(resumeData);
      setShowSuggestions(true);
    } catch (error) {
      console.error('❌ AI Enhancement failed:', error);
    }
  };

  const handleApplyAISuggestions = async (suggestionIds: string[]) => {
    if (!resumeData) return;

    setIsApplyingSuggestions(true);
    try {
      await applySuggestions(suggestionIds);
      
      // Apply suggestions to local state
      const updatedSections = { ...resumeData.sections };
      
      if (suggestions?.personalSummary && suggestionIds.includes(suggestions.personalSummary.id)) {
        updatedSections.personalSummary = suggestions.personalSummary.enhanced;
      }

      suggestions?.workExperience?.forEach(suggestion => {
        if (suggestionIds.includes(suggestion.id)) {
          if (updatedSections.workExperience) {
            const workExp = updatedSections.workExperience[suggestion.bulletIndex];
            if (workExp) {
              workExp.bullets[suggestion.bulletIndex] = suggestion.enhanced;
            }
          }
        }
      });

      suggestions?.projects?.forEach(suggestion => {
        if (suggestionIds.includes(suggestion.id)) {
          if (updatedSections.projects) {
            const project = updatedSections.projects[suggestion.bulletIndex];
            if (project) {
              project.bullets[suggestion.bulletIndex] = suggestion.enhanced;
            }
          }
        }
      });

      setResumeData(prev => prev ? { ...prev, sections: updatedSections } : null);
      setShowSuggestions(false);
      clearSuggestions();
    } catch (error) {
      console.error('❌ Error applying suggestions:', error);
    } finally {
      setIsApplyingSuggestions(false);
    }
  };

  const handleCancelAISuggestions = () => {
    setShowSuggestions(false);
    clearSuggestions();
  };

  if (!resumeData) {
    return (
      <PageLayout title="Loading...">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading resume data...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Resume Editor"
      subtitle="Edit and enhance your resume content"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Editor' }
      ]}
    >
      <div className="space-y-8">
        {/* AI Enhancement Section */}
        <AIEnhancementWorkflow
          resumeData={resumeData}
          onApplySuggestions={handleApplyAISuggestions}
        />

        {/* Resume Sections */}
        <SectionManager
          resumeData={resumeData}
          onUpdateSection={updateSection}
          onUpdateDynamicSection={updateDynamicSection}
        />

        {/* Editor Actions */}
        <EditorActions
          companyName={companyName}
          onCompanyNameChange={setCompanyName}
          onSave={saveVersion}
          onExport={(format) => exportResume(format)}
          isSaving={isSaving}
        />
      </div>
    </PageLayout>
  );
};

export default ResumeEditor;