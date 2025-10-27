/**
 * Services Index - Centralized export of all services
 */

// Core services
export { default as VersionService } from './versionService';
export { default as ResumeService } from './resumeService';
export { default as ExportService } from './exportService';
export { default as AIService } from './aiService';

// Re-export types for convenience
export type { Version, SaveVersionRequest, SaveVersionResponse, GetVersionsResponse } from './versionService';
export type { UploadRequest, UploadResponse, ResumeData } from './resumeService';
export type { ExportFormat, ExportRequest, ExportResponse } from './exportService';
export type { AIEnhancementRequest, AIEnhancementResponse, AIProcessingStatus } from '../types/ai';
