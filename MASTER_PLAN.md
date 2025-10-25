# ResumeBuilder - Master Plan & Requirements 📋

## 🎯 Project Overview

**ResumeBuilder** is a powerful tool that allows users to customize their resumes for different job applications while preserving original formatting. Users can upload their existing resume, edit specific sections, and generate company-specific versions.

## 🚀 Core Problem Solved

- **Manual Resume Customization**: Users currently manually edit resumes for each job application
- **Format Loss**: Online tools often change resume formatting and structure
- **Version Management**: No easy way to maintain multiple resume versions
- **Time Consumption**: Repetitive editing for different companies/roles

## ✨ Key Features Implemented

### 1. **Resume Upload & Parsing**
- Support for Word (.docx, .doc) and PDF files
- Automatic section detection (Personal Summary, Work Experience, Projects)
- Format preservation during parsing

### 2. **Smart Section Editor**
- Editable text boxes for each resume section
- Targeted bullet point editing
- Add/remove bullet points dynamically
- Real-time preview of changes

### 3. **Version Management**
- Save multiple company-specific versions
- Timestamped version history
- Load any saved version for editing
- Company-based organization

### 4. **Export Options**
- Generate Word documents (.docx)
- Generate PDF files
- Company-specific file naming
- Maintain original formatting

## 🛠️ Technical Architecture

### **Backend (Node.js + Express)**
```
server.js                 # Main server file
├── Document Parsing      # mammoth.js (Word), pdf-parse (PDF)
├── File Management       # multer, fs-extra
├── Export Generation     # docx, puppeteer (PDF)
└── API Endpoints         # RESTful API
```

### **Frontend (React + TypeScript)**
```
client/src/
├── components/           # Reusable UI components
│   ├── Header.tsx
│   ├── FileUpload.tsx
│   ├── SectionEditor.tsx
│   └── ExportButtons.tsx
├── pages/               # Main application pages
│   ├── Home.tsx
│   ├── ResumeEditor.tsx
│   └── Versions.tsx
└── App.tsx             # Main application component
```

### **File Structure**
```
ResumeBuilder/
├── server.js              # Backend server
├── package.json           # Dependencies
├── uploads/              # Temporary file storage
├── versions/             # Saved resume versions
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Main pages
│   │   └── App.tsx       # Main app
│   └── public/
└── README.md             # Documentation
```

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload and parse resume file |
| POST | `/api/save-version` | Save customized resume version |
| GET | `/api/versions` | Get all saved versions |
| POST | `/api/export/word` | Export as Word document |
| POST | `/api/export/pdf` | Export as PDF |

## 🔧 Dependencies

### **Backend Dependencies**
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "multer": "^1.4.5-lts.1",
  "mammoth": "^1.6.0",
  "pdf-parse": "^1.1.1",
  "docx": "^8.5.0",
  "puppeteer": "^21.5.2",
  "fs-extra": "^11.1.1",
  "uuid": "^9.0.1"
}
```

### **Frontend Dependencies**
```json
{
  "react": "^18.2.0",
  "typescript": "^4.9.5",
  "axios": "^1.6.0",
  "react-router-dom": "^6.8.0"
}
```

## 🚀 Setup Instructions

### **Prerequisites**
- Node.js (v14 or higher)
- npm or yarn
- Git

### **Installation Steps**

1. **Clone Repository**
```bash
git clone <repository-url>
cd ResumeBuilder
```

2. **Install Dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

3. **Start Development Server**
```bash
# Start both backend and frontend
npm run dev

# Or start separately:
# Backend (port 5000)
npm run server

