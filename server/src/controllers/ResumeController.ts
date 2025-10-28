import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { DocumentParser } from '../services/DocumentParser';
import { AIResumeParser } from '../services/AIResumeParser';
import { VersionManager } from '../services/VersionManager';
import { ExportService } from '../services/ExportService';
import { ApiResponse } from '../types';
import { logger } from '../services/Logger';

export class ResumeController {
  private static upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
      }
    })
  });

  /**
   * Upload and parse resume
   */
  static async uploadResume(req: Request, res: Response): Promise<void> {
    try {
      logger.apiRequest('POST', '/api/upload', { 
        fileName: req.file?.originalname,
        fileSize: req.file?.size 
      });
      
      if (!req.file) {
        logger.warn('No file uploaded in request', {}, 'ResumeController');
        res.status(400).json({ success: false, error: 'No file uploaded' });
        return;
      }

      const filePath = req.file.path;
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      
      logger.info('Processing uploaded file', {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileExtension,
        filePath
      }, 'ResumeController');
      
      // Use AI-enhanced parser for better accuracy
      const parsedData = await AIResumeParser.parseResume(filePath, fileExtension);
      
      // Add document reference for format preservation
      parsedData.originalDocument = {
        fileName: req.file.originalname,
        filePath: filePath,
        fileType: fileExtension,
        uploadDate: new Date().toISOString()
      };
      
      // Validate parsing quality
      const validation = AIResumeParser.validateParsedData(parsedData);
      logger.info('Resume parsing validation', {
        qualityScore: validation.score,
        issues: validation.issues,
        documentReference: parsedData.originalDocument
      }, 'ResumeController');
      
      logger.info('Resume parsing completed', {
        textLength: parsedData.text.length,
        sections: {
          personalSummary: parsedData.sections.personalSummary?.length || 0,
          workExperience: parsedData.sections.workExperience?.length || 0,
          projects: parsedData.sections.projects?.length || 0,
          dynamicSections: Object.keys(parsedData.sections.dynamicSections || {}).length
        }
      }, 'ResumeController');
      
      // Clean up uploaded file
      await fs.remove(filePath);
      logger.debug('Uploaded file cleaned up', { filePath }, 'ResumeController');

      const response: ApiResponse = {
        success: true,
        data: {
          sections: parsedData.sections,
          originalText: parsedData.text
        }
      };

      logger.apiResponse('POST', '/api/upload', 200, { 
        sectionsCount: Object.keys(parsedData.sections.dynamicSections || {}).length 
      });
      res.json(response);

    } catch (error) {
      logger.error('Upload processing failed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        fileName: req.file?.originalname 
      }, 'ResumeController');
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Save resume version
   */
  static async saveVersion(req: Request, res: Response): Promise<void> {
    try {
      const { companyName, sections } = req.body;
      
      if (!companyName || !sections) {
        res.status(400).json({ 
          success: false, 
          error: 'Company name and sections are required' 
        });
        return;
      }

      const versionId = await VersionManager.saveVersion(companyName, sections);

      const response: ApiResponse = {
        success: true,
        data: { versionId },
        message: 'Version saved successfully'
      };

      res.json(response);

    } catch (error) {
      console.error('Save version error:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save version'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get all saved versions
   */
  static async getVersions(req: Request, res: Response): Promise<void> {
    try {
      console.log('📋 GET /api/versions - Fetching saved versions');
      const versions = await VersionManager.getAllVersions();
      console.log(`📋 Found ${versions.length} saved versions`);

      const response: ApiResponse = {
        success: true,
        data: { versions }
      };

      res.json(response);

    } catch (error) {
      console.error('❌ Get versions error:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load versions'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Update a version's company name
   */
  static async updateVersionCompanyName(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { companyName } = req.body;
      
      logger.apiRequest('PUT', `/api/versions/${id}/company-name`, { versionId: id, companyName });
      
      if (!id) {
        res.status(400).json({ success: false, error: 'Version ID is required' });
        return;
      }
      
      if (!companyName || !companyName.trim()) {
        res.status(400).json({ success: false, error: 'Company name is required' });
        return;
      }
      
      const updated = await VersionManager.updateVersionCompanyName(id, companyName.trim());
      
      if (!updated) {
        logger.warn('Version not found for company name update', { versionId: id }, 'ResumeController');
        res.status(404).json({ success: false, error: 'Version not found' });
        return;
      }
      
      logger.info('Version company name updated successfully', { versionId: id, newCompanyName: companyName.trim() }, 'ResumeController');
      const response: ApiResponse = { success: true, message: 'Company name updated successfully' };
      res.json(response);
      
    } catch (error) {
      logger.error('Update version company name error', { 
        error: error instanceof Error ? error.message : 'Unknown error', 
        versionId: req.params.id 
      }, 'ResumeController');
      const response: ApiResponse = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update company name' 
      };
      res.status(500).json(response);
    }
  }

  /**
   * Delete a version
   */
  static async deleteVersion(req: Request, res: Response): Promise<void> {
    try {
      const versionId = req.params.id;
      
      logger.apiRequest('DELETE', `/api/versions/${versionId}`, { versionId });

      if (!versionId) {
        res.status(400).json({ 
          success: false, 
          error: 'Version ID is required' 
        });
        return;
      }

      const deleted = await VersionManager.deleteVersion(versionId);

      if (!deleted) {
        logger.warn('Version not found for deletion', { versionId }, 'ResumeController');
        res.status(404).json({ 
          success: false, 
          error: 'Version not found' 
        });
        return;
      }

      logger.info('Version deleted successfully', { versionId }, 'ResumeController');

      const response: ApiResponse = {
        success: true,
        message: 'Version deleted successfully'
      };

      res.json(response);

    } catch (error) {
      logger.error('Delete version error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        versionId: req.params.id
      }, 'ResumeController');
      
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete version'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Export resume as Word document
   */
  static async exportWord(req: Request, res: Response): Promise<void> {
    try {
      const { sections, companyName } = req.body;
      
      if (!sections || !companyName) {
        res.status(400).json({ 
          success: false, 
          error: 'Sections and company name are required' 
        });
        return;
      }

      const buffer = await ExportService.exportToWord(sections, companyName);
      const fileName = `Resume_${companyName.replace(/\s+/g, '_')}_${Date.now()}.docx`;
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);

    } catch (error) {
      console.error('Export Word error:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export Word document'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Export resume as PDF
   */
  static async exportPDF(req: Request, res: Response): Promise<void> {
    try {
      const { sections, companyName } = req.body;
      
      if (!sections || !companyName) {
        res.status(400).json({ 
          success: false, 
          error: 'Sections and company name are required' 
        });
        return;
      }

      const buffer = await ExportService.exportToPDF(sections, companyName);
      const fileName = `Resume_${companyName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);

    } catch (error) {
      console.error('Export PDF error:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export PDF'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get multer upload middleware
   */
  static getUploadMiddleware() {
    return this.upload.single('resume');
  }
}
