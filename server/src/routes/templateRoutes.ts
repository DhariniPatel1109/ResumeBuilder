/**
 * Template Routes
 * API routes for template-based resume generation
 */

import { Router } from 'express';
import { TemplateController } from '../controllers/TemplateController';

const router = Router();

// Generate resume from template
router.post('/generate', TemplateController.generateResume);

// Get available templates
router.get('/templates', TemplateController.getTemplates);

// Validate resume data
router.post('/validate', TemplateController.validateResumeData);

export default router;
