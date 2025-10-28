export interface DynamicSection {
  type: 'text' | 'experience' | 'projects' | 'list';
  content: any;
  originalHeader: string;
}

export interface ResumeSection {
  // Core sections (for backward compatibility)
  personalSummary?: string;
  workExperience?: WorkExperience[];
  projects?: Project[];
  
  // Dynamic sections - AI can create any structure
  [key: string]: any;
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
  updatedAt?: string;
  // Document reference for format preservation
  originalDocument?: {
    fileName: string;
    filePath: string;
    fileType: string;
    uploadDate: string;
  };
}

export interface ParsedResume {
  text: string;
  sections: ResumeSection;
  // Document reference for format preservation
  originalDocument?: {
    fileName: string;
    filePath: string;
    fileType: string;
    uploadDate: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
