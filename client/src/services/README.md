# Services Layer Documentation

## Overview

This directory contains centralized services that manage all API calls and business logic for the ResumeBuilder frontend application. This architecture provides better separation of concerns, improved maintainability, and easier testing.

## Services

### 1. VersionService (`versionService.ts`)

**Purpose**: Manages resume version operations

**Key Methods**:
- `getVersions()` - Fetch all saved versions
- `saveVersion(request)` - Save a new version
- `deleteVersion(versionId)` - Delete a version
- `loadVersionForEditing(version)` - Load version data for editing
- `getVersionStats(versions)` - Calculate version statistics
- `getRelativeTime(dateString)` - Format relative time display
- `getVersionPreview(sections)` - Generate preview text
- `getVersionHighlights(sections)` - Extract key highlights

**Types**:
- `Version` - Version data structure
- `SaveVersionRequest` - Request payload for saving
- `SaveVersionResponse` - Response from save operation
- `GetVersionsResponse` - Response from fetch operation

### 2. ResumeService (`resumeService.ts`)

**Purpose**: Manages resume data and file operations

**Key Methods**:
- `uploadResume(file)` - Upload resume file
- `loadResumeFromStorage()` - Load from session storage
- `saveResumeToStorage(data)` - Save to session storage
- `clearResumeFromStorage()` - Clear session storage
- `updateSection(data, sectionType, data)` - Update specific section
- `updateDynamicSection(data, sectionName, content)` - Update dynamic section
- `validateResumeData(data)` - Validate data structure
- `getResumePreview(sections)` - Generate preview text
- `getResumeHighlights(sections)` - Extract highlights
- `hasResumeInStorage()` - Check if data exists
- `getFileType(fileName)` - Get MIME type
- `formatFileSize(bytes)` - Format file size display

**Types**:
- `ResumeData` - Resume data structure
- `UploadRequest` - File upload request
- `UploadResponse` - Upload response

### 3. ExportService (`exportService.ts`)

**Purpose**: Handles resume export functionality

**Key Methods**:
- `exportResume(format, request)` - Export resume
- `exportVersion(format, version)` - Export version
- `validateExportRequest(request)` - Validate export request
- `getSupportedFormats()` - Get available formats
- `getMimeType(format)` - Get MIME type
- `isFormatSupported(format)` - Check format support
- `getExportStatusMessage(format, isExporting)` - Get status message
- `simulateExportProgress()` - Simulate progress

**Types**:
- `ExportFormat` - Supported export formats ('word' | 'pdf')
- `ExportRequest` - Export request payload
- `ExportResponse` - Export response

### 4. AIService (`aiService.ts`)

**Purpose**: Manages AI enhancement features

**Key Methods**:
- `enhanceResume(request)` - Enhance resume with AI
- `getProcessingStatus(sessionId)` - Get processing status
- `applySuggestions(sessionId, suggestionIds)` - Apply AI suggestions
- `validateJobDescription(description)` - Validate job description
- `simulateProcessingStages()` - Simulate processing stages

## Usage Examples

### Using VersionService

```typescript
import { VersionService } from '../services';

// Fetch all versions
const versions = await VersionService.getVersions();

// Save a new version
const response = await VersionService.saveVersion({
  companyName: 'Google',
  sections: resumeData.sections,
  originalDocument: resumeData.originalDocument
});

// Load version for editing
VersionService.loadVersionForEditing(version);
```

### Using ResumeService

```typescript
import { ResumeService } from '../services';

// Upload resume file
const response = await ResumeService.uploadResume(file);

// Load from storage
const resumeData = ResumeService.loadResumeFromStorage();

// Update section
const updatedData = ResumeService.updateSection(resumeData, 'workExperience', newData);
ResumeService.saveResumeToStorage(updatedData);
```

### Using ExportService

```typescript
import { ExportService } from '../services';

// Export resume
await ExportService.exportResume('pdf', {
  sections: resumeData.sections,
  companyName: 'Google',
  originalDocument: resumeData.originalDocument
});

// Export version
await ExportService.exportVersion('word', version);
```

## Benefits

1. **Centralized Logic**: All API calls and business logic in one place
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Error Handling**: Consistent error handling across all services
4. **Reusability**: Services can be used across multiple components
5. **Testability**: Easy to unit test individual services
6. **Maintainability**: Changes to API endpoints only require service updates
7. **Consistency**: Uniform data handling and response processing

## Migration Notes

The following components have been refactored to use these services:

- `pages/Versions.tsx` - Now uses VersionService and ExportService
- `hooks/useResumeData.ts` - Now uses all services
- `components/forms/FileUpload.tsx` - Now uses ResumeService

All direct axios calls and API endpoint references have been removed from these components.
