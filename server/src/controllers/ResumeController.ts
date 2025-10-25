import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { DocumentParser } from '../services/DocumentParser';
import { VersionManager } from '../services/VersionManager';
import { ExportService } from '../services/ExportService';
import { ApiResponse } from '../types';

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
      console.log('📤 POST /api/upload - File upload received');
      
      if (!req.file) {
        console.log('❌ No file uploaded');
        res.status(400).json({ success: false, error: 'No file uploaded' });
        return;
      }

      console.log(`📄 Processing file: ${req.file.originalname} (${req.file.size} bytes)`);
      const filePath = req.file.path;
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      
      const parsedData = await DocumentParser.parseResume(filePath, fileExtension);
      
      // Debug logging
      console.log('📊 Parsed text length:', parsedData.text.length);
      console.log('📊 Detected sections:', {
        personalSummary: parsedData.sections.personalSummary.length,
        workExperience: parsedData.sections.workExperience.length,
        projects: parsedData.sections.projects.length
      });
      
      // Clean up uploaded file
      await fs.remove(filePath);

      const response: ApiResponse = {
        success: true,
        data: {
          sections: parsedData.sections,
          originalText: parsedData.text
        }
      };

      res.json(response);

    } catch (error) {
      console.error('Upload error:', error);
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
