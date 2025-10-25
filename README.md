# ResumeBuilder 🚀

A powerful tool to customize your resume for different job applications while preserving your original formatting.

## ✨ Features

- **📄 Resume Parsing**: Upload Word (.docx) or PDF files and automatically parse sections
- **🎯 Targeted Editing**: Edit specific bullet points without changing your resume structure
- **💾 Version Management**: Save multiple versions for different companies
- **📤 Export Options**: Generate Word and PDF files with company-specific naming
- **🔄 Format Preservation**: Maintain your original resume styling and layout

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
cd ResumeBuilder
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend React app (port 3000).

3. **Open your browser:**
Navigate to `http://localhost:3000`

## 📖 How to Use

### 1. Upload Your Resume
- Go to the home page
- Drag and drop your resume file or click to browse
- Supported formats: `.docx`, `.doc`, `.pdf`

### 2. Edit Content
- The tool automatically detects sections (Personal Summary, Work Experience, Projects)
- Edit specific bullet points in the text boxes
- Modify job titles, company names, and descriptions as needed

### 3. Save & Export
- Enter a company name for your customized version
- Save the version for future reference
- Export as Word (.docx) or PDF format
- Files are automatically named with company prefix

### 4. Manage Versions
- View all saved versions in the "Versions" page
- Load any saved version to continue editing
- Each version is timestamped and organized by company

## 🛠️ Technical Stack

**Backend:**
- Node.js + Express
- Document parsing: mammoth.js (Word), pdf-parse (PDF)
- File generation: docx, puppeteer (PDF)
- File management: fs-extra, multer

**Frontend:**
- React + TypeScript
- React Router for navigation
- Axios for API calls
- Responsive CSS design

## 📁 Project Structure

```
ResumeBuilder/
├── server.js              # Backend server
├── package.json           # Dependencies
├── uploads/              # Temporary file storage
├── versions/             # Saved resume versions
└── client/               # React frontend
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Main pages
    │   └── App.tsx       # Main app component
    └── public/
```

## 🔧 API Endpoints

- `POST /api/upload` - Upload and parse resume
- `POST /api/save-version` - Save customized version
- `GET /api/versions` - Get all saved versions
- `POST /api/export/word` - Export as Word document
- `POST /api/export/pdf` - Export as PDF

## 🎯 Use Cases

- **Job Applications**: Customize resume for each company
- **Career Changes**: Adapt experience for different industries
- **A/B Testing**: Try different versions for the same role
- **Portfolio Management**: Maintain multiple professional profiles

## 🚧 Future Enhancements

- [ ] AI-powered content suggestions based on job descriptions
- [ ] Template library for different industries
- [ ] Integration with job boards
- [ ] Resume analytics and optimization tips
- [ ] Cloud storage integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Happy job hunting! 🎯**
