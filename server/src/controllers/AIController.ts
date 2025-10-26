// AI Controller for Resume Enhancement
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { API_CONSTANTS } from '../config/constants';

interface AIEnhancementRequest {
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

interface AISuggestion {
  id: string;
  type: 'personalSummary' | 'workExperience' | 'projects';
  original: string;
  enhanced: string;
  confidence: number;
  reasoning?: string;
  applied: boolean;
}

interface WorkExperienceSuggestion extends AISuggestion {
  type: 'workExperience';
  jobTitle: string;
  company: string;
  bulletIndex: number;
}

interface ProjectSuggestion extends AISuggestion {
  type: 'projects';
  projectName: string;
  bulletIndex: number;
}

interface AIEnhancementResponse {
  success: boolean;
  suggestions: {
    personalSummary?: AISuggestion;
    workExperience: WorkExperienceSuggestion[];
    projects: ProjectSuggestion[];
  };
  sessionId: string;
  processingTime: number;
}

// In-memory storage for AI sessions (in production, use Redis or database)
const aiSessions = new Map<string, any>();

export class AIController {
  /**
   * Enhance resume content based on job description
   */
  static async enhanceResume(req: Request, res: Response): Promise<void> {
    try {
      console.log('🤖 AI Enhancement request received');
      
      const { jobDescription, resumeData }: AIEnhancementRequest = req.body;

      if (!jobDescription || !resumeData) {
        res.status(400).json({
          success: false,
          error: 'Job description and resume data are required'
        });
        return;
      }

      const sessionId = uuidv4();
      const startTime = Date.now();

      // Simulate AI processing (replace with actual AI service integration)
      const suggestions = await AIController.generateAISuggestions(jobDescription, resumeData);
      
      const processingTime = Date.now() - startTime;

      // Store session data
      aiSessions.set(sessionId, {
        suggestions,
        createdAt: new Date(),
        jobDescription,
        resumeData
      });

      const response: AIEnhancementResponse = {
        success: true,
        suggestions,
        sessionId,
        processingTime
      };

      console.log(`✅ AI Enhancement completed in ${processingTime}ms`);
      res.json(response);

    } catch (error) {
      console.error('❌ AI Enhancement error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'AI enhancement failed'
      });
    }
  }

  /**
   * Get processing status for AI enhancement
   */
  static async getProcessingStatus(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId || !aiSessions.has(sessionId)) {
        res.status(404).json({
          success: false,
          error: 'Session not found'
        });
        return;
      }

      const session = aiSessions.get(sessionId);
      
