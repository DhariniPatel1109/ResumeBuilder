/**
 * Custom hook for managing resume data state and operations
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { ResumeData } from '../types';

export const useResumeData = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Load resume data from session storage
  useEffect(() => {
    const storedData = sessionStorage.getItem('resumeData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log('📋 Loaded resume data:', parsedData);
        
        // Validate and normalize the data structure
        const normalizedData: ResumeData = {
          sections: {
            personalSummary: parsedData.sections?.personalSummary || parsedData.personalSummary || '',
            workExperience: parsedData.sections?.workExperience || parsedData.workExperience || [],
            projects: parsedData.sections?.projects || parsedData.projects || [],
            ...parsedData.sections // Include any dynamic sections
          },
          originalText: parsedData.originalText || '',
          companyName: parsedData.companyName,
          originalDocument: parsedData.originalDocument
        };

        console.log('📋 Normalized resume data:', normalizedData);
        setResumeData(normalizedData);

        // Load company name if it exists (for loaded versions)
        if (parsedData.companyName) {
          setCompanyName(parsedData.companyName);
          console.log('📋 Loaded version for company:', parsedData.companyName);
        }
      } catch (error) {
        console.error('❌ Error parsing resume data:', error);
        alert('Error loading resume data. Please try uploading again.');
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Update a specific section
  const updateSection = (sectionType: string, data: any) => {
    if (!resumeData) return;

    setResumeData({
      ...resumeData,
      sections: {
        ...resumeData.sections,
        [sectionType]: data
      }
    });
  };

  // Update a dynamic section
  const updateDynamicSection = (sectionName: string, content: any) => {
    if (!resumeData) return;

    setResumeData({
      ...resumeData,
      sections: {
        ...resumeData.sections,
        [sectionName]: content
      }
    });
  };

  // Save version
  const saveVersion = async () => {
    if (!resumeData || !companyName.trim()) {
      alert('Please enter a company name');
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.post(API_ENDPOINTS.SAVE_VERSION, {
        companyName: companyName.trim(),
        sections: resumeData.sections,
        originalDocument: resumeData.originalDocument
      });

      if (response.data.success) {
        alert('Version saved successfully!');
        console.log('✅ Version saved:', response.data);
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
      const response = await axios.post(API_ENDPOINTS[format === 'word' ? 'EXPORT_WORD' : 'EXPORT_PDF'], {
        sections: resumeData.sections,
        companyName: companyName.trim() || 'Resume',
        originalDocument: resumeData.originalDocument
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${companyName.trim() || 'Resume'}_Resume.${format === 'word' ? 'docx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
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
