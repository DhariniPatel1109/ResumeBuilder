import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import SectionEditor from '../components/SectionEditor';
import ExportButtons from '../components/ExportButtons';
import JobDescriptionInput from '../components/ai/JobDescriptionInput';
import AIEnhancementToggle from '../components/ai/AIEnhancementToggle';
import AIProcessingIndicator from '../components/ai/AIProcessingIndicator';
import AISuggestionsReview from '../components/ai/AISuggestionsReview';
import { useAIEnhancement } from '../hooks/useAIEnhancement';
import './ResumeEditor.css';

interface ResumeData {
  sections: {
    personalSummary: string;
    workExperience: Array<{
      title: string;
      company: string;
      duration: string;
      bullets: string[];
    }>;
    projects: Array<{
      name: string;
      description: string;
      bullets: string[];
    }>;
  };
  originalText: string;
  companyName?: string; // Optional company name for loaded versions
}

const ResumeEditor: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isApplyingSuggestions, setIsApplyingSuggestions] = useState(false);
  const navigate = useNavigate();

  // AI Enhancement hook
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

  useEffect(() => {
    const storedData = sessionStorage.getItem('resumeData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setResumeData(parsedData);
      
      // Load company name if it exists (for loaded versions)
      if (parsedData.companyName) {
        setCompanyName(parsedData.companyName);
        console.log('📋 Loaded version for company:', parsedData.companyName);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleSectionUpdate = (sectionType: string, data: any) => {
    if (!resumeData) return;

    setResumeData({
      ...resumeData,
      sections: {
        ...resumeData.sections,
        [sectionType]: data
      }
    });
  };

  const handleSaveVersion = async () => {
    if (!resumeData || !companyName.trim()) {
      alert('Please enter a company name');
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.post(API_ENDPOINTS.SAVE_VERSION, {
        companyName: companyName.trim(),
        sections: resumeData.sections
      });

      if (response.data.success) {
        alert('Version saved successfully!');
        setCompanyName('');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save version. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: 'word' | 'pdf') => {
    if (!resumeData || !companyName.trim()) {
      alert('Please enter a company name for export');
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS[format === 'word' ? 'EXPORT_WORD' : 'EXPORT_PDF'], {
        sections: resumeData.sections,
        companyName: companyName.trim()
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Resume_${companyName.replace(/\s+/g, '_')}.${format === 'word' ? 'docx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export resume. Please try again.');
    }
  };

  // AI Enhancement handlers
  const handleStartAIEnhancement = async () => {
    if (!resumeData || !canStartEnhancement) return;

    try {
      await startEnhancement(resumeData.sections);
      setShowSuggestions(true);
    } catch (error) {
      console.error('AI enhancement error:', error);
    }
  };

  const handleApplyAISuggestions = async (suggestionIds: string[]) => {
    if (!suggestions) return;

    setIsApplyingSuggestions(true);
    try {
      await applySuggestions(suggestionIds);
      
      // Apply suggestions to local state
      const updatedSections = { ...resumeData!.sections };
      
      if (suggestions.personalSummary && suggestionIds.includes(suggestions.personalSummary.id)) {
        updatedSections.personalSummary = suggestions.personalSummary.enhanced;
      }

      suggestions.workExperience.forEach(suggestion => {
        if (suggestionIds.includes(suggestion.id)) {
          const workExp = updatedSections.workExperience[suggestion.bulletIndex];
          if (workExp) {
            workExp.bullets[suggestion.bulletIndex] = suggestion.enhanced;
          }
        }
      });

      suggestions.projects.forEach(suggestion => {
        if (suggestionIds.includes(suggestion.id)) {
          const project = updatedSections.projects[suggestion.bulletIndex];
          if (project) {
            project.bullets[suggestion.bulletIndex] = suggestion.enhanced;
          }
        }
      });

      setResumeData(prev => prev ? { ...prev, sections: updatedSections } : null);
      setShowSuggestions(false);
      clearSuggestions();
    } catch (error) {
      console.error('Error applying suggestions:', error);
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
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading resume data...</p>
      </div>
    );
  }

  return (
    <div className="resume-editor">
      <div className="editor-header">
        <h1>Resume Editor</h1>
        <div className="company-input">
          <input
            type="text"
            placeholder="Enter company name (e.g., Google, Microsoft)"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="company-name-input"
          />
          {resumeData?.companyName && (
            <div className="version-indicator">
              📋 Loaded version for: <strong>{resumeData.companyName}</strong>
            </div>
          )}
        </div>
      </div>

      {/* AI Enhancement Section */}
      <div className="ai-enhancement-section">
        <JobDescriptionInput
          value={jobDescription}
          onChange={updateJobDescription}
          onClear={() => updateJobDescription('')}
          disabled={aiProcessing}
        />
        
        <AIEnhancementToggle
          isEnabled={aiEnabled}
          onToggle={toggleAIEnhancement}
          isProcessing={aiProcessing}
          hasJobDescription={hasJobDescription}
          disabled={aiProcessing}
        />

        {aiEnabled && hasJobDescription && !aiProcessing && !hasSuggestions && (
          <div className="ai-action-buttons">
            <button
              onClick={handleStartAIEnhancement}
              className="ai-enhance-button"
            >
              🤖 Start AI Enhancement
            </button>
            <div className="ai-help-text">
              <span className="help-icon">💡</span>
              <span>AI will analyze your job description and enhance your resume content</span>
            </div>
          </div>
        )}

        {!aiEnabled && hasJobDescription && (
          <div className="ai-prompt">
            <div className="prompt-content">
              <span className="prompt-icon">🚀</span>
              <span>Ready for AI enhancement! Enable the toggle above to get started.</span>
            </div>
          </div>
        )}

        {aiEnabled && !hasJobDescription && (
          <div className="ai-prompt">
            <div className="prompt-content">
              <span className="prompt-icon">📝</span>
              <span>Add a job description above to enable AI enhancement.</span>
            </div>
          </div>
        )}

        {hasError && (
          <div className="ai-error">
            <span className="error-icon">❌</span>
            <span className="error-message">{aiError}</span>
            <button onClick={clearError} className="error-dismiss">✕</button>
          </div>
        )}

        {/* Development test button - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="dev-test-section">
            <button
              onClick={() => {
                updateJobDescription("Software Engineer position requiring React, Node.js, and JavaScript skills. Looking for someone with experience in web development, API design, and team collaboration.");
                toggleAIEnhancement(true);
              }}
              className="dev-test-button"
            >
              🧪 Fill Test Data
            </button>
          </div>
        )}
      </div>

      <div className="editor-content">
        <div className="sections">
          <SectionEditor
            title="Personal Summary"
            content={resumeData.sections.personalSummary}
            onUpdate={(content) => handleSectionUpdate('personalSummary', content)}
            type="text"
          />

          <SectionEditor
            title="Work Experience"
            content={resumeData.sections.workExperience}
            onUpdate={(content) => handleSectionUpdate('workExperience', content)}
            type="experience"
          />

          <SectionEditor
            title="Projects"
            content={resumeData.sections.projects}
            onUpdate={(content) => handleSectionUpdate('projects', content)}
            type="projects"
          />
        </div>

        <div className="actions">
          <ExportButtons
            onSave={handleSaveVersion}
            onExportWord={() => handleExport('word')}
            onExportPDF={() => handleExport('pdf')}
            isSaving={isSaving}
            companyName={companyName}
          />
        </div>
      </div>

      {/* AI Processing Indicator */}
      <AIProcessingIndicator
        isVisible={aiProcessing}
        onComplete={() => setShowSuggestions(true)}
        onCancel={() => {
          // Cancel AI processing
          clearSuggestions();
        }}
      />

      {/* AI Suggestions Review Modal */}
      {showSuggestions && suggestions && (
        <div className="ai-suggestions-modal">
          <div className="modal-overlay" onClick={handleCancelAISuggestions} />
          <div className="modal-content">
            <AISuggestionsReview
              suggestions={suggestions}
              onApplySuggestions={handleApplyAISuggestions}
              onCancel={handleCancelAISuggestions}
              isApplying={isApplyingSuggestions}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeEditor;