      res.json({
        success: true,
        status: 'complete',
        sessionId,
        createdAt: session.createdAt
      });

    } catch (error) {
      console.error('❌ Error getting processing status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get processing status'
      });
    }
  }

  /**
   * Apply selected AI suggestions
   */
  static async applySuggestions(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, suggestionIds } = req.body;

      if (!sessionId || !suggestionIds || !Array.isArray(suggestionIds)) {
        res.status(400).json({
          success: false,
          error: 'Session ID and suggestion IDs are required'
        });
        return;
      }

      if (!aiSessions.has(sessionId)) {
        res.status(404).json({
          success: false,
          error: 'Session not found'
        });
        return;
      }

      console.log(`📝 Applying ${suggestionIds.length} AI suggestions`);

      // In a real implementation, you would apply the suggestions to the resume
      // For now, we just log the applied suggestions
      const session = aiSessions.get(sessionId);
      const appliedSuggestions = suggestionIds.map(id => {
        // Find the suggestion in the session
        const allSuggestions = [
          session.suggestions.personalSummary,
          ...session.suggestions.workExperience,
          ...session.suggestions.projects
        ].filter(Boolean);
        
        return allSuggestions.find(s => s.id === id);
      }).filter(Boolean);

      console.log('✅ Applied suggestions:', appliedSuggestions.map(s => s.id));

      res.json({
        success: true,
        appliedCount: suggestionIds.length,
        message: 'Suggestions applied successfully'
      });

    } catch (error) {
      console.error('❌ Error applying suggestions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to apply suggestions'
      });
    }
  }

  /**
   * Generate AI suggestions (mock implementation)
   * In production, integrate with OpenAI, Claude, or other AI services
   */
  private static async generateAISuggestions(
    jobDescription: string, 
    resumeData: any
  ): Promise<AIEnhancementResponse['suggestions']> {
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const suggestions: AIEnhancementResponse['suggestions'] = {
      workExperience: [],
      projects: []
    };

    // Generate personal summary suggestion
    if (resumeData.personalSummary) {
      suggestions.personalSummary = {
        id: uuidv4(),
        type: 'personalSummary',
        original: resumeData.personalSummary,
        enhanced: AIController.enhancePersonalSummary(resumeData.personalSummary, jobDescription),
        confidence: 0.85,
        reasoning: 'Enhanced with relevant keywords and improved structure',
        applied: false
      };
    }

    // Generate work experience suggestions
    resumeData.workExperience.forEach((workExp: any, workIndex: number) => {
      workExp.bullets.forEach((bullet: string, bulletIndex: number) => {
        const enhanced = AIController.enhanceBulletPoint(bullet, jobDescription);
        if (enhanced !== bullet) {
          suggestions.workExperience.push({
            id: uuidv4(),
            type: 'workExperience',
            original: bullet,
            enhanced,
            confidence: 0.75,
            reasoning: 'Improved with stronger action verbs and relevant keywords',
            applied: false,
            jobTitle: workExp.title,
            company: workExp.company,
            bulletIndex
          });
        }
      });
    });

    // Generate project suggestions
    resumeData.projects.forEach((project: any, projectIndex: number) => {
      project.bullets.forEach((bullet: string, bulletIndex: number) => {
        const enhanced = AIController.enhanceBulletPoint(bullet, jobDescription);
        if (enhanced !== bullet) {
          suggestions.projects.push({
            id: uuidv4(),
            type: 'projects',
            original: bullet,
            enhanced,
            confidence: 0.70,
            reasoning: 'Enhanced with technical details and impact metrics',
            applied: false,
            projectName: project.name,
            bulletIndex
          });
        }
      });
    });

    return suggestions;
  }

  /**
   * Enhance personal summary (mock implementation)
   */
  private static enhancePersonalSummary(original: string, jobDescription: string): string {
    // Simple enhancement logic - in production, use AI service
    const keywords = AIController.extractKeywords(jobDescription);
    const enhanced = original + `\n\nKey skills: ${keywords.slice(0, 3).join(', ')}.`;
    return enhanced;
  }

  /**
   * Enhance bullet point (mock implementation)
   */
  private static enhanceBulletPoint(original: string, jobDescription: string): string {
    // Simple enhancement logic - in production, use AI service
    const keywords = AIController.extractKeywords(jobDescription);
    
    // Add some mock enhancements
    if (original.toLowerCase().includes('developed')) {
      return original.replace(/developed/gi, 'Architected and developed');
    }
    
    if (original.toLowerCase().includes('managed')) {
      return original.replace(/managed/gi, 'Led and managed');
    }
    
    if (original.toLowerCase().includes('improved')) {
      return original.replace(/improved/gi, 'Optimized and improved');
    }
    
    return original;
  }

  /**
   * Extract keywords from job description (mock implementation)
   */
  private static extractKeywords(jobDescription: string): string[] {
    const commonKeywords = [
      'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
      'Machine Learning', 'AI', 'Data Science', 'Cloud', 'AWS',
      'Agile', 'Scrum', 'DevOps', 'CI/CD', 'Docker', 'Kubernetes'
    ];
    
    const foundKeywords = commonKeywords.filter(keyword => 
      jobDescription.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return foundKeywords.length > 0 ? foundKeywords : ['Software Development', 'Problem Solving', 'Team Collaboration'];
  }
}
