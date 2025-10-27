import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import fs from 'fs-extra';
import { ParsedResume, ResumeSection, WorkExperience, Project, DynamicSection } from '../types';
import { API_CONSTANTS } from '../config/constants';
import { logger } from './Logger';

export class DocumentParser {
  /**
   * Parse Word document and extract text
   */
  static async parseWordDocument(filePath: string): Promise<string> {
    try {
      logger.fileOperation('Parsing Word document', filePath);
      const result = await mammoth.extractRawText({ path: filePath });
      logger.debug('Word document parsed successfully', { 
        filePath, 
        textLength: result.value.length 
      }, 'DocumentParser');
      return result.value;
    } catch (error) {
      logger.error('Failed to parse Word document', { 
        filePath, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 'DocumentParser');
      throw new Error(`Error parsing Word document: ${error}`);
    }
  }

  /**
   * Parse PDF document and extract text
   */
  static async parsePDF(filePath: string): Promise<string> {
    try {
      logger.fileOperation('Parsing PDF document', filePath);
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      logger.debug('PDF document parsed successfully', { 
        filePath, 
        textLength: data.text.length 
      }, 'DocumentParser');
      return data.text;
    } catch (error) {
      logger.error('Failed to parse PDF document', { 
        filePath, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 'DocumentParser');
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
   * Detect and parse resume sections from text - Dynamic version
   */
  static detectSections(text: string): ResumeSection {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    logger.parsingStep('Starting dynamic section detection', { 
      totalLines: lines.length,
      textLength: text.length 
    });

    // Detect all sections dynamically
    const detectedSections = this.detectAllSections(lines);
    
    // Convert to the expected format while preserving dynamic structure
    const sections: ResumeSection = {
      personalSummary: '',
      workExperience: [],
      projects: [],
      // Add dynamic sections
      dynamicSections: detectedSections
    };

    // Map detected sections to standard format for backward compatibility
    if (detectedSections.personalSummary) {
      sections.personalSummary = detectedSections.personalSummary.content;
    }
    
    if (detectedSections.workExperience) {
      sections.workExperience = detectedSections.workExperience.content;
    }
    
    if (detectedSections.projects) {
      sections.projects = detectedSections.projects.content;
    }

    logger.info('Dynamic parsing completed', {
      totalSections: Object.keys(detectedSections).length,
      sectionNames: Object.keys(detectedSections),
      personalSummaryLength: sections.personalSummary.length,
      workExperienceEntries: sections.workExperience.length,
      projectsEntries: sections.projects.length
    }, 'DocumentParser');

    return sections;
  }

  /**
   * Detect all sections dynamically from resume text
   */
  static detectAllSections(lines: string[]): Record<string, DynamicSection> {
    const sections: Record<string, DynamicSection> = {};
    let currentSectionName = '';
    let currentSectionContent: DynamicSection | null = null;
    let currentExperience: WorkExperience | null = null;
    let currentProject: Project | null = null;

    logger.parsingStep('Starting section detection loop', { totalLines: lines.length });

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const cleanLine = this.cleanMarkdown(line);

      // Check if this line is a section header
      const sectionInfo = this.detectSectionHeader(line);
      
      if (sectionInfo) {
        // Save previous section
        if (currentSectionName && currentSectionContent !== null) {
          sections[currentSectionName] = currentSectionContent;
          logger.sectionDetection(currentSectionName, currentSectionContent.type, {
            contentLength: Array.isArray(currentSectionContent.content) 
              ? currentSectionContent.content.length 
              : currentSectionContent.content.length
          });
        }

        // Start new section
        currentSectionName = sectionInfo.name;
        currentSectionContent = {
          type: sectionInfo.type as 'text' | 'experience' | 'projects' | 'list',
          content: sectionInfo.type === 'list' ? [] : (sectionInfo.type === 'experience' || sectionInfo.type === 'projects' ? [] : ''),
          originalHeader: line
        };

        logger.debug(`Section header detected`, {
          lineNumber: i + 1,
          sectionName: currentSectionName,
          sectionType: sectionInfo.type,
          originalHeader: line
        }, 'DocumentParser');
        continue;
      }

      // If no section detected yet, assume it's personal summary
      if (!currentSectionName) {
        currentSectionName = 'personalSummary';
        currentSectionContent = {
          type: 'text',
          content: '',
          originalHeader: 'Personal Summary'
        };
      }

      // Process content based on section type
      if (currentSectionContent && currentSectionContent.type === 'text') {
        // Text-based sections (Personal Summary, Objective, etc.)
        if (line && !line.startsWith('![') && !line.startsWith('**') && !line.includes('@')) {
          currentSectionContent.content += line + '\n';
        }
        } else if (currentSectionContent && currentSectionContent.type === 'experience') {
          // Experience-based sections (Work Experience, Professional Experience, etc.)
          if (this.isCompanyName(line)) {
            if (currentExperience) {
              currentSectionContent.content.push(currentExperience);
              logger.debug('Experience entry completed', {
                company: currentExperience.company,
                title: currentExperience.title,
                bulletsCount: currentExperience.bullets.length
              }, 'DocumentParser');
            }
            
            const companyMatch = line.match(/\*\*(.*?)\*\*/);
            const durationMatch = line.match(/(\w+\s+\d{4}\s*[-–]\s*(?:\w+\s+\d{4}|Present|Current))/i);
            
            currentExperience = {
              title: '',
              company: companyMatch ? companyMatch[1] : this.cleanMarkdown(line),
              duration: durationMatch ? durationMatch[1] : '',
              bullets: []
            };

            logger.debug('New experience entry started', {
              lineNumber: i + 1,
              company: currentExperience.company,
              duration: currentExperience.duration
            }, 'DocumentParser');
          } else if (currentExperience) {
          if (this.isJobTitle(line)) {
            // Extract job title and duration from the same line if present
            const durationMatch = line.match(/(\w+\s+\d{4}\s*[-–]\s*(?:\w+\s+\d{4}|Present|Current))/i);
            if (durationMatch) {
              currentExperience.duration = durationMatch[1];
              currentExperience.title = this.cleanMarkdown(line.replace(durationMatch[0], '').trim());
            } else {
              currentExperience.title = this.cleanMarkdown(line);
            }
          } else if (this.isDuration(line)) {
            currentExperience.duration = line;
            } else if (this.isBulletPoint(line)) {
              const bullet = this.cleanBulletPoint(line);
              currentExperience.bullets.push(bullet);
              logger.debug('Bullet point added to experience', {
                lineNumber: i + 1,
                company: currentExperience.company,
                bullet: bullet.substring(0, 100) + (bullet.length > 100 ? '...' : '')
              }, 'DocumentParser');
            }
        } else if (this.isCompanyName(line)) {
          // Start new experience entry when we encounter a company name
          if (currentExperience) {
            currentSectionContent.content.push(currentExperience);
          }
          currentExperience = {
            title: '',
            company: this.cleanMarkdown(line),
            duration: '',
            bullets: []
          };
        }
      } else if (currentSectionContent && currentSectionContent.type === 'projects') {
        // Project-based sections
        if (this.isProjectName(line)) {
          if (currentProject) {
            currentSectionContent.content.push(currentProject);
          }
          currentProject = {
            name: this.cleanMarkdown(line),
            description: '',
            bullets: []
          };
        } else if (currentProject) {
          if (this.isBulletPoint(line)) {
            const bullet = this.cleanBulletPoint(line);
            currentProject.bullets.push(bullet);
          } else if (line && !line.startsWith('![')) {
            currentProject.description += line + '\n';
          }
        }
      } else if (currentSectionContent && currentSectionContent.type === 'list') {
        // List-based sections (Skills, Education, etc.)
        if (this.isBulletPoint(line)) {
          const bullet = this.cleanBulletPoint(line);
          currentSectionContent.content.push(bullet);
        } else if (line && !line.startsWith('![') && line.length > 0) {
          currentSectionContent.content.push(line);
        }
      }
    }

    // Save the last section
    if (currentSectionName && currentSectionContent !== null) {
      if (currentExperience && currentSectionContent.type === 'experience') {
        currentSectionContent.content.push(currentExperience);
      }
      if (currentProject && currentSectionContent.type === 'projects') {
        currentSectionContent.content.push(currentProject);
      }
      sections[currentSectionName] = currentSectionContent;
    }

    // Clean up text content
    Object.keys(sections).forEach(key => {
      if (sections[key].type === 'text') {
        sections[key].content = sections[key].content.trim();
      }
    });

    return sections;
  }

  /**
   * Detect section header and return section info
   */
  static detectSectionHeader(line: string): { name: string; type: string } | null {
    const cleanLine = this.cleanMarkdown(line).toLowerCase();
    
    // Comprehensive section patterns - now includes both markdown and plain text headers
    const sectionPatterns = {
      // Personal/Summary sections
      personalSummary: {
        patterns: [
          /^#+\s*\*?\*?personal\s+summary\*?\*?$/i,
          /^#+\s*\*?\*?summary\*?\*?$/i,
          /^#+\s*\*?\*?objective\*?\*?$/i,
          /^#+\s*\*?\*?profile\*?\*?$/i,
          /^#+\s*\*?\*?about\*?\*?$/i,
          /^#+\s*\*?\*?personal\s+statement\*?\*?$/i,
          /^#+\s*\*?\*?overview\*?\*?$/i,
          /^#+\s*\*?\*?executive\s+summary\*?\*?$/i,
          /^#+\s*\*?\*?career\s+objective\*?\*?$/i,
          // Plain text patterns
          /^personal\s+summary$/i,
          /^summary$/i,
          /^objective$/i,
          /^profile$/i,
          /^about$/i,
          /^personal\s+statement$/i,
          /^overview$/i,
          /^executive\s+summary$/i,
          /^career\s+objective$/i
        ],
        type: 'text'
      },
      
      // Experience sections
      workExperience: {
        patterns: [
          /^#+\s*\*?\*?work\s+experience\*?\*?$/i,
          /^#+\s*\*?\*?experience\*?\*?$/i,
          /^#+\s*\*?\*?employment\*?\*?$/i,
          /^#+\s*\*?\*?professional\s+experience\*?\*?$/i,
          /^#+\s*\*?\*?work\s+history\*?\*?$/i,
          /^#+\s*\*?\*?career\*?\*?$/i,
          /^#+\s*\*?\*?employment\s+history\*?\*?$/i,
          /^#+\s*\*?\*?professional\s+background\*?\*?$/i,
          // Plain text patterns
          /^work\s+experience$/i,
          /^experience$/i,
          /^employment$/i,
          /^professional\s+experience$/i,
          /^work\s+history$/i,
          /^career$/i,
          /^employment\s+history$/i,
          /^professional\s+background$/i
        ],
        type: 'experience'
      },
      
      // Project sections
      projects: {
        patterns: [
          /^#+\s*\*?\*?projects\*?\*?$/i,
          /^#+\s*\*?\*?project\*?\*?$/i,
          /^#+\s*\*?\*?portfolio\*?\*?$/i,
          /^#+\s*\*?\*?key\s+projects\*?\*?$/i,
          /^#+\s*\*?\*?selected\s+projects\*?\*?$/i,
          /^#+\s*\*?\*?notable\s+projects\*?\*?$/i,
          /^#+\s*\*?\*?software\s+projects\*?\*?$/i,
          // Plain text patterns
          /^projects$/i,
          /^project$/i,
          /^portfolio$/i,
          /^key\s+projects$/i,
          /^selected\s+projects$/i,
          /^notable\s+projects$/i,
          /^software\s+projects$/i
        ],
        type: 'projects'
      },
      
      // Education sections
      education: {
        patterns: [
          /^#+\s*\*?\*?education\*?\*?$/i,
          /^#+\s*\*?\*?academic\s+background\*?\*?$/i,
          /^#+\s*\*?\*?academic\s+qualifications\*?\*?$/i,
          /^#+\s*\*?\*?educational\s+background\*?\*?$/i,
          // Plain text patterns
          /^education$/i,
          /^academic\s+background$/i,
          /^academic\s+qualifications$/i,
          /^educational\s+background$/i
        ],
        type: 'list'
      },
      
      // Skills sections
      skills: {
        patterns: [
          /^#+\s*\*?\*?skills\*?\*?$/i,
          /^#+\s*\*?\*?technical\s+skills\*?\*?$/i,
          /^#+\s*\*?\*?core\s+competencies\*?\*?$/i,
          /^#+\s*\*?\*?expertise\*?\*?$/i,
          /^#+\s*\*?\*?technologies\*?\*?$/i,
          /^#+\s*\*?\*?programming\s+skills\*?\*?$/i,
          // Plain text patterns
          /^skills$/i,
          /^technical\s+skills$/i,
          /^core\s+competencies$/i,
          /^expertise$/i,
          /^technologies$/i,
          /^programming\s+skills$/i
        ],
        type: 'list'
      },
      
      // Certification sections
      certifications: {
        patterns: [
          /^#+\s*\*?\*?certifications\*?\*?$/i,
          /^#+\s*\*?\*?certificates\*?\*?$/i,
          /^#+\s*\*?\*?licenses\*?\*?$/i,
          /^#+\s*\*?\*?professional\s+certifications\*?\*?$/i,
          // Plain text patterns
          /^certifications$/i,
          /^certificates$/i,
          /^licenses$/i,
          /^professional\s+certifications$/i
        ],
        type: 'list'
      },
      
      // Achievement sections
      achievements: {
        patterns: [
          /^#+\s*\*?\*?achievements\*?\*?$/i,
          /^#+\s*\*?\*?awards\*?\*?$/i,
          /^#+\s*\*?\*?honors\*?\*?$/i,
          /^#+\s*\*?\*?accomplishments\*?\*?$/i,
          // Plain text patterns
          /^achievements$/i,
          /^awards$/i,
          /^honors$/i,
          /^accomplishments$/i
        ],
        type: 'list'
      }
    };

    // Check each section type
    for (const [sectionName, sectionInfo] of Object.entries(sectionPatterns)) {
      if (sectionInfo.patterns.some(pattern => pattern.test(line))) {
        return { name: sectionName, type: sectionInfo.type };
      }
    }

    return null;
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
  private static cleanMarkdown(line: string): string {
    return line
      .replace(/^\*\*(.*?)\*\*$/, '$1')  // Remove bold markdown
      .replace(/^\*(.*?)\*$/, '$1')      // Remove italic markdown
      .replace(/^#+\s*/, '')             // Remove markdown headers
      .replace(/^\*\*(.*?)\*\*/, '$1')   // Remove bold from start
      .replace(/^\*(.*?)\*/, '$1')       // Remove italic from start
      .trim();
  }

  private static isSectionHeader(line: string, sectionType: string): boolean {
    const cleanLine = this.cleanMarkdown(line).toLowerCase();
    
    const patterns = {
      personalSummary: [
        /^#+\s*\*?\*?personal\s+summary\*?\*?$/i,
        /^#+\s*\*?\*?summary\*?\*?$/i,
        /^#+\s*\*?\*?objective\*?\*?$/i,
        /^#+\s*\*?\*?profile\*?\*?$/i,
        /^#+\s*\*?\*?about\*?\*?$/i,
        /^#+\s*\*?\*?personal\s+statement\*?\*?$/i,
        /^#+\s*\*?\*?overview\*?\*?$/i
      ],
      workExperience: [
        /^#+\s*\*?\*?work\s+experience\*?\*?$/i,
        /^#+\s*\*?\*?experience\*?\*?$/i,
        /^#+\s*\*?\*?employment\*?\*?$/i,
        /^#+\s*\*?\*?professional\s+experience\*?\*?$/i,
        /^#+\s*\*?\*?work\s+history\*?\*?$/i,
        /^#+\s*\*?\*?career\*?\*?$/i
      ],
      projects: [
        /^#+\s*\*?\*?projects\*?\*?$/i,
        /^#+\s*\*?\*?project\*?\*?$/i,
        /^#+\s*\*?\*?portfolio\*?\*?$/i,
        /^#+\s*\*?\*?key\s+projects\*?\*?$/i,
        /^#+\s*\*?\*?selected\s+projects\*?\*?$/i
      ]
    };

    return patterns[sectionType as keyof typeof patterns].some(pattern => pattern.test(line));
  }

  private static isCompanyName(line: string): boolean {
    const cleanLine = this.cleanMarkdown(line).trim();
    
    // Company names are typically bold text (markdown **text**) OR plain text with specific patterns
    return (
      // Markdown bold text
      (line.startsWith('**') && line.endsWith('**') && 
       line.length > 4 && 
       line.length < 100 &&
       !line.includes('•') && 
       !line.includes('*') && 
       !this.isDate(line) &&
       !this.isDuration(line)) ||
      // Plain text company names
      (cleanLine.length > 3 && 
       cleanLine.length < 200 && // Increased length for long company names with locations
       !cleanLine.includes('•') && 
       !cleanLine.includes('*') && 
       !this.isJobTitle(cleanLine) && // Exclude job titles
       (
         // All caps company names (but not section headers)
         (cleanLine === cleanLine.toUpperCase() && 
          !/^(EDUCATION|WORK EXPERIENCE|SOFTWARE PROJECTS|TECHNICAL SKILLS|PROJECTS|SKILLS|PERSONAL SUMMARY)$/i.test(cleanLine)) ||
         // Company names with Inc, Corp, LLC, etc.
         /(Inc|Corp|LLC|Ltd|Company|University|Institute|College)$/i.test(cleanLine) ||
         // Names with location patterns (City, State)
         /,\s*[A-Z]{2}$/.test(cleanLine) ||
         // Names with tab-separated locations
         /\t.*,\s*[A-Z]{2}$/.test(line) ||
         // Simple company names (like "Equinix", "SICE", "Dinesh Engineering")
         (/^[A-Z][a-zA-Z\s]+$/.test(cleanLine) && 
          cleanLine.length < 50 && 
          !this.isJobTitle(cleanLine) &&
          !this.isDate(cleanLine) &&
          !this.isDuration(cleanLine)) ||
         // Company names with duration (like "Equinix 	Mar 2024 - Aug 2024")
         (/^[A-Z][a-zA-Z\s]+\s+[A-Za-z]+\s+\d{4}\s*[-–]\s*(?:[A-Za-z]+\s+\d{4}|Present|Current)/i.test(line))
       ))
    );
  }

  private static isJobTitle(line: string): boolean {
    const cleanLine = this.cleanMarkdown(line);
    return cleanLine.length > 3 && 
           cleanLine.length < 100 && 
           !cleanLine.includes('•') && 
           !cleanLine.includes('@') &&
           !this.isDate(cleanLine) &&
           !this.isDuration(cleanLine) &&
           (
             // Markdown italic text
             line.startsWith('*') || 
             line.startsWith('##') || 
             // Job titles with common patterns
             /(Engineer|Developer|Analyst|Manager|Director|Associate|Intern|Researcher|Specialist|Consultant)/i.test(cleanLine) ||
             // All caps job titles
             cleanLine === cleanLine.toUpperCase() ||
             // Title case patterns
             !!cleanLine.match(/^[A-Z][a-zA-Z\s&]+$/) || 
             !!cleanLine.match(/^[A-Z][a-zA-Z\s&]+[A-Z][a-zA-Z\s&]*$/)
           );
  }

  private static isDuration(line: string): boolean {
    return !!(line.match(/\d{4}|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i) ||
           line.match(/\d{4}\s*[-–]\s*\d{4}/) ||
           line.match(/\d{4}\s*[-–]\s*(present|current)/i) ||
           line.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}\b/i));
  }

  private static isDate(line: string): boolean {
    return line.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/) !== null ||
           line.match(/\b\d{4}\b/) !== null;
  }

  private static isBulletPoint(line: string): boolean {
    const cleanLine = this.cleanMarkdown(line).trim();
    
    return (
      // Traditional bullet points
      line.startsWith('*') || 
      line.includes('•') || 
      line.includes('-') || 
      line.match(/^\d+\./) !== null ||
      line.match(/^[a-z]\)/) !== null ||
      // Plain text bullet points (common in resumes)
      (cleanLine.length > 10 && 
       cleanLine.length < 200 &&
       !this.isCompanyName(line) &&
       !this.isJobTitle(line) &&
       !this.isProjectName(line) &&
       !this.isDate(cleanLine) &&
       !this.isDuration(cleanLine) &&
       // Look for action verbs or descriptive text
       /^(Developed|Implemented|Built|Created|Designed|Led|Managed|Optimized|Enhanced|Delivered|Streamlined|Achieved|Addressed|Enabled|Directed|Revamped|Successfully|Made|Built|Integrated)/i.test(cleanLine))
    );
  }

  private static cleanBulletPoint(line: string): string {
    return line
      .replace(/^\*\s*/, '')      // Remove markdown bullet
      .replace(/^[•\-*]\s*/, '')  // Remove other bullet types
      .replace(/^\d+\.\s*/, '')   // Remove numbered bullets
      .replace(/^[a-z]\)\s*/, '') // Remove lettered bullets
      .trim();
  }

