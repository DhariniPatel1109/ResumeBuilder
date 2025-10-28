/**
 * Template Service
 * Generates resumes from templates with placeholders
 * Much more reliable than document modification
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { logger } from './Logger';

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
  outputPath?: string;
}

export interface TemplateGenerationResult {
  success: boolean;
  outputPath?: string;
  error?: string;
}

export class TemplateService {
  /**
   * Generate a resume from template data
   */
  static async generateResume(request: TemplateGenerationRequest): Promise<TemplateGenerationResult> {
    try {
      logger.info('Starting template-based resume generation', { 
        templateName: request.templateName || 'default',
        hasExperience: request.resumeData.experience.length > 0,
        hasEducation: request.resumeData.education.length > 0
      });

      // Create the document
      const doc = new Document({
        sections: [{
          properties: {},
          children: this.buildResumeContent(request.resumeData)
        }]
      });

      // Generate output path if not provided
      const outputPath = request.outputPath || this.generateOutputPath(request.resumeData.personalInfo.name);

      // Save the document
      const buffer = await Packer.toBuffer(doc);
      await fs.writeFile(outputPath, buffer);

      logger.info('Template-based resume generation completed successfully', { 
        outputPath,
        templateName: request.templateName || 'default'
      });

      return {
        success: true,
        outputPath
      };

    } catch (error) {
      logger.error('Template-based resume generation failed', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Build resume content from data
   */
  private static buildResumeContent(data: ResumeData): Paragraph[] {
    const content: Paragraph[] = [];

    // Header with name and contact info
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.personalInfo.name,
            size: 32,
            bold: true,
            color: "2E86AB"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );

    // Contact information
    const contactInfo = [
      data.personalInfo.email,
      data.personalInfo.phone,
      data.personalInfo.location,
      data.personalInfo.linkedin,
      data.personalInfo.github
    ].filter(Boolean).join(' • ');

    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactInfo,
            size: 20,
            color: "666666"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    // Professional Summary
    if (data.summary) {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "PROFESSIONAL SUMMARY",
              size: 24,
              bold: true,
              color: "2E86AB",
              underline: {}
            })
          ],
          spacing: { before: 400, after: 200 }
        })
      );

      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.summary,
              size: 22
            })
          ],
          spacing: { after: 400 }
        })
      );
    }

    // Work Experience
    if (data.experience.length > 0) {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "WORK EXPERIENCE",
              size: 24,
              bold: true,
              color: "2E86AB",
              underline: {}
            })
          ],
          spacing: { before: 400, after: 200 }
        })
      );

      data.experience.forEach((exp, index) => {
        // Company and Position
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position,
                size: 22,
                bold: true
              }),
              new TextRun({
                text: ` at ${exp.company}`,
                size: 22
              })
            ],
            spacing: { before: index > 0 ? 300 : 0, after: 100 }
          })
        );

        // Duration and Location
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.duration} • ${exp.location}`,
                size: 20,
                italics: true,
                color: "666666"
              })
            ],
            spacing: { after: 200 }
          })
        );

        // Bullet points
        exp.bullets.forEach(bullet => {
          content.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "• ",
                  size: 22,
                  color: "2E86AB"
                }),
                new TextRun({
                  text: bullet,
                  size: 22
                })
              ],
              spacing: { after: 100 },
              indent: { left: 400 }
            })
          );
        });
      });
    }

    // Education
    if (data.education.length > 0) {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "EDUCATION",
              size: 24,
              bold: true,
              color: "2E86AB",
              underline: {}
            })
          ],
          spacing: { before: 400, after: 200 }
        })
      );

      data.education.forEach((edu, index) => {
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree,
                size: 22,
                bold: true
              }),
              new TextRun({
                text: ` - ${edu.institution}`,
                size: 22
              })
            ],
            spacing: { before: index > 0 ? 200 : 0, after: 100 }
          })
        );

        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.duration} • ${edu.location}`,
                size: 20,
                italics: true,
                color: "666666"
              })
            ],
            spacing: { after: 100 }
          })
        );

        if (edu.gpa) {
          content.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `GPA: ${edu.gpa}`,
                  size: 20,
                  color: "666666"
                })
              ],
              spacing: { after: 200 }
            })
          );
        }
      });
    }

    // Skills
    if (data.skills.length > 0) {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "SKILLS",
              size: 24,
              bold: true,
              color: "2E86AB",
              underline: {}
            })
          ],
          spacing: { before: 400, after: 200 }
        })
      );

      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.skills.join(' • '),
              size: 22
            })
          ],
          spacing: { after: 400 }
        })
      );
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "PROJECTS",
              size: 24,
              bold: true,
              color: "2E86AB",
              underline: {}
            })
          ],
          spacing: { before: 400, after: 200 }
        })
      );

      data.projects.forEach((project, index) => {
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.name,
                size: 22,
                bold: true
              })
            ],
            spacing: { before: index > 0 ? 300 : 0, after: 100 }
          })
        );

        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.description,
                size: 22
              })
            ],
            spacing: { after: 100 }
          })
        );

        if (project.technologies.length > 0) {
          content.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Technologies: ${project.technologies.join(', ')}`,
                  size: 20,
                  italics: true,
                  color: "666666"
                })
              ],
              spacing: { after: 200 }
            })
          );
        }
      });
    }

    return content;
  }

  /**
   * Generate output file path
   */
  private static generateOutputPath(name: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${name.replace(/\s+/g, '_')}_Resume_${timestamp}.docx`;
    return path.join(process.cwd(), 'uploads', fileName);
  }

  /**
   * Get available templates
   */
  static getAvailableTemplates(): string[] {
    return [
      'default',
      'modern',
      'classic',
      'minimal'
    ];
  }

  /**
   * Validate resume data
   */
  static validateResumeData(data: ResumeData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.personalInfo.name) errors.push('Name is required');
    if (!data.personalInfo.email) errors.push('Email is required');
    if (!data.personalInfo.phone) errors.push('Phone is required');
    if (!data.personalInfo.location) errors.push('Location is required');
    if (!data.summary) errors.push('Professional summary is required');
    if (!data.experience || data.experience.length === 0) errors.push('At least one work experience is required');
    if (!data.education || data.education.length === 0) errors.push('At least one education entry is required');
    if (!data.skills || data.skills.length === 0) errors.push('Skills are required');

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
