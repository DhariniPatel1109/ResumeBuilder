/**
 * PDF Modification Controller
 * Handles PDF file modification API endpoints
 */

import { Request, Response } from 'express';
import { PDFModificationService, PDFModificationRequest } from '../services/PDFModificationService';
import { logger } from '../services/Logger';
import { ApiResponse } from '../types';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs-extra';
import { config } from '../config';

// Setup multer for file uploads
const upload = multer({ dest: config.directories.uploads });

export class PDFModificationController {
  /**
   * Modify text in a PDF file
   */
  public static async modifyPDF(req: Request, res: Response): Promise<void> {
    logger.apiRequest('POST', '/api/pdf/modify', { body: req.body, file: req.file });

    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }

    const { originalText, newText } = req.body;

    if (!originalText || !newText) {
      await fs.remove(req.file.path); // Clean up uploaded file
      res.status(400).json({ success: false, error: 'Original text and new text are required' });
      return;
    }

    const filePath = req.file.path;
    const originalFileName = req.file.originalname;
    const fileExtension = path.extname(originalFileName);

    if (fileExtension.toLowerCase() !== '.pdf') {
      await fs.remove(filePath);
      res.status(400).json({ success: false, error: 'Only PDF files are supported' });
      return;
    }

    try {
      const request: PDFModificationRequest = {
        filePath,
        originalText,
        newText,
        outputPath: path.join(config.directories.uploads, `modified_${originalFileName}`)
      };

      const result = await PDFModificationService.modifyText(request);

      if (result.success && result.outputPath) {
        res.download(result.outputPath, `modified_${originalFileName}`, async (err) => {
          if (err) {
            logger.error('Error downloading modified PDF file', { error: err.message, outputPath: result.outputPath });
            res.status(500).json({ success: false, error: 'Failed to download modified file' });
          }
          // Clean up files after download
          await fs.remove(filePath);
          await fs.remove(result.outputPath!);
        });
      } else {
        await fs.remove(filePath); // Clean up uploaded file
        res.status(400).json(result);
      }
    } catch (error) {
      await fs.remove(filePath); // Clean up uploaded file
      logger.error('PDF modification API error', { error: error instanceof Error ? error.message : 'Unknown error' });
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Failed to modify PDF document' });
    }
  }

  /**
   * Extract text from PDF file
   */
  public static async extractText(req: Request, res: Response): Promise<void> {
    logger.apiRequest('POST', '/api/pdf/extract-text', { body: req.body });

    const { filePath } = req.body;

    if (!filePath) {
      res.status(400).json({ success: false, error: 'File path is required' });
      return;
    }

    try {
      const text = await PDFModificationService.extractText(filePath);
      
      const response: ApiResponse = { 
        success: true, 
        data: { text },
        message: 'Text extracted successfully'
      };
      res.json(response);
    } catch (error) {
      logger.error('PDF text extraction error', { error: error instanceof Error ? error.message : 'Unknown error' });
      const response: ApiResponse = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to extract text from PDF'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Validate if text exists in PDF file
   */
  public static async validateText(req: Request, res: Response): Promise<void> {
    logger.apiRequest('POST', '/api/pdf/validate-text', { body: req.body });

    const { filePath, text } = req.body;

    if (!filePath || !text) {
      res.status(400).json({ success: false, error: 'File path and text are required' });
      return;
    }

    try {
      const exists = await PDFModificationService.validateSentence(filePath, text);
      
      const response: ApiResponse = { 
        success: true, 
        data: { exists },
        message: exists ? 'Text found in PDF' : 'Text not found in PDF'
      };
      res.json(response);
    } catch (error) {
      logger.error('PDF text validation error', { error: error instanceof Error ? error.message : 'Unknown error' });
      const response: ApiResponse = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to validate text in PDF'
      };
      res.status(500).json(response);
    }
  }
}

export const uploadMiddleware = upload.single('pdfFile');
