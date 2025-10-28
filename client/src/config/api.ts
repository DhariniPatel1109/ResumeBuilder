// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  UPLOAD: `${API_BASE_URL}/api/upload`,
  SAVE_VERSION: `${API_BASE_URL}/api/save-version`,
  GET_VERSIONS: `${API_BASE_URL}/api/versions`,
  UPDATE_VERSION_COMPANY_NAME: `${API_BASE_URL}/api/versions`,
  DELETE_VERSION: `${API_BASE_URL}/api/versions`,
  EXPORT_WORD: `${API_BASE_URL}/api/export/word`,
  EXPORT_PDF: `${API_BASE_URL}/api/export/pdf`,
  // AI Enhancement endpoints
  AI_ENHANCE: `${API_BASE_URL}/api/ai/enhance`,
  AI_STATUS: `${API_BASE_URL}/api/ai/status`,
  AI_APPLY: `${API_BASE_URL}/api/ai/apply`,
} as const;

export default API_BASE_URL;
