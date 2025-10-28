/**
 * DOC Modification Routes
 * API endpoints for modifying DOC files
 */

import { Router } from 'express';
import { DocModificationController } from '../controllers/DocModificationController';

const router = Router();

// DOC modification endpoints
router.post('/modify', DocModificationController.modifySentence);
router.post('/extract-text', DocModificationController.extractText);
router.post('/validate-sentence', DocModificationController.validateSentence);

export default router;
