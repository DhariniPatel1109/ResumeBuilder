/**
 * PDF Modification Routes
 * Defines API routes for PDF file modification
 */

import { Router } from 'express';
import { PDFModificationController, uploadMiddleware } from '../controllers/PDFModificationController';

const router = Router();

// PDF modification routes
router.post('/modify', uploadMiddleware, PDFModificationController.modifyPDF);
router.post('/extract-text', PDFModificationController.extractText);
router.post('/validate-text', PDFModificationController.validateText);

export default router;
