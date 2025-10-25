# API Configuration

## Environment Variables

Create a `.env.local` file in the client directory with:

```bash
# Development
REACT_APP_API_URL=http://localhost:5000

# Production
# REACT_APP_API_URL=https://your-api-domain.com
```

## Usage

The API configuration is centralized in `src/config/api.ts`:

```typescript
import { API_ENDPOINTS } from '../config/api';

// Use in components
const response = await axios.post(API_ENDPOINTS.UPLOAD, formData);
```

## Available Endpoints

- `API_ENDPOINTS.UPLOAD` - Upload resume
- `API_ENDPOINTS.SAVE_VERSION` - Save version
- `API_ENDPOINTS.GET_VERSIONS` - Get versions
- `API_ENDPOINTS.EXPORT_WORD` - Export Word
- `API_ENDPOINTS.EXPORT_PDF` - Export PDF
