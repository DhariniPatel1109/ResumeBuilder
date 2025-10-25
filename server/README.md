# ResumeBuilder Server 🚀

A modern, TypeScript-based backend server for the ResumeBuilder application.

## 🏗️ Architecture

### **Clean Architecture Structure**
```
server/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── types/           # TypeScript interfaces
│   ├── app.ts          # Express app configuration
│   └── index.ts        # Server entry point
├── dist/               # Compiled JavaScript
├── uploads/            # Temporary file storage
├── versions/           # Saved resume versions
└── package.json
```

## 🛠️ Features

### **Modern TypeScript Server**
- ✅ **Type Safety**: Full TypeScript support with strict typing
- ✅ **Clean Architecture**: Separation of concerns with controllers, services, and routes
- ✅ **Error Handling**: Centralized error handling with proper HTTP status codes
- ✅ **Validation**: Request validation using Joi schemas
- ✅ **Security**: Helmet, CORS, and rate limiting
- ✅ **Documentation**: Self-documenting code with TypeScript interfaces

### **Services**
- **DocumentParser**: Handles Word/PDF parsing and section detection
- **VersionManager**: Manages saved resume versions
- **ExportService**: Generates Word and PDF exports

### **Controllers**
- **ResumeController**: Handles all resume-related operations
  - Upload and parse resumes
  - Save/load versions
  - Export to Word/PDF

## 🚀 Development

### **Prerequisites**
- Node.js (v18+)
- TypeScript
- npm or yarn

### **Installation**
```bash
cd server
npm install
```

### **Development Server**
```bash
npm run dev
```

### **Build for Production**
```bash
npm run build
npm start
```

## 📡 API Endpoints

### **Resume Operations**
- `POST /api/upload` - Upload and parse resume
- `POST /api/save-version` - Save resume version
- `GET /api/versions` - Get all saved versions
- `POST /api/export/word` - Export as Word document
- `POST /api/export/pdf` - Export as PDF

### **Health Check**
- `GET /health` - Server health status

## 🔧 Configuration

### **Environment Variables**
```bash
PORT=5000                    # Server port
NODE_ENV=development         # Environment
CLIENT_URL=http://localhost:3000  # CORS origin
```

### **File Upload Limits**
- Max file size: 10MB
- Supported formats: .docx, .doc, .pdf
- Temporary storage: `uploads/` directory

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schema validation
- **File Type Validation**: Only allowed file types

## 📊 Error Handling

### **Structured Error Responses**
```typescript
{
  success: false,
  error: "Error message",
  data?: any
}
```

### **HTTP Status Codes**
- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

## 🧪 Testing

```bash
npm test
```

## 📈 Performance

- **File Processing**: Optimized document parsing
- **Memory Management**: Automatic cleanup of temporary files
- **Rate Limiting**: Prevents abuse
- **Error Recovery**: Graceful error handling

## 🔄 Development Workflow

1. **Make Changes**: Edit TypeScript files in `src/`
2. **Auto-Reload**: `ts-node-dev` watches for changes
3. **Type Checking**: TypeScript compiler validates types
4. **Testing**: Run tests to ensure functionality
5. **Build**: Compile to JavaScript for production

## 📚 Code Organization

### **Controllers**
Handle HTTP requests and responses, delegate to services

### **Services**
Contain business logic, data processing, and external integrations

### **Routes**
Define API endpoints and middleware

### **Middleware**
Cross-cutting concerns like validation, error handling, security

### **Types**
TypeScript interfaces for type safety and documentation

## 🚀 Deployment

### **Production Build**
```bash
npm run build
npm start
```

### **Docker Support**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 5000
CMD ["npm", "start"]
```

---

**Modern, Maintainable, and Type-Safe! 🎯**
