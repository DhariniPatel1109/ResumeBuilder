export interface ResumeSection {
  personalSummary: string;
  workExperience: WorkExperience[];
  projects: Project[];
}

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

export interface SavedVersion {
  id: string;
  companyName: string;
  sections: ResumeSection;
  createdAt: string;
}

export interface ParsedResume {
  text: string;
  sections: ResumeSection;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
