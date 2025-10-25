// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  UPLOAD: `${API_BASE_URL}/api/upload`,
  SAVE_VERSION: `${API_BASE_URL}/api/save-version`,
  GET_VERSIONS: `${API_BASE_URL}/api/versions`,
  EXPORT_WORD: `${API_BASE_URL}/api/export/word`,
  EXPORT_PDF: `${API_BASE_URL}/api/export/pdf`,
} as const;

export default API_BASE_URL;
