/**
 * DOC Modification Controller
 * Handles API requests for modifying DOC files
 */

import { Request, Response } from 'express';
import { DocModificationService, ModificationRequest } from '../services/DocModificationService';
import { logger } from '../services/Logger';
import { ApiResponse } from '../types';

export class DocModificationController {
  /**
   * Modify a sentence in a DOC file
   */
  static async modifySentence(req: Request, res: Response): Promise<void> {
    try {
      const { filePath, originalSentence, newSentence, outputPath } = req.body;

      // Validate required fields
      if (!filePath || !originalSentence || !newSentence) {
        const response: ApiResponse = {
          success: false,
          error: 'Missing required fields: filePath, originalSentence, newSentence'
        };
        res.status(400).json(response);
        return;
      }

      logger.apiRequest('POST', '/api/doc/modify', { 
        filePath, 
        originalSentence: originalSentence.substring(0, 50) + '...',
        newSentence: newSentence.substring(0, 50) + '...'
      });

      // Check if file exists
      const fs = require('fs-extra');
      if (!await fs.pathExists(filePath)) {
        const response: ApiResponse = {
          success: false,
          error: 'File not found'
        };
        res.status(404).json(response);
        return;
      }

      // Validate that the original sentence exists in the document
      const sentenceExists = await DocModificationService.validateSentence(filePath, originalSentence);
      if (!sentenceExists) {
        const response: ApiResponse = {
          success: false,
          error: 'Original sentence not found in the document'
        };
        res.status(400).json(response);
        return;
      }

      // Perform the modification
      const result = await DocModificationService.modifySentence({
        filePath,
        originalSentence,
        newSentence,
        outputPath
      });

      if (result.success) {
        logger.info('DOC modification successful', { 
          filePath, 
          outputPath: result.outputPath 
        });
        
        const response: ApiResponse = {
          success: true,
          message: 'Document modified successfully',
          data: {
            outputPath: result.outputPath,
            changes: result.changes
          }
        };
        res.json(response);
      } else {
        logger.warn('DOC modification failed', { 
          error: result.error, 
          filePath 
        });
        
        const response: ApiResponse = {
          success: false,
          error: result.error || 'Failed to modify document'
        };
        res.status(500).json(response);
      }

    } catch (error) {
      logger.error('DOC modification controller error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        body: req.body
      });

      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Extract text content from a DOC file
   */
  static async extractText(req: Request, res: Response): Promise<void> {
    try {
      const { filePath } = req.body;

      if (!filePath) {
        const response: ApiResponse = {
          success: false,
          error: 'Missing required field: filePath'
        };
        res.status(400).json(response);
        return;
      }

      logger.apiRequest('POST', '/api/doc/extract-text', { filePath });

      // Check if file exists
      const fs = require('fs-extra');
      if (!await fs.pathExists(filePath)) {
        const response: ApiResponse = {
          success: false,
          error: 'File not found'
        };
        res.status(404).json(response);
        return;
      }

      const text = await DocModificationService.extractText(filePath);

      const response: ApiResponse = {
        success: true,
        message: 'Text extracted successfully',
        data: { text }
      };
      res.json(response);

    } catch (error) {
      logger.error('Text extraction error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        body: req.body
      });

      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract text'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Validate if a sentence exists in a DOC file
   */
  static async validateSentence(req: Request, res: Response): Promise<void> {
    try {
      const { filePath, sentence } = req.body;

      if (!filePath || !sentence) {
        const response: ApiResponse = {
          success: false,
          error: 'Missing required fields: filePath, sentence'
        };
        res.status(400).json(response);
        return;
      }

      logger.apiRequest('POST', '/api/doc/validate-sentence', { 
        filePath, 
        sentence: sentence.substring(0, 50) + '...'
      });

      // Check if file exists
      const fs = require('fs-extra');
      if (!await fs.pathExists(filePath)) {
        const response: ApiResponse = {
          success: false,
          error: 'File not found'
        };
        res.status(404).json(response);
        return;
      }

      const exists = await DocModificationService.validateSentence(filePath, sentence);

      const response: ApiResponse = {
        success: true,
        message: 'Sentence validation completed',
        data: { exists }
      };
      res.json(response);

    } catch (error) {
      logger.error('Sentence validation error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        body: req.body
      });

      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to validate sentence'
      };
      res.status(500).json(response);
    }
  }
}
