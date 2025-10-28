/**
 * Template Service
 * Client-side service for template-based resume generation
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5001';

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    location: string;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    duration: string;
    location: string;
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

export interface TemplateGenerationRequest {
  resumeData: ResumeData;
  templateName?: string;
}

export interface TemplateGenerationResponse {
  success: boolean;
  error?: string;
  details?: string[];
}

export interface TemplateValidationResponse {
  success: boolean;
  data: {
    valid: boolean;
    errors: string[];
  };
  error?: string;
}

export interface TemplatesResponse {
  success: boolean;
  data: {
    templates: string[];
  };
  error?: string;
}

export class TemplateService {
  /**
   * Generate resume from template
   */
  public static async generateResume(request: TemplateGenerationRequest): Promise<TemplateGenerationResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/template/generate`,
        request,
        {
          responseType: 'blob', // Important for downloading files
        }
      );

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Resume_${request.resumeData.personalInfo.name.replace(/\s+/g, '_')}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error: any) {
      console.error('Error generating resume from template:', error);
      
      // Attempt to parse error message from blob if available
      if (error.response && error.response.data instanceof Blob) {
        const errorText = await error.response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          return { 
            success: false, 
            error: errorJson.error || 'Failed to generate resume',
            details: errorJson.details
          };
        } catch (parseError) {
          return { success: false, error: errorText || 'Failed to generate resume' };
        }
      }
      
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Failed to generate resume'
      };
    }
  }

  /**
   * Get available templates
   */
  public static async getTemplates(): Promise<TemplatesResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/template/templates`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting templates:', error);
      return {
        success: false,
        data: { templates: [] },
        error: error.response?.data?.error || error.message || 'Failed to get templates'
      };
    }
  }

  /**
   * Validate resume data
   */
  public static async validateResumeData(resumeData: ResumeData): Promise<TemplateValidationResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/template/validate`, { resumeData });
      return response.data;
    } catch (error: any) {
      console.error('Error validating resume data:', error);
      return {
        success: false,
        data: { valid: false, errors: ['Validation failed'] },
        error: error.response?.data?.error || error.message || 'Failed to validate resume data'
      };
    }
  }

  /**
   * Create sample resume data for testing
   */
  public static createSampleResumeData(): ResumeData {
    return {
      personalInfo: {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "(555) 123-4567",
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
        location: "San Francisco, CA"
      },
      summary: "Experienced software engineer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading development teams.",
      experience: [
        {
          company: "Tech Corp",
          position: "Senior Software Engineer",
          duration: "2020 - Present",
          location: "San Francisco, CA",
          bullets: [
            "Led development of microservices architecture serving 1M+ users",
            "Improved application performance by 40% through code optimization",
            "Mentored 3 junior developers and conducted code reviews",
            "Implemented CI/CD pipelines reducing deployment time by 60%"
          ]
        },
        {
          company: "StartupXYZ",
          position: "Full Stack Developer",
          duration: "2018 - 2020",
          location: "San Francisco, CA",
          bullets: [
            "Built responsive web applications using React and Node.js",
            "Designed and implemented RESTful APIs",
            "Collaborated with product team to define technical requirements",
            "Reduced bug reports by 30% through comprehensive testing"
          ]
        }
      ],
      education: [
        {
          institution: "University of California, Berkeley",
          degree: "Bachelor of Science in Computer Science",
          duration: "2014 - 2018",
          location: "Berkeley, CA",
          gpa: "3.8/4.0"
        }
      ],
      skills: [
        "JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "MongoDB", "PostgreSQL", "Git"
      ],
      projects: [
        {
          name: "E-commerce Platform",
          description: "Built a full-stack e-commerce platform with payment integration, inventory management, and admin dashboard.",
          technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
          link: "https://github.com/johndoe/ecommerce-platform"
        },
        {
          name: "Task Management App",
          description: "Developed a collaborative task management application with real-time updates and team collaboration features.",
          technologies: ["React", "Socket.io", "Express", "PostgreSQL"]
        }
      ]
    };
  }
}
