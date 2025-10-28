/**
 * Template Controller
 * Handles template-based resume generation API endpoints
 */

import { Request, Response } from 'express';
import { TemplateService, ResumeData, TemplateGenerationRequest } from '../services/TemplateService';
import { logger } from '../services/Logger';
import { ApiResponse } from '../types';

export class TemplateController {
  /**
   * Generate resume from template
   */
  public static async generateResume(req: Request, res: Response): Promise<void> {
    logger.apiRequest('POST', '/api/template/generate', { body: req.body });

    const { resumeData, templateName } = req.body;

    if (!resumeData) {
      res.status(400).json({ success: false, error: 'Resume data is required' });
      return;
    }

    // Validate resume data
    const validation = TemplateService.validateResumeData(resumeData);
    if (!validation.valid) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid resume data',
        details: validation.errors
      });
      return;
    }

    try {
      const request: TemplateGenerationRequest = {
        resumeData,
        templateName: templateName || 'default'
      };

      const result = await TemplateService.generateResume(request);

      if (result.success && result.outputPath) {
        res.download(result.outputPath, `Resume_${resumeData.personalInfo.name.replace(/\s+/g, '_')}.docx`, async (err) => {
          if (err) {
            logger.error('Error downloading generated resume', { error: err.message, outputPath: result.outputPath });
            res.status(500).json({ success: false, error: 'Failed to download generated resume' });
          }
          // Clean up file after download
          try {
            const fs = require('fs-extra');
            await fs.remove(result.outputPath!);
          } catch (cleanupError) {
            logger.warn('Failed to clean up generated file', { error: cleanupError });
          }
        });
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      logger.error('Template generation API error', { error: error instanceof Error ? error.message : 'Unknown error' });
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate resume from template'
      });
    }
  }

  /**
   * Get available templates
   */
  public static async getTemplates(req: Request, res: Response): Promise<void> {
    logger.apiRequest('GET', '/api/template/templates');

    try {
      const templates = TemplateService.getAvailableTemplates();
      
      const response: ApiResponse = { 
        success: true, 
        data: { templates },
        message: 'Templates retrieved successfully'
      };
      res.json(response);
    } catch (error) {
      logger.error('Get templates error', { error: error instanceof Error ? error.message : 'Unknown error' });
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get templates'
      });
    }
  }

  /**
   * Validate resume data
   */
  public static async validateResumeData(req: Request, res: Response): Promise<void> {
    logger.apiRequest('POST', '/api/template/validate', { body: req.body });

    const { resumeData } = req.body;

    if (!resumeData) {
      res.status(400).json({ success: false, error: 'Resume data is required' });
      return;
    }

    try {
      const validation = TemplateService.validateResumeData(resumeData);
      
      const response: ApiResponse = { 
        success: true, 
        data: validation,
        message: validation.valid ? 'Resume data is valid' : 'Resume data has validation errors'
      };
      res.json(response);
    } catch (error) {
      logger.error('Resume data validation error', { error: error instanceof Error ? error.message : 'Unknown error' });
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to validate resume data'
      });
    }
  }
}
    