import { Router } from 'express';
import { ResumeController } from '../controllers/ResumeController';

const router = Router();

// Upload and parse resume
router.post('/upload', ResumeController.getUploadMiddleware(), ResumeController.uploadResume);

// Save resume version
router.post('/save-version', ResumeController.saveVersion);

// Get all saved versions
router.get('/versions', ResumeController.getVersions);

// Update a version's company name
router.put('/versions/:id/company-name', ResumeController.updateVersionCompanyName);

// Delete a version
router.delete('/versions/:id', ResumeController.deleteVersion);

// Export resume as Word document
router.post('/export/word', ResumeController.exportWord);

// Export resume as PDF
router.post('/export/pdf', ResumeController.exportPDF);

export default router;
