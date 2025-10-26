// AI Routes for Resume Enhancement
import { Router } from 'express';
import { AIController } from '../controllers/AIController';

const router = Router();

// AI Enhancement endpoints
router.post('/enhance', AIController.enhanceResume);
router.get('/status/:sessionId', AIController.getProcessingStatus);
router.post('/apply', AIController.applySuggestions);

export default router;