# Frontend (port 3000)
cd client && npm start
```

4. **Access Application**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📖 User Workflow

### **Step 1: Upload Resume**
1. Navigate to home page
2. Drag and drop resume file or click to browse
3. Supported formats: `.docx`, `.doc`, `.pdf`
4. System automatically parses and detects sections

### **Step 2: Edit Content**
1. Review auto-detected sections
2. Edit specific bullet points in text boxes
3. Modify job titles, company names, descriptions
4. Add/remove bullet points as needed

### **Step 3: Save & Export**
1. Enter company name for version
2. Save version for future reference
3. Export as Word or PDF
4. Files automatically named with company prefix

### **Step 4: Manage Versions**
1. View all saved versions
2. Load any version to continue editing
3. Each version timestamped and organized by company

## 🎯 Current Status

### ✅ **Completed Features**
- [x] Resume upload and parsing (Word/PDF)
- [x] Section auto-detection
- [x] Editable text boxes for content
- [x] Version management system
- [x] Export to Word and PDF
- [x] Company-specific file naming
- [x] Responsive UI design
- [x] File format preservation

### 🚧 **Future Enhancements**
- [ ] AI-powered content suggestions based on job descriptions
- [ ] Template library for different industries
- [ ] Integration with job boards
- [ ] Resume analytics and optimization tips
- [ ] Cloud storage integration
- [ ] Batch processing for multiple resumes
- [ ] Advanced formatting options

## 🔍 Technical Details

### **Document Parsing**
- **Word Files**: Uses `mammoth.js` to extract text while preserving structure
- **PDF Files**: Uses `pdf-parse` to extract text content
- **Section Detection**: Custom algorithm to identify Personal Summary, Work Experience, Projects

### **Export Generation**
- **Word Export**: Uses `docx` library to generate formatted Word documents
- **PDF Export**: Uses `puppeteer` to generate PDF from HTML template
- **Format Preservation**: Maintains original styling and layout

### **Data Storage**
- **File System**: Local storage for uploaded files and versions
- **Session Storage**: Temporary data storage in browser
- **Version Management**: JSON-based version tracking

## 🐛 Known Issues & Limitations

1. **File Size Limits**: Large PDF files may cause parsing issues
2. **Complex Formatting**: Some complex Word formatting may not be preserved perfectly
3. **Browser Compatibility**: Requires modern browsers with JavaScript enabled
4. **File Permissions**: Requires write access to project directory

## 🔒 Security Considerations

1. **File Upload Validation**: Only allow specific file types
2. **File Size Limits**: Implement reasonable size restrictions
3. **Temporary File Cleanup**: Remove uploaded files after processing
4. **Input Sanitization**: Sanitize all user inputs

## 📊 Performance Considerations

1. **File Processing**: Large files may take time to process
2. **Memory Usage**: PDF processing can be memory-intensive
3. **Concurrent Users**: Consider server resources for multiple users
4. **File Storage**: Implement cleanup for old temporary files

## 🧪 Testing Strategy

### **Unit Tests**
- API endpoint testing
- Document parsing accuracy
- Export generation validation

### **Integration Tests**
- End-to-end user workflows
- File upload and processing
- Version management operations

### **User Acceptance Tests**
- Resume parsing accuracy
- Format preservation quality
- User interface usability

## 📈 Deployment Options

### **Local Development**
- Run on local machine
- Use for personal resume management
- No external dependencies

### **Cloud Deployment**
- Deploy to cloud platforms (Heroku, AWS, etc.)
- Add database for version storage
- Implement user authentication

### **Self-Hosted**
- Deploy on private server
- Full control over data and security
- Custom domain and SSL

## 🤝 Contributing Guidelines

1. **Fork Repository**: Create personal fork
2. **Feature Branch**: Create feature branch from main
3. **Development**: Implement changes with tests
4. **Pull Request**: Submit PR with detailed description
5. **Code Review**: Address feedback and suggestions

## 📄 License & Usage

- **License**: MIT License
- **Personal Use**: Free for personal resume management
- **Commercial Use**: Allowed with attribution
- **Modification**: Free to modify and distribute

## 🆘 Troubleshooting

### **Common Issues**

1. **Upload Fails**
   - Check file format (must be .docx, .doc, or .pdf)
   - Verify file is not corrupted
   - Check file size limits

2. **Parsing Errors**
   - Ensure file is not password protected
   - Try converting to different format
   - Check file encoding

3. **Export Issues**
   - Verify company name is entered
   - Check browser download settings
   - Ensure sufficient disk space

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 📞 Support & Contact

- **Documentation**: Check README.md for detailed instructions
- **Issues**: Use GitHub issues for bug reports
- **Features**: Submit feature requests via GitHub
- **Community**: Join discussions in project repository

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Active Development
