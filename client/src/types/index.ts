// Shared types for the ResumeBuilder application

export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface Project {
  name: string;
  description: string;
  bullets: string[];
}

export interface DynamicSection {
  type: 'text' | 'experience' | 'projects' | 'list';
  content: any;
  originalHeader: string;
}

export interface ResumeSection {
  personalSummary: string;
  workExperience: WorkExperience[];
  projects: Project[];
  // Dynamic sections for flexible resume structures
  dynamicSections?: Record<string, DynamicSection>;
}

export interface ResumeData {
  sections: ResumeSection;
  originalText: string;
  companyName?: string;
}

export interface SavedVersion {
  id: string;
  companyName: string;
  sections: ResumeSection;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
