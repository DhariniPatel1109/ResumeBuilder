import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SectionEditor from '../components/SectionEditor';
import ExportButtons from '../components/ExportButtons';
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
}

const ResumeEditor: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = sessionStorage.getItem('resumeData');
    if (storedData) {
      setResumeData(JSON.parse(storedData));
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
      const response = await axios.post('http://localhost:5000/api/save-version', {
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
      const response = await axios.post(`http://localhost:5000/api/export/${format}`, {
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
        </div>
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
    </div>
  );
};

export default ResumeEditor;
