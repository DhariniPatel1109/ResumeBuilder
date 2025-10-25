# Server Configuration 📋

## 🎯 Centralized Configuration System

The server now uses a centralized configuration system similar to the client's `api.ts`. All configuration is managed in the `src/config/` directory.

## 📁 Configuration Files

### **`index.ts` - Main Configuration**
```typescript
import { config } from './config';

// Access configuration
const port = config.server.port;
const corsOrigin = config.cors.origin;
```

### **`env.ts` - Environment Variables**
```typescript
import { env } from './config/env';

// Access environment variables
const isDevelopment = env.IS_DEVELOPMENT;
const port = env.PORT;
```

### **`constants.ts` - API Constants**
```typescript
import { API_CONSTANTS } from './config/constants';

// Access constants
const statusCode = API_CONSTANTS.STATUS.OK;
const message = API_CONSTANTS.MESSAGES.SUCCESS;
```

## 🔧 Configuration Options

### **Server Configuration**
```typescript
config.server = {
  port: 5000,                    // Server port
  host: 'localhost',             // Server host
  nodeEnv: 'development',        // Environment
}
```

### **CORS Configuration**
```typescript
config.cors = {
  origin: 'http://localhost:3000', // Client URL
  credentials: true,               // Allow credentials
}
```

### **File Upload Configuration**
```typescript
config.upload = {
  maxFileSize: 10485760,          // 10MB
  allowedTypes: ['.docx', '.doc', '.pdf'],
  tempDir: 'uploads',
}
```

### **Rate Limiting Configuration**
```typescript
config.rateLimit = {
  windowMs: 900000,               // 15 minutes
  max: 100,                       // 100 requests per window
}
```

## 🌍 Environment Variables

Create a `.env` file in the server directory:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Client Configuration
CLIENT_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
ENABLE_CONSOLE=true

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
VERSIONS_DIR=versions

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Security
CORS_ORIGIN=http://localhost:3000
ENABLE_HELMET=true
```

## 🚀 Usage Examples

### **Change Server Port**
```typescript
// In config/index.ts
export const config = {
  server: {
    port: process.env.PORT || 5001, // Changed from 5000 to 5001
  }
}
```

### **Change CORS Origin**
```typescript
// In config/index.ts
export const config = {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
  }
}
```

### **Change File Upload Limits**
```typescript
// In config/index.ts
export const config = {
  upload: {
    maxFileSize: 20 * 1024 * 1024, // 20MB instead of 10MB
  }
}
```

## 🔄 Environment-Specific Overrides

### **Development**
```typescript
if (config.server.nodeEnv === 'development') {
  config.rateLimit.max = 1000; // Higher limit for development
}
```

### **Production**
```typescript
if (config.server.nodeEnv === 'production') {
  config.cors.origin = process.env.CLIENT_URL;
  config.logging.enableConsole = false;
}
```

### **Test**
```typescript
if (config.server.nodeEnv === 'test') {
  config.server.port = 0; // Random port for tests
}
```

## 📊 Benefits

### **Centralized Management**
- ✅ All configuration in one place
- ✅ Easy to change settings
- ✅ Environment-specific overrides
- ✅ Type safety with TypeScript

### **Maintainability**
- ✅ No hardcoded values scattered throughout code
- ✅ Easy to update configuration
- ✅ Clear separation of concerns
- ✅ Self-documenting configuration

### **Flexibility**
- ✅ Environment variable support
- ✅ Development/production/test configurations
- ✅ Easy to add new configuration options
- ✅ Consistent configuration across the application

## 🎯 Quick Changes

### **Change Port**
1. Update `config/index.ts` or set `PORT` environment variable
2. Restart server

### **Change CORS Origin**
1. Update `config/index.ts` or set `CLIENT_URL` environment variable
2. Restart server

### **Change File Upload Limits**
1. Update `config/index.ts` or set `MAX_FILE_SIZE` environment variable
2. Restart server

---

**Centralized, Maintainable, and Type-Safe! 🚀**
