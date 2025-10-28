/**
 * Resume Template Generator Component
 * Provides a form-based interface for generating resumes from templates
 */

import React, { useState, useEffect } from 'react';
import { TemplateService, ResumeData } from '../../services/templateService';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  FileText, 
  Plus, 
  Trash2, 
  Download,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

interface ResumeTemplateGeneratorProps {
  onGenerate?: (resumeData: ResumeData) => void;
}

const ResumeTemplateGenerator: React.FC<ResumeTemplateGeneratorProps> = ({ onGenerate }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(TemplateService.createSampleResumeData());
  const [templates, setTemplates] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; details?: string[] } | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await TemplateService.getTemplates();
      if (response.success && response.data) {
        setTemplates(response.data.templates);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleInputChange = (section: string, field: string, value: any, index?: number) => {
    setResumeData(prev => {
      const newData = { ...prev };
      
      if (index !== undefined) {
        // Handle array fields
        if (section === 'experience' || section === 'education' || section === 'projects') {
          newData[section as keyof ResumeData] = [
            ...(newData[section as keyof ResumeData] as any[]).slice(0, index),
            { ...(newData[section as keyof ResumeData] as any[])[index], [field]: value },
            ...(newData[section as keyof ResumeData] as any[]).slice(index + 1)
          ] as any;
        }
      } else {
        // Handle object fields
        if (section === 'personalInfo') {
          newData.personalInfo = { ...newData.personalInfo, [field]: value };
        } else if (section === 'summary') {
          newData.summary = value;
        } else if (section === 'skills') {
          newData.skills = value.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }
      
      return newData;
    });
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        duration: '',
        location: '',
        bullets: ['']
      }]
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        duration: '',
        location: '',
        gpa: ''
      }]
    }));
  };

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), {
        name: '',
        description: '',
        technologies: [],
        link: ''
      }]
    }));
  };

  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects?.filter((_, i) => i !== index) || []
    }));
  };

  const addBulletPoint = (expIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex 
          ? { ...exp, bullets: [...exp.bullets, ''] }
          : exp
      )
    }));
  };

  const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex 
          ? { ...exp, bullets: exp.bullets.filter((_, bi) => bi !== bulletIndex) }
          : exp
      )
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const result = await TemplateService.generateResume({
        resumeData,
        templateName: selectedTemplate
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Resume generated and downloaded successfully!' });
        onGenerate?.(resumeData);
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Failed to generate resume',
          details: result.details
        });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card variant="elevated" padding="lg" className="bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Resume Template Generator
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Template:</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {templates.map(template => (
                <option key={template} value={template}>
                  {template.charAt(0).toUpperCase() + template.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Fill in your information below to generate a professional resume. All fields marked with * are required.
        </p>
      </Card>

      {/* Personal Information */}
      <Card variant="elevated" padding="lg" className="bg-white dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            value={resumeData.personalInfo.name}
            onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
            placeholder="John Doe"
          />
          <Input
            label="Email *"
            type="email"
            value={resumeData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            placeholder="john.doe@email.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <Input
            label="Phone *"
            value={resumeData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            placeholder="(555) 123-4567"
            leftIcon={<Phone className="w-4 h-4" />}
          />
          <Input
            label="Location *"
            value={resumeData.personalInfo.location}
            onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
            placeholder="San Francisco, CA"
            leftIcon={<MapPin className="w-4 h-4" />}
          />
          <Input
            label="LinkedIn (optional)"
            value={resumeData.personalInfo.linkedin || ''}
            onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
            placeholder="linkedin.com/in/johndoe"
            leftIcon={<Linkedin className="w-4 h-4" />}
          />
          <Input
            label="GitHub (optional)"
            value={resumeData.personalInfo.github || ''}
            onChange={(e) => handleInputChange('personalInfo', 'github', e.target.value)}
            placeholder="github.com/johndoe"
            leftIcon={<Github className="w-4 h-4" />}
          />
        </div>
      </Card>

      {/* Professional Summary */}
      <Card variant="elevated" padding="lg" className="bg-white dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Professional Summary *</h3>
        <textarea
          value={resumeData.summary}
          onChange={(e) => handleInputChange('summary', '', e.target.value)}
          placeholder="Write a brief summary of your professional background and key achievements..."
          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          rows={4}
        />
      </Card>

      {/* Work Experience */}
      <Card variant="elevated" padding="lg" className="bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Work Experience *</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addExperience}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </Button>
        </div>
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Experience #{index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(index)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Position *"
                value={exp.position}
                onChange={(e) => handleInputChange('experience', 'position', e.target.value, index)}
                placeholder="Senior Software Engineer"
              />
              <Input
                label="Company *"
                value={exp.company}
                onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                placeholder="Tech Corp"
              />
              <Input
                label="Duration *"
                value={exp.duration}
                onChange={(e) => handleInputChange('experience', 'duration', e.target.value, index)}
                placeholder="2020 - Present"
              />
              <Input
                label="Location *"
                value={exp.location}
                onChange={(e) => handleInputChange('experience', 'location', e.target.value, index)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Achievements *
              </label>
              {exp.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex items-center gap-2 mb-2">
                  <Input
                    value={bullet}
                    onChange={(e) => {
                      const newBullets = [...exp.bullets];
                      newBullets[bulletIndex] = e.target.value;
                      handleInputChange('experience', 'bullets', newBullets, index);
                    }}
                    placeholder="Describe a key achievement or responsibility..."
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBulletPoint(index, bulletIndex)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addBulletPoint(index)}
                className="mt-2 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Achievement
              </Button>
            </div>
          </div>
        ))}
      </Card>

      {/* Education */}
      <Card variant="elevated" padding="lg" className="bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Education *</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addEducation}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </Button>
        </div>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Education #{index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(index)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Degree *"
                value={edu.degree}
                onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                placeholder="Bachelor of Science in Computer Science"
              />
              <Input
                label="Institution *"
                value={edu.institution}
                onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
                placeholder="University of California, Berkeley"
              />
              <Input
                label="Duration *"
                value={edu.duration}
                onChange={(e) => handleInputChange('education', 'duration', e.target.value, index)}
                placeholder="2014 - 2018"
              />
              <Input
                label="Location *"
                value={edu.location}
                onChange={(e) => handleInputChange('education', 'location', e.target.value, index)}
                placeholder="Berkeley, CA"
              />
              <Input
                label="GPA (optional)"
                value={edu.gpa || ''}
                onChange={(e) => handleInputChange('education', 'gpa', e.target.value, index)}
                placeholder="3.8/4.0"
              />
            </div>
          </div>
        ))}
      </Card>

      {/* Skills */}
      <Card variant="elevated" padding="lg" className="bg-white dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Skills *</h3>
        <Input
          label="Technical Skills (comma-separated)"
          value={(() => {
            const skills = resumeData.skills;
            if (Array.isArray(skills)) {
              return skills.join(', ');
            } else if (typeof skills === 'string') {
              return skills;
            } else if (skills && typeof skills === 'object') {
              // If it's an object with nested categories, flatten all values
              const allSkills: string[] = [];
              Object.values(skills).forEach(category => {
                if (Array.isArray(category)) {
                  allSkills.push(...category);
                } else if (typeof category === 'string') {
                  allSkills.push(category);
                }
              });
              return allSkills.join(', ');
            }
            return '';
          })()}
          onChange={(e) => handleInputChange('skills', '', e.target.value)}
          placeholder="JavaScript, React, Node.js, Python, AWS, Docker"
          helperText="Separate multiple skills with commas"
        />
      </Card>

      {/* Projects */}
      <Card variant="elevated" padding="lg" className="bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Projects (optional)</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addProject}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        </div>
        {resumeData.projects?.map((project, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Project #{index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Project Name"
                value={project.name}
                onChange={(e) => {
                  const newProjects = [...(resumeData.projects || [])];
                  newProjects[index] = { ...project, name: e.target.value };
                  setResumeData(prev => ({ ...prev, projects: newProjects }));
                }}
                placeholder="E-commerce Platform"
              />
              <textarea
                value={project.description}
                onChange={(e) => {
                  const newProjects = [...(resumeData.projects || [])];
                  newProjects[index] = { ...project, description: e.target.value };
                  setResumeData(prev => ({ ...prev, projects: newProjects }));
                }}
                placeholder="Describe the project and your role..."
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                rows={3}
              />
              <Input
                label="Technologies (comma-separated)"
                value={(() => {
                  const technologies = project.technologies;
                  if (Array.isArray(technologies)) {
                    return technologies.join(', ');
                  } else if (typeof technologies === 'string') {
                    return technologies;
                  } else if (technologies && typeof technologies === 'object') {
                    // If it's an object, try to extract values
                    return Object.values(technologies).join(', ');
                  }
                  return '';
                })()}
                onChange={(e) => {
                  const newProjects = [...(resumeData.projects || [])];
                  newProjects[index] = { 
                    ...project, 
                    technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  };
                  setResumeData(prev => ({ ...prev, projects: newProjects }));
                }}
                placeholder="React, Node.js, MongoDB, Stripe API"
              />
              <Input
                label="Link (optional)"
                value={project.link || ''}
                onChange={(e) => {
                  const newProjects = [...(resumeData.projects || [])];
                  newProjects[index] = { ...project, link: e.target.value };
                  setResumeData(prev => ({ ...prev, projects: newProjects }));
                }}
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>
        ))}
      </Card>

      {/* Message Display */}
      {message && (
        <Card variant="elevated" padding="lg" className={`${
          message.type === 'success' 
            ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800' 
            : 'bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800'
        }`}>
          <div className="flex items-start gap-3">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-error-600 dark:text-error-400 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${
                message.type === 'success' 
                  ? 'text-success-800 dark:text-success-200' 
                  : 'text-error-800 dark:text-error-200'
              }`}>
                {message.text}
              </p>
              {message.details && message.details.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm text-error-700 dark:text-error-300">
                  {message.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Generate Button */}
      <Card variant="elevated" padding="lg" className="bg-white dark:bg-gray-800">
        <Button
          variant="primary"
          size="xl"
          fullWidth
          onClick={handleGenerate}
          loading={loading}
          disabled={loading}
          className="flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Resume...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Generate & Download Resume
            </>
          )}
        </Button>
      </Card>
    </div>
  );
};

export default ResumeTemplateGenerator;
