import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs-extra';
import resumeRoutes from './routes/resumeRoutes';
import aiRoutes from './routes/aiRoutes';
import docModificationRoutes from './routes/docModificationRoutes';
import pdfModificationRoutes from './routes/pdfModificationRoutes';
import templateRoutes from './routes/templateRoutes';
import { ErrorHandler } from './middleware/errorHandler';
import { config } from './config';
import { env } from './config/env';
import { API_CONSTANTS } from './config/constants';

const app = express();

// Security middleware
app.use(helmet(config.security.helmet));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: API_CONSTANTS.MESSAGES.TOO_MANY_REQUESTS || 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: `${config.upload.maxFileSize / 1024 / 1024}mb` }));
app.use(express.urlencoded({ extended: true, limit: `${config.upload.maxFileSize / 1024 / 1024}mb` }));

// Static file serving
app.use(`/${config.directories.uploads}`, express.static(config.directories.uploads));

// Ensure required directories exist
const ensureDirectories = async () => {
  await fs.ensureDir(config.directories.uploads);
  await fs.ensureDir(config.directories.versions);
};
ensureDirectories();

// API routes
app.use('/api', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/doc', docModificationRoutes);
app.use('/api/pdf', pdfModificationRoutes);
app.use('/api/template', templateRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: API_CONSTANTS.MESSAGES.HEALTH_CHECK,
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
    version: config.api.version
  });
});

// 404 handler
app.use(ErrorHandler.notFound);

// Global error handler
app.use(ErrorHandler.handle);

export default app;
