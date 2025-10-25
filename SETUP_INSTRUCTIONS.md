# ResumeBuilder - Setup Instructions 🚀

## 📋 Prerequisites

Before setting up ResumeBuilder, ensure you have the following installed:

### **Required Software**
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for version control) - [Download here](https://git-scm.com/)

### **System Requirements**
- **Operating System**: Windows, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 1GB free disk space
- **Internet**: Required for downloading dependencies

## 🚀 Quick Setup (5 Minutes)

### **Step 1: Clone Repository**
```bash
# Clone the repository
git clone <your-repository-url>
cd ResumeBuilder

# Verify you're in the correct directory
ls -la
# You should see: server.js, package.json, client/, etc.
```

### **Step 2: Install Dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..

# Verify installation
npm list --depth=0
```

### **Step 3: Start Development Server**
```bash
# Start both backend and frontend
npm run dev

# This will start:
# - Backend server on http://localhost:5000
# - Frontend React app on http://localhost:3000
```

### **Step 4: Access Application**
1. Open your browser
2. Navigate to `http://localhost:3000`
3. You should see the ResumeBuilder homepage

## 🔧 Detailed Setup Instructions

### **Backend Setup**

#### **1. Install Backend Dependencies**
```bash
# Navigate to project root
cd ResumeBuilder

# Install all backend dependencies
npm install express cors multer mammoth pdf-parse docx puppeteer fs-extra uuid

# Install development dependencies
npm install --save-dev nodemon concurrently
```

#### **2. Create Required Directories**
```bash
# Create uploads directory for temporary files
mkdir uploads

# Create versions directory for saved resumes
mkdir versions

# Set proper permissions
chmod 755 uploads versions
```

#### **3. Start Backend Server**
```bash
# Start backend server only
npm run server

# Backend will run on http://localhost:5000
# API endpoints available at /api/*
```

### **Frontend Setup**

#### **1. Install Frontend Dependencies**
```bash
# Navigate to client directory
cd client

# Install React dependencies
npm install react react-dom react-router-dom axios

# Install TypeScript dependencies
npm install --save-dev @types/react @types/react-dom @types/node

# Install development dependencies
npm install --save-dev typescript @types/react-router-dom
```

#### **2. Start Frontend Development Server**
```bash
# Start React development server
npm start

# Frontend will run on http://localhost:3000
# Hot reload enabled for development
```

## 🐛 Troubleshooting Setup Issues

### **Common Issues & Solutions**

#### **Issue 1: Node.js Version**
```bash
# Check Node.js version
node --version

# If version is too old, update Node.js
# Download from https://nodejs.org/
```

#### **Issue 2: Permission Errors**
```bash
# Fix npm permissions (Linux/macOS)
sudo chown -R $(whoami) ~/.npm

# Or use nvm to manage Node.js versions
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

#### **Issue 3: Port Already in Use**
```bash
# Check what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=5001 npm run server
```

#### **Issue 4: Dependencies Installation Fails**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Issue 5: Puppeteer Installation Issues**
```bash
# Install puppeteer dependencies
npx puppeteer install

# Or install system dependencies
# Ubuntu/Debian:
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-x6 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# macOS:
brew install --cask google-chrome
```

## 🧪 Testing Your Setup

### **Test 1: Backend API**
```bash
# Test if backend is running
curl http://localhost:5000/api/versions

# Should return: {"versions":[]}
```

### **Test 2: Frontend Connection**
```bash
# Open browser and go to http://localhost:3000
# You should see the ResumeBuilder homepage
```

### **Test 3: File Upload**
1. Go to http://localhost:3000
2. Try uploading a sample Word document
3. Check if it parses correctly
4. Verify sections are detected

### **Test 4: Export Functionality**
1. Edit some content in the editor
2. Enter a company name
3. Try exporting as Word and PDF
4. Verify files are generated correctly

## 📁 Project Structure Verification

After setup, your project should look like this:

```
ResumeBuilder/
├── 📁 server.js              # Backend server
├── 📁 package.json           # Backend dependencies
├── 📁 uploads/              # Temporary file storage
├── 📁 versions/             # Saved resume versions
├── 📁 client/               # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/   # UI components
│   │   ├── 📁 pages/        # Main pages
│   │   └── 📁 App.tsx       # Main app
│   ├── 📁 public/
│   └── 📁 package.json      # Frontend dependencies
├── 📁 README.md             # User documentation
├── 📁 MASTER_PLAN.md        # Project overview
├── 📁 DEVELOPMENT_GUIDE.md  # Development guide
├── 📁 REQUIREMENTS.md      # Requirements specification
└── 📁 SETUP_INSTRUCTIONS.md # This file
```

## 🔧 Development Commands

### **Backend Commands**
```bash
# Start backend server
npm run server

# Start with debug logging
DEBUG=* npm run server

# Install new dependency
npm install <package-name>
```

### **Frontend Commands**
```bash
# Start frontend development server
cd client && npm start

# Build for production
cd client && npm run build

# Run tests
cd client && npm test
```

### **Full Stack Commands**
```bash
# Start both backend and frontend
npm run dev

# Build everything
npm run build

# Start production server
npm start
```

## 🌐 Environment Configuration

### **Development Environment**
```bash
# Create .env file for environment variables
echo "NODE_ENV=development" > .env
echo "PORT=5000" >> .env
echo "CLIENT_URL=http://localhost:3000" >> .env
```

### **Production Environment**
```bash
# Create production .env file
echo "NODE_ENV=production" > .env
echo "PORT=5000" >> .env
echo "CLIENT_URL=http://your-domain.com" >> .env
```

## 📊 Performance Optimization

### **Backend Optimization**
```bash
# Install performance monitoring
npm install --save-dev clinic

# Run performance analysis
npx clinic doctor -- node server.js
```

### **Frontend Optimization**
```bash
# Analyze bundle size
cd client && npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

## 🔒 Security Considerations

### **File Upload Security**
```bash
# Set up file type validation
# Add to server.js:
const allowedTypes = ['.docx', '.doc', '.pdf'];
const fileExtension = path.extname(file.originalname).toLowerCase();

if (!allowedTypes.includes(fileExtension)) {
  return res.status(400).json({ error: 'Invalid file type' });
}
```

### **Input Validation**
```bash
# Install validation library
npm install joi

# Add input validation for API endpoints
```

## 📚 Additional Resources

### **Documentation**
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://reactjs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **Useful Tools**
- **Postman**: API testing
- **VS Code**: Recommended IDE
- **Git**: Version control
- **Chrome DevTools**: Frontend debugging

### **Learning Resources**
- [JavaScript ES6+ Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Setup Complete! 🎉**

Your ResumeBuilder is now ready for development. You can start building features, fixing bugs, or adding new functionality.

**Next Steps:**
1. Read the [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
2. Check the [REQUIREMENTS.md](REQUIREMENTS.md)
3. Start developing new features!

**Need Help?**
- Check the troubleshooting section above
- Review the development guide
- Create an issue in the repository
