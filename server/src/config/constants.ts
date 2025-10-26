// API Constants
export const API_CONSTANTS = {
  // HTTP Status Codes
  STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
  },

  // API Messages
  MESSAGES: {
    SUCCESS: 'Operation completed successfully',
    ERROR: 'An error occurred',
    VALIDATION_ERROR: 'Validation failed',
    FILE_TOO_LARGE: 'File size exceeds maximum limit',
    INVALID_FILE_TYPE: 'Invalid file type',
    UPLOAD_SUCCESS: 'File uploaded and parsed successfully',
    VERSION_SAVED: 'Version saved successfully',
    EXPORT_SUCCESS: 'Export completed successfully',
    HEALTH_CHECK: 'Server is running',
    TOO_MANY_REQUESTS: 'Too many requests from this IP, please try again later.',
    MISSING_REQUIRED_FIELDS: 'Missing required fields',
    SESSION_NOT_FOUND: 'Session not found',
    INTERNAL_SERVER_ERROR: 'Internal server error',
  },

  // File Processing
  FILE_PROCESSING: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['.docx', '.doc', '.pdf'],
    SUPPORTED_MIME_TYPES: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/pdf',
    ],
  },

  // Section Detection
  SECTION_PATTERNS: {
    PERSONAL_SUMMARY: /^(summary|objective|profile|about|personal statement|overview)$/i,
    WORK_EXPERIENCE: /^(experience|work experience|employment|professional experience|work history|career)$/i,
    PROJECTS: /^(projects|project|portfolio|key projects|selected projects)$/i,
  },

  // Content Detection
  CONTENT_PATTERNS: {
    JOB_TITLE: /^[A-Z][a-zA-Z\s&]+$/,
    DURATION: /\d{4}|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i,
    BULLET_POINT: /^[•\-*]|^\d+\.|^[a-z]\)/,
    DATE: /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}\b/,
  },

  // Export Settings
  EXPORT: {
    WORD: {
      FONT_SIZES: {
        TITLE: 24,
        SUBTITLE: 20,
        BODY: 18,
      },
    },
    PDF: {
      FORMAT: 'A4',
      MARGIN: {
        TOP: '1in',
        RIGHT: '1in',
        BOTTOM: '1in',
        LEFT: '1in',
      },
    },
  },

  // Database/Storage
  STORAGE: {
    VERSIONS_DIR: 'versions',
    UPLOADS_DIR: 'uploads',
    TEMP_DIR: 'temp',
  },
} as const;

export default API_CONSTANTS;
