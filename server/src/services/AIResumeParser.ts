/**
 * AI-Enhanced Resume Parser
 * Combines regex-based parsing with AI for better accuracy
 */

import { DocumentParser } from './DocumentParser';
import { logger } from './Logger';
import { ParsedResume, ResumeSection } from '../types';
import OpenAI from 'openai';

export class AIResumeParser {
  private static openai: OpenAI | null = null;

  static initialize() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      logger.info('AI Resume Parser initialized with OpenAI', {}, 'AIResumeParser');
    } else {
      logger.warn('OpenAI API key not found, falling back to regex parser', {}, 'AIResumeParser');
    }
  }

  /**
   * Parse resume with AI enhancement
   */
  static async parseResume(filePath: string, fileExtension: string): Promise<ParsedResume> {
    try {
      logger.info('Starting AI-enhanced resume parsing', { filePath, fileExtension }, 'AIResumeParser');
      
      // Step 1: Extract raw text using existing parser
      const rawText = await DocumentParser.parseDocument(filePath, fileExtension);
      logger.debug('Raw text extracted', { textLength: rawText.length }, 'AIResumeParser');

      // Step 2: Parse with regex-based parser (fallback)
      const regexParsed = DocumentParser.detectSections(rawText);
      logger.debug('Regex parsing completed', {
        sections: Object.keys(regexParsed.dynamicSections || {}),
        workExperienceCount: regexParsed.workExperience.length,
        projectsCount: regexParsed.projects.length
      }, 'AIResumeParser');

      // Step 3: Enhance with AI if available
      if (this.openai) {
        try {
          const aiEnhanced = await this.enhanceWithAI(rawText, regexParsed);
          logger.info('AI enhancement completed', {
            improvements: this.calculateImprovements(regexParsed, aiEnhanced)
          }, 'AIResumeParser');
          return aiEnhanced;
        } catch (aiError) {
          logger.warn('AI enhancement failed, using regex results', { 
            error: aiError instanceof Error ? aiError.message : 'Unknown error' 
          }, 'AIResumeParser');
        }
      }

      // Return regex-parsed results if AI is not available or fails
      return {
        text: rawText,
        sections: regexParsed
      };

    } catch (error) {
      logger.error('AI Resume Parser failed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        filePath 
      }, 'AIResumeParser');
      throw error;
    }
  }

  /**
   * Enhance parsed data using AI
   */
  private static async enhanceWithAI(rawText: string, regexParsed: ResumeSection): Promise<ParsedResume> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    const prompt = this.buildEnhancementPrompt(rawText, regexParsed);
    
    logger.debug('Sending request to OpenAI', { 
      promptLength: prompt.length,
      model: 'gpt-3.5-turbo'
    }, 'AIResumeParser');

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume parser. Analyze the provided resume text and regex-parsed data, then return improved structured data. Focus on accuracy and completeness."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 3000,
      temperature: 0.1, // Low temperature for consistent structure
    });

    const aiResponse = response.choices[0].message.content;
    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    logger.debug('OpenAI response received', { 
      responseLength: aiResponse.length 
    }, 'AIResumeParser');

    return this.parseAIResponse(aiResponse, rawText);
  }

  /**
   * Build enhancement prompt for AI - Dynamic Structure
   */
  private static buildEnhancementPrompt(rawText: string, regexParsed: ResumeSection): string {
    return `
RESUME TEXT:
${rawText}

TASK:
Analyze this resume text and extract ALL information into a structured format. Do NOT restrict yourself to predefined sections - identify whatever sections and content exist in this resume.

INSTRUCTIONS:
1. Read through the entire resume text carefully
2. Identify ALL sections present (don't limit to common ones like "Experience" - look for any section headers)
3. For each section, determine the most appropriate structure based on the content
4. Extract all information accurately - don't miss anything
5. Maintain the logical flow and relationships between different pieces of information
6. If content doesn't fit standard patterns, create appropriate structures for it

DYNAMIC STRUCTURE RULES:
- Create sections based on what you actually find in the resume
- Use appropriate data types for each section (text, list, structured objects, etc.)
- For work experience: extract company, title, duration, location, and all bullet points
- For projects: extract name, description, technologies, and all bullet points  
- For education: extract institution, degree, year, GPA, etc.
- For skills: extract all skills mentioned, group by category if appropriate
- For any other sections: structure them appropriately based on content

RETURN FORMAT:
Return a JSON object with whatever structure makes sense for this resume. Examples:

{
  "personalSummary": "text content",
  "workExperience": [
    {
      "company": "Company Name",
      "title": "Job Title", 
      "duration": "Jan 2020 - Present",
      "location": "City, State",
      "bullets": ["achievement 1", "achievement 2"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["Tech1", "Tech2"],
      "bullets": ["accomplishment 1", "accomplishment 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Type",
      "year": "2020",
      "gpa": "3.8"
    }
  ],
  "skills": {
    "technical": ["skill1", "skill2"],
    "languages": ["language1", "language2"]
  },
  "certifications": ["cert1", "cert2"],
  "awards": ["award1", "award2"]
}

IMPORTANT:
- Create the structure that best represents THIS specific resume
- Don't force content into predefined formats if it doesn't fit
- Extract ALL information - don't leave anything out
- Be accurate with all details (names, dates, etc.)
- Return valid JSON only
`;
  }

  /**
   * Parse AI response and convert to ParsedResume format - Dynamic Structure
   */
  private static parseAIResponse(aiResponse: string, rawText: string): ParsedResume {
    try {
      // Clean the response (remove markdown formatting if present)
      const cleanResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanResponse);

      // AI returns the entire structure directly, not nested under 'sections'
      const sections = parsed.sections || parsed;

      logger.debug('AI response parsed successfully', {
        hasSections: !!sections,
        sectionKeys: Object.keys(sections),
        workExperienceCount: sections.workExperience?.length || 0,
        projectsCount: sections.projects?.length || 0,
        totalSections: Object.keys(sections).length
      }, 'AIResumeParser');

      return {
        text: rawText,
        sections: sections
      };

    } catch (error) {
      logger.error('Failed to parse AI response', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        response: aiResponse.substring(0, 500) + '...'
      }, 'AIResumeParser');
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * Calculate improvements made by AI
   */
  private static calculateImprovements(original: ResumeSection, enhanced: ResumeSection): any {
    return {
      workExperienceImprovement: enhanced.workExperience.length - original.workExperience.length,
      projectsImprovement: enhanced.projects.length - original.projects.length,
      personalSummaryImprovement: enhanced.personalSummary.length - original.personalSummary.length,
      dynamicSectionsImprovement: Object.keys(enhanced.dynamicSections || {}).length - Object.keys(original.dynamicSections || {}).length
    };
  }

  /**
   * Validate parsed data quality
   */
  static validateParsedData(parsed: ParsedResume): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    // Check for empty sections
    if (!parsed.sections.personalSummary || parsed.sections.personalSummary.length < 10) {
      issues.push('Personal summary is missing or too short');
      score -= 20;
    }

    if (!parsed.sections.workExperience || parsed.sections.workExperience.length === 0) {
      issues.push('No work experience found');
      score -= 30;
    }

    if (!parsed.sections.projects || parsed.sections.projects.length === 0) {
      issues.push('No projects found');
      score -= 15;
    }

    // Check work experience quality
    parsed.sections.workExperience.forEach((exp, index) => {
      if (!exp.company || exp.company.length < 2) {
        issues.push(`Work experience ${index + 1} missing company name`);
        score -= 5;
      }
      if (!exp.title || exp.title.length < 2) {
        issues.push(`Work experience ${index + 1} missing job title`);
        score -= 5;
      }
      if (!exp.bullets || exp.bullets.length === 0) {
        issues.push(`Work experience ${index + 1} missing bullet points`);
        score -= 5;
      }
    });

    // Check projects quality
    parsed.sections.projects.forEach((project, index) => {
      if (!project.name || project.name.length < 2) {
        issues.push(`Project ${index + 1} missing name`);
        score -= 5;
      }
    });

    return { score: Math.max(0, score), issues };
  }
}

// Initialize the parser
AIResumeParser.initialize();
