// AI Controller for Resume Enhancement
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import { API_CONSTANTS } from '../config/constants';
import { env } from '../config/env';

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

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

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
   * Generate AI suggestions using GPT-3.5 Turbo
   */
  private static async generateAISuggestions(
    jobDescription: string, 
    resumeData: any
  ): Promise<AIEnhancementResponse['suggestions']> {
    
    if (!env.OPENAI_API_KEY) {
      console.warn('⚠️ OpenAI API key not found, falling back to mock AI');
      return AIController.generateMockSuggestions(jobDescription, resumeData);
    }

    try {
      const prompt = AIController.buildEnhancementPrompt(jobDescription, resumeData);
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional resume enhancement expert. Analyze job descriptions and improve resume content with stronger action verbs, relevant keywords, and quantifiable results. Always maintain professional tone and accuracy."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0].message.content;
      if (!aiResponse) {
        throw new Error('No response from OpenAI');
      }

      return AIController.parseAIResponse(aiResponse, resumeData);

    } catch (error) {
      console.error('❌ OpenAI API error:', error);
      console.warn('⚠️ Falling back to mock AI suggestions');
      return AIController.generateMockSuggestions(jobDescription, resumeData);
    }
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
   * Build enhancement prompt for GPT-3.5 Turbo
   */
  private static buildEnhancementPrompt(jobDescription: string, resumeData: any): string {
    return `
JOB DESCRIPTION:
${jobDescription}

CURRENT RESUME CONTENT:

Personal Summary:
${resumeData.personalSummary || 'Not provided'}

Work Experience:
${resumeData.workExperience && resumeData.workExperience.length > 0 
  ? resumeData.workExperience.map((exp: any, index: number) => 
      `${index + 1}. ${exp.title} at ${exp.company} (${exp.duration})
       Bullets: ${exp.bullets ? exp.bullets.join('; ') : 'None'}`
    ).join('\n')
  : 'No work experience provided'}

Projects:
${resumeData.projects && resumeData.projects.length > 0 
  ? resumeData.projects.map((proj: any, index: number) => 
      `${index + 1}. ${proj.name}
       Description: ${proj.description}
       Bullets: ${proj.bullets ? proj.bullets.join('; ') : 'None'}`
    ).join('\n')
  : 'No projects provided'}

ENHANCEMENT INSTRUCTIONS:
1. Analyze the job description and identify key requirements, skills, and keywords
2. Enhance the resume content to better match the job requirements
3. Use stronger action verbs (Architected, Led, Optimized, Implemented, etc.)
4. Add quantifiable results where appropriate (use % or numbers)
5. Include relevant keywords from the job description
6. Maintain professional tone and accuracy
7. Keep enhancements concise and impactful

RESPONSE FORMAT:
Return a JSON object with this exact structure:
{
  "personalSummary": {
    "original": "current text",
    "enhanced": "improved text",
    "reasoning": "why this is better"
  },
  "workExperience": [
    {
      "original": "current bullet point",
      "enhanced": "improved bullet point", 
      "reasoning": "improvement explanation",
      "jobTitle": "Job Title",
      "company": "Company Name",
      "bulletIndex": 0
    }
  ],
  "projects": [
    {
      "original": "current bullet point",
      "enhanced": "improved bullet point",
      "reasoning": "improvement explanation", 
      "projectName": "Project Name",
      "bulletIndex": 0
    }
  ]
}

Only include suggestions where there is a meaningful improvement. If a bullet point is already well-written, don't include it in the suggestions.
`;
  }

  /**
   * Parse AI response and convert to our suggestion format
   */
  private static parseAIResponse(aiResponse: string, resumeData: any): AIEnhancementResponse['suggestions'] {
    try {
      // Clean the response (remove markdown formatting if present)
      const cleanResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanResponse);

      const suggestions: AIEnhancementResponse['suggestions'] = {
        workExperience: [],
        projects: []
      };

      // Parse personal summary
      if (parsed.personalSummary && parsed.personalSummary.enhanced !== parsed.personalSummary.original) {
        suggestions.personalSummary = {
          id: uuidv4(),
          type: 'personalSummary',
          original: parsed.personalSummary.original,
          enhanced: parsed.personalSummary.enhanced,
          confidence: 0.85,
          reasoning: parsed.personalSummary.reasoning || 'Enhanced with relevant keywords and improved structure',
          applied: false
        };
      }

      // Parse work experience
      if (parsed.workExperience && Array.isArray(parsed.workExperience)) {
        parsed.workExperience.forEach((suggestion: any) => {
          suggestions.workExperience.push({
            id: uuidv4(),
            type: 'workExperience',
            original: suggestion.original,
            enhanced: suggestion.enhanced,
            confidence: 0.80,
            reasoning: suggestion.reasoning || 'Improved with stronger action verbs and relevant keywords',
            applied: false,
            jobTitle: suggestion.jobTitle || '',
            company: suggestion.company || '',
            bulletIndex: suggestion.bulletIndex || 0
          });
        });
      }

      // Parse projects
      if (parsed.projects && Array.isArray(parsed.projects)) {
        parsed.projects.forEach((suggestion: any) => {
          suggestions.projects.push({
            id: uuidv4(),
            type: 'projects',
            original: suggestion.original,
            enhanced: suggestion.enhanced,
            confidence: 0.75,
            reasoning: suggestion.reasoning || 'Enhanced with technical details and impact metrics',
            applied: false,
            projectName: suggestion.projectName || '',
            bulletIndex: suggestion.bulletIndex || 0
          });
        });
      }

      return suggestions;

    } catch (error) {
      console.error('❌ Error parsing AI response:', error);
      console.log('Raw AI response:', aiResponse);
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * Generate mock suggestions (fallback when OpenAI is not available)
   */
  private static async generateMockSuggestions(
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
    if (resumeData.workExperience && resumeData.workExperience.length > 0) {
      resumeData.workExperience.forEach((workExp: any, workIndex: number) => {
        if (workExp.bullets && workExp.bullets.length > 0) {
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
        }
      });
    }

    // Generate project suggestions
    if (resumeData.projects && resumeData.projects.length > 0) {
      resumeData.projects.forEach((project: any, projectIndex: number) => {
        if (project.bullets && project.bullets.length > 0) {
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
        }
      });
    }

    return suggestions;
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
