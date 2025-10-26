// AI Enhancement Types and Interfaces

export interface AISuggestion {
  id: string;
  type: 'personalSummary' | 'workExperience' | 'projects';
  original: string;
  enhanced: string;
  confidence: number; // 0-1
  reasoning?: string;
  applied: boolean;
}

export interface WorkExperienceSuggestion extends AISuggestion {
  type: 'workExperience';
  jobTitle: string;
  company: string;
  bulletIndex: number;
}

export interface ProjectSuggestion extends AISuggestion {
  type: 'projects';
  projectName: string;
  bulletIndex: number;
}

export interface AIEnhancementRequest {
  jobDescription: string;
  resumeData: {
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
}

export interface AIEnhancementResponse {
  success: boolean;
  suggestions: {
    personalSummary?: AISuggestion;
    workExperience: WorkExperienceSuggestion[];
    projects: ProjectSuggestion[];
  };
  sessionId: string;
  processingTime: number;
}

export interface AIEnhancementState {
  isEnabled: boolean;
  jobDescription: string;
  isProcessing: boolean;
  suggestions: AIEnhancementResponse['suggestions'] | null;
  sessionId: string | null;
  appliedSuggestions: string[];
  error: string | null;
}

export interface AIProcessingStatus {
  stage: 'analyzing' | 'enhancing' | 'optimizing' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
}

export type AISuggestionAction = 'accept' | 'reject' | 'edit';
