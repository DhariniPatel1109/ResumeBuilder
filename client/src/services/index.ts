/**
 * Services Index - Centralized export of all services
 */

// Core services
export { default as VersionService } from './versionService';
export { default as ResumeService } from './resumeService';
export { default as ExportService } from './exportService';
export { default as AIService } from './aiService';
export { DocModificationService } from './docModificationService';
export { PDFModificationService } from './pdfModificationService';
export { TemplateService } from './templateService';

// Re-export types for convenience
export type { Version, SaveVersionRequest, SaveVersionResponse, GetVersionsResponse } from './versionService';
export type { UploadRequest, UploadResponse, ResumeData } from './resumeService';
export type { ExportFormat, ExportRequest, ExportResponse } from './exportService';
export type { AIEnhancementRequest, AIEnhancementResponse, AIProcessingStatus } from '../types/ai';
export type { DocModificationRequest, DocModificationResponse, TextExtractionResponse, SentenceValidationResponse } from './docModificationService';
export type { PDFModificationRequest, PDFModificationResponse, TextExtractionResponse as PDFTextExtractionResponse, TextValidationResponse } from './pdfModificationService';
export type { ResumeData as TemplateResumeData, TemplateGenerationRequest, TemplateGenerationResponse, TemplateValidationResponse, TemplatesResponse } from './templateService';
