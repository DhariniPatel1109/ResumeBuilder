/**
 * Custom hook for managing resume data state and operations
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResumeService, VersionService, ExportService, ResumeData } from '../services';

export const useResumeData = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Load resume data from session storage
  useEffect(() => {
    const loadedData = ResumeService.loadResumeFromStorage();
    if (loadedData) {
      setResumeData(loadedData);
      
      // Load company name if it exists (for loaded versions)
      if (loadedData.companyName) {
        setCompanyName(loadedData.companyName);
        console.log('📋 Loaded version for company:', loadedData.companyName);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Update a specific section
  const updateSection = (sectionType: string, data: any) => {
    if (!resumeData) return;
    const updatedData = ResumeService.updateSection(resumeData, sectionType, data);
    setResumeData(updatedData);
    ResumeService.saveResumeToStorage(updatedData);
  };

  // Update a dynamic section
  const updateDynamicSection = (sectionName: string, content: any) => {
    if (!resumeData) return;
    const updatedData = ResumeService.updateDynamicSection(resumeData, sectionName, content);
    setResumeData(updatedData);
    ResumeService.saveResumeToStorage(updatedData);
  };

  // Save version
  const saveVersion = async () => {
    if (!resumeData || !companyName.trim()) {
      alert('Please enter a company name');
      return;
    }

    setIsSaving(true);
    try {
      const response = await VersionService.saveVersion({
        companyName: companyName.trim(),
        sections: resumeData.sections,
        originalDocument: resumeData.originalDocument
      });

      if (response.success) {
        alert('Version saved successfully!');
        console.log('✅ Version saved:', response);
      } else {
        alert('Failed to save version');
      }
    } catch (error) {
      console.error('❌ Error saving version:', error);
      alert('Error saving version. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Export resume
  const exportResume = async (format: 'word' | 'pdf') => {
    if (!resumeData) return;

    try {
      await ExportService.exportResume(format, {
        sections: resumeData.sections,
        companyName: companyName.trim() || 'Resume',
        originalDocument: resumeData.originalDocument
      });
    } catch (error) {
      console.error(`❌ Error exporting ${format}:`, error);
      alert(`Error exporting ${format.toUpperCase()}. Please try again.`);
    }
  };

  return {
    resumeData,
    setResumeData,
    companyName,
    setCompanyName,
    isSaving,
    updateSection,
    updateDynamicSection,
    saveVersion,
    exportResume
  };
};
