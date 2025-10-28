/**
 * Resume Editor Page - Modern, Enhanced UI/UX
 */

import React, { useState, useEffect } from 'react';
import { useResumeData } from '../hooks/useResumeData';
import AIEnhancementPopup from '../components/ai/AIEnhancementPopup';
import DynamicResumeRenderer from '../components/ai/DynamicResumeRenderer';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ResumeService } from '../services';
import { 
  FileText, 
  Briefcase, 
  Wrench, 
  GraduationCap, 
  Zap, 
  Eye, 
  Edit3, 
  FileDown, 
  Save, 
  Plus, 
  Trash2, 
  Bot, 
  Lightbulb, 
  Loader2,
  Menu,
  X
} from 'lucide-react';

const ResumeEditor: React.FC = () => {
  // Resume data management
  const {
    resumeData,
    companyName,
    setCompanyName,
    isSaving,
    updateSection,
    updateDynamicSection,
    saveVersion,
    exportResume
  } = useResumeData();

  // AI Enhancement
  const [showAIPopup, setShowAIPopup] = useState(false);

  // UI State
  const [activeSection, setActiveSection] = useState<string>('personalSummary');
  const [showPreview, setShowPreview] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [workExpViewMode, setWorkExpViewMode] = useState<'form' | 'text'>('form');
  const [projectsViewMode, setProjectsViewMode] = useState<'form' | 'text'>('form');

  // Section definitions
  const sections = [
    { id: 'personalSummary', title: 'Personal Summary', icon: FileText, color: 'blue' },
    { id: 'workExperience', title: 'Work Experience', icon: Briefcase, color: 'green' },
    { id: 'projects', title: 'Projects', icon: Wrench, color: 'purple' },
    { id: 'education', title: 'Education', icon: GraduationCap, color: 'orange' },
    { id: 'skills', title: 'Skills', icon: Zap, color: 'pink' },
  ];

  // AI Enhancement handlers
  const handleApplyAISuggestions = (suggestions: any[]) => {
    // Apply AI suggestions to resume data
    suggestions.forEach(suggestion => {
      if (suggestion.type === 'personalSummary') {
        updateSection('personalSummary', suggestion.enhanced);
      } else if (suggestion.type === 'workExperience') {
        // Apply work experience suggestions
        const currentWorkExp = resumeData?.sections?.workExperience || [];
        const updatedWorkExp = currentWorkExp.map((exp: any, index: number) => {
          if (index === suggestion.workExperienceIndex) {
            const updatedBullets = [...exp.bullets];
            updatedBullets[suggestion.bulletIndex] = suggestion.enhanced;
            return { ...exp, bullets: updatedBullets };
          }
          return exp;
        });
        updateSection('workExperience', updatedWorkExp);
      } else if (suggestion.type === 'projects') {
        // Apply project suggestions
        const currentProjects = resumeData?.sections?.projects || [];
        const updatedProjects = currentProjects.map((project: any, index: number) => {
          if (index === suggestion.projectIndex) {
            const updatedBullets = [...project.bullets];
            updatedBullets[suggestion.bulletIndex] = suggestion.enhanced;
            return { ...project, bullets: updatedBullets };
          }
          return project;
        });
        updateSection('projects', updatedProjects);
      }
    });
  };

  // Company name modal state
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'save' | 'export' | null>(null);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | null>(null);
  const [tempCompanyName, setTempCompanyName] = useState('');

  // Company name handlers
  const handleSaveWithCompany = async () => {
    if (!companyName.trim()) {
      setPendingAction('save');
      setTempCompanyName('');
      setShowCompanyModal(true);
      return;
    }
    await saveVersion();
  };

  const handleExportWithCompany = async (format: 'pdf' | 'word') => {
    if (!companyName.trim()) {
      setPendingAction('export');
      setExportFormat(format);
      setTempCompanyName('');
      setShowCompanyModal(true);
      return;
    }
    await exportResume(format);
  };

  const handleCompanySubmit = async () => {
    if (!tempCompanyName.trim()) return;
    
    setCompanyName(tempCompanyName.trim());
    setShowCompanyModal(false);
    
    if (pendingAction === 'save') {
      await saveVersion();
    } else if (pendingAction === 'export' && exportFormat) {
      await exportResume(exportFormat);
    }
    
    setPendingAction(null);
    setExportFormat(null);
    setTempCompanyName('');
  };


  // Helper functions for text area conversion
  const convertWorkExpToText = (experiences: any[]) => {
    return experiences.map(exp => {
      const bullets = exp.bullets ? exp.bullets.join('\n') : '';
      return `[${exp.company || 'Company'}] ${exp.title || 'Title'} (${exp.duration || 'Duration'})\n${bullets}`;
    }).join('\n\n');
  };

  const convertTextToWorkExp = (text: string) => {
    const entries = text.split('\n\n').filter(entry => entry.trim());
    return entries.map(entry => {
      const lines = entry.split('\n');
      const headerLine = lines[0];
      const bullets = lines.slice(1).filter(line => line.trim());
      
      const companyMatch = headerLine.match(/^\[([^\]]+)\]/);
      const titleMatch = headerLine.match(/\]\s*([^(]+)/);
      const durationMatch = headerLine.match(/\(([^)]+)\)/);
      
      return {
        company: companyMatch ? companyMatch[1].trim() : '',
        title: titleMatch ? titleMatch[1].trim() : '',
        duration: durationMatch ? durationMatch[1].trim() : '',
        bullets: bullets
      };
    });
  };

  const convertProjectsToText = (projects: any[]) => {
    return projects.map(project => {
      const bullets = project.bullets ? project.bullets.join('\n') : '';
      return `[${project.name || 'Project Name'}] ${project.description || 'Description'}\n${bullets}`;
    }).join('\n\n');
  };

  const convertTextToProjects = (text: string) => {
    const entries = text.split('\n\n').filter(entry => entry.trim());
    return entries.map(entry => {
      const lines = entry.split('\n');
      const headerLine = lines[0];
      const bullets = lines.slice(1).filter(line => line.trim());
      
      const nameMatch = headerLine.match(/^\[([^\]]+)\]/);
      const descriptionMatch = headerLine.match(/\]\s*(.+)/);
      
      return {
        name: nameMatch ? nameMatch[1].trim() : '',
        description: descriptionMatch ? descriptionMatch[1].trim() : '',
        bullets: bullets
      };
    });
  };

  // Auto-save functionality
  useEffect(() => {
    if (resumeData) {
      ResumeService.saveResumeToStorage(resumeData);
    }
  }, [resumeData]);

  if (!resumeData) {
    return (
      <PageLayout title="Loading...">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 dark:border-primary-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading resume data...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className={`flex h-[calc(100vh-60px)] ${sidebarCollapsed ? 'gap-2' : 'gap-6'}`}>
        {/* Sidebar Navigation */}
        <div className={`${sidebarCollapsed ? 'w-24' : 'w-80'} transition-all duration-300 flex-shrink-0`}>
          <Card variant="elevated" className="h-full flex flex-col p-2 bg-white dark:bg-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold text-gray-900 dark:text-white ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                  Resume Sections
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2"
                >
                  {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-3'} rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? `bg-${section.color}-100 dark:bg-${section.color}-900/30 text-${section.color}-700 dark:text-${section.color}-300 border border-${section.color}-200 dark:border-${section.color}-700`
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    title={sidebarCollapsed ? section.title : undefined}
                  >
                    <IconComponent className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                    {!sidebarCollapsed && (
                      <span className="font-medium">{section.title}</span>
                    )}
                  </button>
                );
              })}

              {/* AI Enhancement Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAIPopup(true)}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-2' : 'gap-2'}`}
                  title={sidebarCollapsed ? "AI Enhance" : undefined}
                >
                  <Bot className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-4 h-4'}`} />
                  {!sidebarCollapsed && "AI Enhance"}
                </Button>
              </div>

              {/* Action Buttons */}
              <div className={`pt-4 border-t border-gray-200 dark:border-gray-700 mt-4 ${sidebarCollapsed ? 'space-y-3' : 'space-y-2'}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-3 h-10' : 'gap-2'}`}
                  title={sidebarCollapsed ? (showPreview ? 'Switch to Edit Mode' : 'Switch to Preview Mode') : undefined}
                >
                  {showPreview ? <Edit3 className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-4 h-4'}`} /> : <Eye className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-4 h-4'}`} />}
                  {!sidebarCollapsed && (showPreview ? 'Edit Mode' : 'Preview Mode')}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportWithCompany('pdf')}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-3 h-10' : 'gap-2'}`}
                  title={sidebarCollapsed ? "Export as PDF" : undefined}
                >
                  <FileDown className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-4 h-4'}`} />
                  {!sidebarCollapsed && "Export PDF"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportWithCompany('word')}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-3 h-10' : 'gap-2'}`}
                  title={sidebarCollapsed ? "Export as Word" : undefined}
                >
                  <FileText className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-4 h-4'}`} />
                  {!sidebarCollapsed && "Export Word"}
                </Button>
                
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSaveWithCompany()}
                  loading={isSaving}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-3 h-10' : 'gap-2'}`}
                  title={sidebarCollapsed ? "Save Current Version" : undefined}
                >
                  {isSaving ? <Loader2 className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-4 h-4'} animate-spin`} /> : <Save className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-4 h-4'}`} />}
                  {!sidebarCollapsed && (isSaving ? 'Saving...' : 'Save Version')}
                </Button>
              </div>

            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* Content Area */}
          <div className="flex-1 flex gap-6">
            {/* Editor Panel */}
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} transition-all duration-300 min-h-0`}>
              <Card variant="elevated" padding="lg" className="h-full flex flex-col bg-white dark:bg-gray-800">
                <div className="flex-1 overflow-y-auto">
                  {/* Section Content will go here */}
                  <div className="space-y-6">
                    {activeSection === 'personalSummary' && (
                      <div>
                        <textarea
                          value={resumeData.sections?.personalSummary || ''}
                          onChange={(e) => updateSection('personalSummary', e.target.value)}
                          className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white resize-none"
                          rows={6}
                          placeholder="Write a compelling personal summary that highlights your key strengths and career objectives..."
                        />
                      </div>
                    )}

                    {activeSection === 'workExperience' && (
                      <div className="space-y-6">
                        {/* Header with View Toggle */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                              <button
                                onClick={() => setWorkExpViewMode('form')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                                  workExpViewMode === 'form'
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                              >
                                <FileText className="w-4 h-4" />
                                Form View
                              </button>
                              <button
                                onClick={() => setWorkExpViewMode('text')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                                  workExpViewMode === 'text'
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                              >
                                <Edit3 className="w-4 h-4" />
                                Text View
                              </button>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newExp = {
                                title: '',
                                company: '',
                                duration: '',
                                bullets: ['']
                              };
                              updateSection('workExperience', [...(resumeData.sections?.workExperience || []), newExp]);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Experience
                          </Button>
                        </div>

                        {/* Form View */}
                        {workExpViewMode === 'form' && (
                          <div className="space-y-4">
                            {(resumeData.sections?.workExperience || []).map((exp: any, index: number) => (
                              <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                          Job Title
                                        </label>
                                        <Input
                                          placeholder="e.g., Senior Software Engineer"
                                          value={exp.title || ''}
                                          onChange={(e) => {
                                            const updated = [...(resumeData.sections?.workExperience || [])];
                                            updated[index] = { ...updated[index], title: e.target.value };
                                            updateSection('workExperience', updated);
                                          }}
                                          className="bg-white dark:bg-gray-800"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                          Company
                                        </label>
                                        <Input
                                          placeholder="e.g., Google, Microsoft"
                                          value={exp.company || ''}
                                          onChange={(e) => {
                                            const updated = [...(resumeData.sections?.workExperience || [])];
                                            updated[index] = { ...updated[index], company: e.target.value };
                                            updateSection('workExperience', updated);
                                          }}
                                          className="bg-white dark:bg-gray-800"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                          Duration
                                        </label>
                                        <Input
                                          placeholder="e.g., Jan 2020 - Present"
                                          value={exp.duration || ''}
                                          onChange={(e) => {
                                            const updated = [...(resumeData.sections?.workExperience || [])];
                                            updated[index] = { ...updated[index], duration: e.target.value };
                                            updateSection('workExperience', updated);
                                          }}
                                          className="bg-white dark:bg-gray-800"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Key Achievements
                                      </label>
                                      {(exp.bullets || []).map((bullet: string, bulletIndex: number) => (
                                        <div key={bulletIndex} className="flex gap-2 items-start">
                                          <span className="text-green-600 dark:text-green-400 mt-2 text-sm">•</span>
                                          <Input
                                            placeholder="Describe your achievement or responsibility..."
                                            value={bullet}
                                            onChange={(e) => {
                                              const updated = [...(resumeData.sections?.workExperience || [])];
                                              updated[index].bullets[bulletIndex] = e.target.value;
                                              updateSection('workExperience', updated);
                                            }}
                                            className="flex-1 bg-white dark:bg-gray-800"
                                          />
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                              const updated = [...(resumeData.sections?.workExperience || [])];
                                              updated[index].bullets.splice(bulletIndex, 1);
                                              updateSection('workExperience', updated);
                                            }}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 p-2"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      ))}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const updated = [...(resumeData.sections?.workExperience || [])];
                                          updated[index].bullets.push('');
                                          updateSection('workExperience', updated);
                                        }}
                                        className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Achievement
                                      </Button>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updated = [...(resumeData.sections?.workExperience || [])];
                                      updated.splice(index, 1);
                                      updateSection('workExperience', updated);
                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Text View */}
                        {workExpViewMode === 'text' && (
                          <div className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div className="text-sm text-blue-800 dark:text-blue-200">
                                  <p className="font-medium mb-1">Quick Format:</p>
                                  <p className="mb-2">[Company Name] Job Title (Duration)</p>
                                  <p className="mb-1">• First achievement or responsibility</p>
                                  <p className="mb-1">• Second achievement or responsibility</p>
                                  <p className="text-xs mt-2">Separate different jobs with empty lines</p>
                                </div>
                              </div>
                            </div>
                            
                            <textarea
                              value={convertWorkExpToText(resumeData.sections?.workExperience || [])}
                              onChange={(e) => {
                                const experiences = convertTextToWorkExp(e.target.value);
                                updateSection('workExperience', experiences);
                              }}
                              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white resize-none font-mono text-sm"
                              rows={15}
                              placeholder="[Google] Senior Software Engineer (Jan 2020 - Present)&#10;• Led development of scalable microservices architecture&#10;• Improved system performance by 40% through optimization&#10;• Mentored 3 junior developers and conducted code reviews&#10;&#10;[Microsoft] Software Engineer (Jun 2018 - Dec 2019)&#10;• Developed RESTful APIs serving 1M+ daily requests&#10;• Implemented automated testing reducing bugs by 60%&#10;• Collaborated with cross-functional teams on product features"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {activeSection === 'projects' && (
                      <div className="space-y-6">
                        {/* Header with View Toggle */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                              <button
                                onClick={() => setProjectsViewMode('form')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                                  projectsViewMode === 'form'
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                              >
                                <FileText className="w-4 h-4" />
                                Form View
                              </button>
                              <button
                                onClick={() => setProjectsViewMode('text')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                                  projectsViewMode === 'text'
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                              >
                                <Edit3 className="w-4 h-4" />
                                Text View
                              </button>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newProject = {
                                name: '',
                                description: '',
                                bullets: ['']
                              };
                              updateSection('projects', [...(resumeData.sections?.projects || []), newProject]);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Project
                          </Button>
                        </div>

                        {/* Form View */}
                        {projectsViewMode === 'form' && (
                          <div className="space-y-4">
                            {(resumeData.sections?.projects || []).map((project: any, index: number) => (
                              <div key={index} className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Project Name
                                      </label>
                                      <Input
                                        placeholder="e.g., E-commerce Platform, Mobile App"
                                        value={project.name || ''}
                                        onChange={(e) => {
                                          const updated = [...(resumeData.sections?.projects || [])];
                                          updated[index] = { ...updated[index], name: e.target.value };
                                          updateSection('projects', updated);
                                        }}
                                        className="bg-white dark:bg-gray-800 text-lg font-semibold"
                                      />
                                    </div>
                                    
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                      </label>
                                      <textarea
                                        value={project.description || ''}
                                        onChange={(e) => {
                                          const updated = [...(resumeData.sections?.projects || [])];
                                          updated[index] = { ...updated[index], description: e.target.value };
                                          updateSection('projects', updated);
                                        }}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white resize-none bg-white"
                                        rows={3}
                                        placeholder="Brief description of the project, technologies used, and your role..."
                                      />
                                    </div>
                                    
                                    <div className="space-y-3">
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Key Achievements
                                      </label>
                                      {(project.bullets || []).map((bullet: string, bulletIndex: number) => (
                                        <div key={bulletIndex} className="flex gap-2 items-start">
                                          <span className="text-purple-600 dark:text-purple-400 mt-2 text-sm">•</span>
                                          <Input
                                            placeholder="Describe what you accomplished or built..."
                                            value={bullet}
                                            onChange={(e) => {
                                              const updated = [...(resumeData.sections?.projects || [])];
                                              updated[index].bullets[bulletIndex] = e.target.value;
                                              updateSection('projects', updated);
                                            }}
                                            className="flex-1 bg-white dark:bg-gray-800"
                                          />
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                              const updated = [...(resumeData.sections?.projects || [])];
                                              updated[index].bullets.splice(bulletIndex, 1);
                                              updateSection('projects', updated);
                                            }}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 p-2"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      ))}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const updated = [...(resumeData.sections?.projects || [])];
                                          updated[index].bullets.push('');
                                          updateSection('projects', updated);
                                        }}
                                        className="flex items-center gap-2 text-purple-600 border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-300"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add Achievement
                                      </Button>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updated = [...(resumeData.sections?.projects || [])];
                                      updated.splice(index, 1);
                                      updateSection('projects', updated);
                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Text View */}
                        {projectsViewMode === 'text' && (
                          <div className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div className="text-sm text-blue-800 dark:text-blue-200">
                                  <p className="font-medium mb-1">Quick Format:</p>
                                  <p className="mb-2">[Project Name] Brief description</p>
                                  <p className="mb-1">• First accomplishment or feature</p>
                                  <p className="mb-1">• Second accomplishment or feature</p>
                                  <p className="text-xs mt-2">Separate different projects with empty lines</p>
                                </div>
                              </div>
                            </div>
                            
                            <textarea
                              value={convertProjectsToText(resumeData.sections?.projects || [])}
                              onChange={(e) => {
                                const projects = convertTextToProjects(e.target.value);
                                updateSection('projects', projects);
                              }}
                              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white resize-none font-mono text-sm"
                              rows={15}
                              placeholder="[E-commerce Platform] Full-stack web application built with React and Node.js&#10;• Implemented secure payment processing with Stripe API&#10;• Built responsive UI with 95% mobile compatibility&#10;• Deployed on AWS with CI/CD pipeline reducing deployment time by 70%&#10;&#10;[Mobile Weather App] Cross-platform mobile app using React Native&#10;• Integrated with OpenWeather API for real-time data&#10;• Implemented offline caching for better user experience&#10;• Achieved 4.8/5 rating on app stores with 10K+ downloads"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {activeSection === 'education' && (
                      <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newEducation = {
                                degree: '',
                                institution: '',
                                year: '',
                                gpa: ''
                              };
                              updateSection('education', [...(resumeData.sections?.education || []), newEducation]);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Education
                          </Button>
                        </div>

                        {/* Education Entries */}
                        <div className="space-y-4">
                          {(resumeData.sections?.education || []).map((edu: any, index: number) => (
                            <div key={index} className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Degree
                                      </label>
                                      <Input
                                        placeholder="e.g., Bachelor of Science in Computer Science"
                                        value={edu.degree || ''}
                                        onChange={(e) => {
                                          const updated = [...(resumeData.sections?.education || [])];
                                          updated[index] = { ...updated[index], degree: e.target.value };
                                          updateSection('education', updated);
                                        }}
                                        className="bg-white dark:bg-gray-800"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Institution
                                      </label>
                                      <Input
                                        placeholder="e.g., Stanford University, MIT"
                                        value={edu.institution || ''}
                                        onChange={(e) => {
                                          const updated = [...(resumeData.sections?.education || [])];
                                          updated[index] = { ...updated[index], institution: e.target.value };
                                          updateSection('education', updated);
                                        }}
                                        className="bg-white dark:bg-gray-800"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Year
                                      </label>
                                      <Input
                                        placeholder="e.g., 2020, 2018-2022"
                                        value={edu.year || ''}
                                        onChange={(e) => {
                                          const updated = [...(resumeData.sections?.education || [])];
                                          updated[index] = { ...updated[index], year: e.target.value };
                                          updateSection('education', updated);
                                        }}
                                        className="bg-white dark:bg-gray-800"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        GPA (Optional)
                                      </label>
                                      <Input
                                        placeholder="e.g., 3.8/4.0, Magna Cum Laude"
                                        value={edu.gpa || ''}
                                        onChange={(e) => {
                                          const updated = [...(resumeData.sections?.education || [])];
                                          updated[index] = { ...updated[index], gpa: e.target.value };
                                          updateSection('education', updated);
                                        }}
                                        className="bg-white dark:bg-gray-800"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updated = [...(resumeData.sections?.education || [])];
                                    updated.splice(index, 1);
                                    updateSection('education', updated);
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Help Text */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                              <p className="font-medium mb-1">Education Tips:</p>
                              <ul className="space-y-1 text-xs">
                                <li>• Include your highest degree first</li>
                                <li>• Add relevant coursework or honors if applicable</li>
                                <li>• Include graduation year or expected graduation date</li>
                                <li>• Only include GPA if it's 3.5 or higher</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSection === 'skills' && (
                      <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                          </div>
                        </div>

                        {/* Skills Input */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Technical Skills
                            </label>
                            <textarea
                              value={(resumeData.sections?.skills || []).join(', ')}
                              onChange={(e) => {
                                const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                                updateSection('skills', skills);
                              }}
                              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800 dark:text-white resize-none bg-white"
                              rows={6}
                              placeholder="JavaScript, React, Node.js, Python, Machine Learning, AWS, Docker, Git, SQL, MongoDB, TypeScript, GraphQL, REST APIs, Agile, Scrum..."
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                              <Lightbulb className="w-4 h-4" />
                              Separate multiple skills with commas. Include programming languages, frameworks, tools, and methodologies.
                            </p>
                          </div>

                          {/* Skills Preview */}
                          {(resumeData.sections?.skills || []).length > 0 && (
                            <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Skills Preview:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {(resumeData.sections?.skills || []).map((skill: string, index: number) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Skills Tips */}
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                              <div className="text-sm text-blue-800 dark:text-blue-200">
                                <p className="font-medium mb-2">Skills Tips:</p>
                                <ul className="space-y-1 text-xs">
                                  <li>• <strong>Programming Languages:</strong> JavaScript, Python, Java, C++, Go</li>
                                  <li>• <strong>Frameworks:</strong> React, Angular, Vue.js, Django, Spring</li>
                                  <li>• <strong>Tools:</strong> Git, Docker, AWS, Jenkins, Kubernetes</li>
                                  <li>• <strong>Databases:</strong> MySQL, PostgreSQL, MongoDB, Redis</li>
                                  <li>• <strong>Soft Skills:</strong> Leadership, Communication, Problem Solving</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Dynamic Sections - AI-Detected Additional Sections */}
            <div className="mt-6">
              <DynamicResumeRenderer
                sections={resumeData?.sections || {}}
                onUpdate={(sectionKey, content) => {
                  updateDynamicSection(sectionKey, content);
                }}
                onDelete={(sectionKey) => {
                  if (resumeData) {
                    const updatedSections = { ...resumeData.sections };
                    delete updatedSections[sectionKey];
                    updateSection('sections', updatedSections);
                  }
                }}
                isEditing={true}
              />
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div className="w-1/2">
                <Card variant="elevated" padding="lg" className="h-full bg-white dark:bg-gray-800">
                  <div className="h-full overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Live Preview
                    </h3>
                    <div className="prose dark:prose-invert max-w-none">
                      {/* Preview content will go here */}
                      <p className="text-gray-600 dark:text-gray-400">
                        Preview will be implemented here...
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Enhancement Popup */}
      <AIEnhancementPopup
        isOpen={showAIPopup}
        onClose={() => setShowAIPopup(false)}
        resumeData={resumeData}
        onApplySuggestions={handleApplyAISuggestions}
      />

      {/* Company Name Modal */}
      {showCompanyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {pendingAction === 'save' ? 'Save Version' : `Export ${exportFormat?.toUpperCase()}`}
              </h3>
              <button
                onClick={() => setShowCompanyModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name
              </label>
              <Input
                value={tempCompanyName}
                onChange={(e) => setTempCompanyName(e.target.value)}
                placeholder="Enter company name..."
                className="w-full"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCompanySubmit();
                  }
                }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This will be used for the {pendingAction === 'save' ? 'version name' : 'file name'}
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCompanyModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCompanySubmit}
                disabled={!tempCompanyName.trim()}
              >
                {pendingAction === 'save' ? 'Save Version' : `Export ${exportFormat?.toUpperCase()}`}
              </Button>
            </div>
          </div>
        </div>
      )}

    </PageLayout>
  );
};

export default ResumeEditor;