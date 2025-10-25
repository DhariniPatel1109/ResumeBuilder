# ResumeBuilder - Development Guide 🛠️

## 🚀 Quick Start for New Machine

### **1. Environment Setup**
```bash
# Check Node.js version (requires v14+)
node --version

# Install dependencies
npm install
cd client && npm install && cd ..

# Start development server
npm run dev
```

### **2. Project Structure Overview**
```
ResumeBuilder/
├── 📁 server.js              # Backend API server
├── 📁 package.json           # Backend dependencies
├── 📁 uploads/              # Temporary file storage
├── 📁 versions/             # Saved resume versions
├── 📁 client/               # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/   # Reusable UI components
│   │   ├── 📁 pages/        # Main application pages
│   │   └── 📁 App.tsx       # Main app component
│   └── 📁 public/
├── 📁 README.md             # User documentation
├── 📁 MASTER_PLAN.md        # Project overview
└── 📁 DEVELOPMENT_GUIDE.md  # This file
```

## 🔧 Development Workflow

### **Backend Development**
```bash
# Start backend server only
npm run server

# Backend runs on http://localhost:5000
# API endpoints available at /api/*
```

### **Frontend Development**
```bash
# Start frontend only
cd client
npm start

# Frontend runs on http://localhost:3000
# Hot reload enabled for development
```

### **Full Stack Development**
```bash
# Start both backend and frontend
npm run dev

# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

## 📋 Key Components Explained

### **Backend Components**

#### **server.js** - Main Server File
- Express server setup
- File upload handling (multer)
- Document parsing (mammoth.js, pdf-parse)
- Export generation (docx, puppeteer)
- API route definitions

#### **Document Parsing Logic**
```javascript
// Word document parsing
const result = await mammoth.extractRawText({ path: filePath });

// PDF document parsing
const data = await pdfParse(dataBuffer);

// Section detection algorithm
function detectSections(text) {
  // Identifies Personal Summary, Work Experience, Projects
}
```

#### **Export Generation**
```javascript
// Word export
const doc = new Document({ sections: [...] });
const buffer = await Packer.toBuffer(doc);

// PDF export
const browser = await puppeteer.launch();
const pdf = await page.pdf({ format: 'A4' });
```

### **Frontend Components**

#### **App.tsx** - Main Application
- React Router setup
- Navigation between pages
- Main app structure

#### **Home.tsx** - Landing Page
- File upload interface
- Feature showcase
- Getting started guide

#### **ResumeEditor.tsx** - Main Editor
- Section editing interface
- Real-time content updates
- Export functionality

#### **SectionEditor.tsx** - Content Editor
- Editable text boxes
- Bullet point management
- Dynamic content updates

#### **Versions.tsx** - Version Management
- Saved versions display
- Version loading
- Version history

## 🎯 Development Tasks

### **Immediate Tasks**
1. **Test Resume Parsing**
   - Upload sample Word/PDF files
   - Verify section detection accuracy
   - Test with different resume formats

2. **UI/UX Improvements**
   - Test responsive design on mobile
   - Improve loading states
   - Add error handling

3. **Export Testing**
   - Test Word export functionality
   - Test PDF export functionality
   - Verify file naming conventions

### **Future Enhancements**
1. **AI Integration**
   - Add OpenAI API integration
   - Implement content suggestions
   - Job description analysis

2. **Advanced Features**
   - Template library
   - Batch processing
   - Cloud storage integration

## 🐛 Common Issues & Solutions

### **Backend Issues**

#### **File Upload Problems**
```bash
# Check uploads directory permissions
ls -la uploads/
chmod 755 uploads/

# Verify multer configuration
# Check file size limits in server.js
```

#### **Document Parsing Errors**
```bash
# Install additional dependencies if needed
npm install mammoth pdf-parse

# Check file format compatibility
# Ensure files are not password protected
```

#### **Export Generation Issues**
```bash
# Install puppeteer dependencies
npx puppeteer install

# Check system dependencies for PDF generation
# Verify docx library installation
```

### **Frontend Issues**

#### **React Development Server**
```bash
# Clear cache and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
npm start
```

#### **API Connection Issues**
```bash
# Check backend server is running
curl http://localhost:5000/api/versions

# Verify CORS configuration
# Check API endpoint URLs in frontend
```

#### **Build Issues**
```bash
# Build frontend for production
cd client
npm run build

# Check for TypeScript errors
npm run type-check
```

## 🔍 Debugging Guide

### **Backend Debugging**
```javascript
// Add debug logging
console.log('Upload received:', req.file);
console.log('Parsed data:', parsedData);

// Check file processing
fs.readFile(filePath, (err, data) => {
  if (err) console.error('File read error:', err);
  console.log('File size:', data.length);
});
```

### **Frontend Debugging**
```javascript
// Add console logging
console.log('Resume data:', resumeData);
console.log('Section update:', newContent);

// Check API responses
axios.post('/api/upload', formData)
  .then(response => console.log('Upload response:', response))
  .catch(error => console.error('Upload error:', error));
```

### **Network Debugging**
```bash
# Check API endpoints
curl -X POST http://localhost:5000/api/upload \
  -F "resume=@sample.docx"

# Test export endpoints
curl -X POST http://localhost:5000/api/export/word \
  -H "Content-Type: application/json" \
  -d '{"sections": {...}, "companyName": "Test"}'
```

## 📊 Performance Monitoring

### **Backend Performance**
- Monitor file processing time
- Check memory usage during PDF generation
- Track API response times

### **Frontend Performance**
- Monitor bundle size
- Check loading times
- Optimize re-renders

### **File Processing**
- Monitor upload speeds
- Check parsing accuracy
- Verify export quality

## 🧪 Testing Strategy

### **Manual Testing Checklist**
- [ ] Upload Word document (.docx)
- [ ] Upload PDF document
- [ ] Test section detection
- [ ] Edit content in all sections
- [ ] Save version with company name
- [ ] Export as Word document
- [ ] Export as PDF
- [ ] Load saved version
- [ ] Test responsive design

### **Automated Testing Setup**
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

## 🚀 Deployment Preparation

### **Production Build**
```bash
# Build frontend
cd client
npm run build

# Start production server
npm start
```

### **Environment Variables**
```bash
# Create .env file
PORT=5000
NODE_ENV=production
```

### **Docker Setup** (Optional)
```dockerfile
# Dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📚 Learning Resources

### **Technologies Used**
- **Node.js**: Server-side JavaScript
- **Express**: Web framework
- **React**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **Mammoth.js**: Word document parsing
- **Puppeteer**: PDF generation
- **Multer**: File upload handling

### **Useful Documentation**
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://reactjs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Mammoth.js API](https://github.com/mwilliamson/mammoth.js)

## 🤝 Contributing

### **Code Style**
- Use consistent indentation (2 spaces)
- Follow TypeScript best practices
- Add comments for complex logic
- Use meaningful variable names

### **Git Workflow**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push and create PR
git push origin feature/new-feature
```

### **Pull Request Guidelines**
- Clear description of changes
- Test the changes thoroughly
- Update documentation if needed
- Follow existing code style

---

**Happy Coding! 🚀**