  private static isProjectName(line: string): boolean {
    const cleanLine = this.cleanMarkdown(line).trim();
    
    return (
      // Markdown bold text
      (line.startsWith('**') && line.endsWith('**') && 
       line.length > 4 && 
       line.length < 100 &&
       !line.includes('•') && 
       !line.includes('*') && 
       !this.isDate(line) &&
       !this.isDuration(line)) ||
      // Plain text project names
      (cleanLine.length > 4 && 
       cleanLine.length < 150 &&
       !cleanLine.includes('•') && 
       !cleanLine.includes('*') && 
       !this.isDate(cleanLine) &&
       !this.isDuration(cleanLine) &&
       !this.isCompanyName(line) &&
       !this.isJobTitle(line) &&
       (
         // Project names with technology mentions
         /(Python|JavaScript|Java|React|Node|Docker|ML|AI|Machine Learning|Docker|HTML|Git|Verilog|UVM|SystemVerilog|STM32|Embedded|ASIC|FPGA)/i.test(cleanLine) ||
         // Title case project names
         /^[A-Z][a-zA-Z\s\-&]+$/.test(cleanLine) ||
         // Project names with specific patterns
         /(Answer Checker|detection|platform|model|system|application|tool|service|Interface|Verification|Implementation|Parking|Linux|BSP|Yocto)/i.test(cleanLine) ||
         // Project names with parentheses (like "Smart-Multi Level Car Parking(STM32, Embedded C, I2C, PWM, Solar Integration)")
         /\([^)]+\)$/.test(cleanLine)
       ))
    );
  }
}
