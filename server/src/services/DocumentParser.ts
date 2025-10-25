import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import fs from 'fs-extra';
import { ParsedResume, ResumeSection, WorkExperience, Project } from '../types';
import { API_CONSTANTS } from '../config/constants';

export class DocumentParser {
  /**
   * Parse Word document and extract text
   */
  static async parseWordDocument(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      throw new Error(`Error parsing Word document: ${error}`);
    }
  }

  /**
   * Parse PDF document and extract text
   */
  static async parsePDF(filePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      throw new Error(`Error parsing PDF: ${error}`);
    }
  }

  /**
   * Parse document based on file extension
   */
  static async parseDocument(filePath: string, fileExtension: string): Promise<string> {
    if (fileExtension === '.docx' || fileExtension === '.doc') {
      return this.parseWordDocument(filePath);
    } else if (fileExtension === '.pdf') {
      return this.parsePDF(filePath);
    } else {
      throw new Error('Unsupported file format');
    }
  }

  /**
   * Detect and parse resume sections from text
   */
  static detectSections(text: string): ResumeSection {
    const sections: ResumeSection = {
      personalSummary: '',
      workExperience: [],
      projects: []
    };

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let currentSection = '';
    let currentExperience: WorkExperience | null = null;
    let currentProject: Project | null = null;
    let personalSummaryLines: string[] = [];

    // First pass: detect section headers
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();

      // More comprehensive section detection
      if (lowerLine.match(API_CONSTANTS.SECTION_PATTERNS.PERSONAL_SUMMARY)) {
        currentSection = 'personalSummary';
        continue;
      }

      if (lowerLine.match(API_CONSTANTS.SECTION_PATTERNS.WORK_EXPERIENCE)) {
        currentSection = 'workExperience';
        continue;
      }

      if (lowerLine.match(API_CONSTANTS.SECTION_PATTERNS.PROJECTS)) {
        currentSection = 'projects';
        continue;
      }

      // If no section detected yet, assume it's personal summary
      if (!currentSection) {
        currentSection = 'personalSummary';
      }

      // Process content based on current section
      if (currentSection === 'personalSummary') {
        personalSummaryLines.push(line);
      } else if (currentSection === 'workExperience') {
        // Look for job titles (lines that look like job titles)
        if (this.isJobTitle(line)) {
          if (currentExperience) {
            sections.workExperience.push(currentExperience);
          }
          currentExperience = {
            title: line,
            company: '',
            duration: '',
            bullets: []
          };
        } else if (currentExperience) {
          // Check if it's a company name or duration
          if (this.isCompanyOrDuration(line)) {
            if (this.isDuration(line)) {
              currentExperience.duration = line;
            } else {
              currentExperience.company = line;
            }
          } else if (this.isBulletPoint(line)) {
            currentExperience.bullets.push(this.cleanBulletPoint(line));
          }
        }
      } else if (currentSection === 'projects') {
        // Look for project names
        if (this.isProjectName(line)) {
          if (currentProject) {
            sections.projects.push(currentProject);
          }
          currentProject = {
            name: line,
            description: '',
            bullets: []
          };
        } else if (currentProject) {
          if (this.isBulletPoint(line)) {
            currentProject.bullets.push(this.cleanBulletPoint(line));
          } else {
            currentProject.description += line + '\n';
          }
        }
      }
    }

    // Add the last experience/project
    if (currentExperience) {
      sections.workExperience.push(currentExperience);
    }
    if (currentProject) {
      sections.projects.push(currentProject);
    }

    // Process personal summary
    sections.personalSummary = personalSummaryLines.join('\n');

    // Fallback: if no sections were detected, put everything in personal summary
    if (sections.workExperience.length === 0 && sections.projects.length === 0 && sections.personalSummary.length < 50) {
      console.log('No sections detected, using fallback parsing');
      sections.personalSummary = lines.join('\n');
    }

    return sections;
  }

  /**
   * Parse resume from file path
   */
  static async parseResume(filePath: string, fileExtension: string): Promise<ParsedResume> {
    const text = await this.parseDocument(filePath, fileExtension);
    const sections = this.detectSections(text);
    
    return {
      text,
      sections
    };
  }

  // Helper methods for better detection
  private static isJobTitle(line: string): boolean {
    return line.length > 3 && 
           line.length < 100 && 
           !line.includes('•') && 
           !line.includes('-') && 
           !line.includes('@') &&
           !this.isDate(line) &&
           !this.isDuration(line) &&
           (line.match(/^[A-Z][a-zA-Z\s&]+$/) || line.match(/^[A-Z][a-zA-Z\s&]+[A-Z][a-zA-Z\s&]*$/));
  }

  private static isCompanyOrDuration(line: string): boolean {
    return this.isCompany(line) || this.isDuration(line);
  }

  private static isCompany(line: string): boolean {
    return line.length > 2 && 
           line.length < 100 && 
           !line.includes('•') && 
           !line.includes('-') &&
           !this.isDate(line) &&
           !this.isDuration(line);
  }

  private static isDuration(line: string): boolean {
    return line.match(/\d{4}|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i) !== null ||
           line.match(/\d{4}\s*[-–]\s*\d{4}/) !== null ||
           line.match(/\d{4}\s*[-–]\s*(present|current)/i) !== null;
  }

  private static isDate(line: string): boolean {
    return line.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/) !== null ||
           line.match(/\b\d{4}\b/) !== null;
  }

  private static isBulletPoint(line: string): boolean {
    return line.includes('•') || 
           line.includes('-') || 
           line.includes('*') ||
           line.match(/^\d+\./) !== null ||
           line.match(/^[a-z]\)/) !== null;
  }

  private static cleanBulletPoint(line: string): string {
    return line.replace(/^[•\-*]\s*/, '').replace(/^\d+\.\s*/, '').replace(/^[a-z]\)\s*/, '').trim();
  }

  private static isProjectName(line: string): boolean {
    return line.length > 3 && 
           line.length < 80 && 
           !line.includes('•') && 
           !line.includes('-') &&
           !this.isDate(line) &&
           !this.isDuration(line) &&
           line.match(/^[A-Z][a-zA-Z\s&]+$/) !== null;
  }
}
