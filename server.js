const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Resume parsing functions
async function parseWordDocument(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return {
      text: result.value,
      messages: result.messages
    };
  } catch (error) {
    throw new Error(`Error parsing Word document: ${error.message}`);
  }
}

async function parsePDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return {
      text: data.text,
      pages: data.numpages
    };
  } catch (error) {
    throw new Error(`Error parsing PDF: ${error.message}`);
  }
}

// Section detection function
function detectSections(text) {
  const sections = {
    personalSummary: '',
    workExperience: [],
    projects: []
  };

  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentSection = '';
  let currentExperience = null;
  let currentProject = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Detect Personal Summary/Objective
    if (lowerLine.includes('summary') || lowerLine.includes('objective') || 
        lowerLine.includes('profile') || lowerLine.includes('about')) {
      currentSection = 'personalSummary';
      continue;
    }

    // Detect Work Experience
    if (lowerLine.includes('experience') || lowerLine.includes('employment') || 
        lowerLine.includes('work history')) {
      currentSection = 'workExperience';
      continue;
    }

    // Detect Projects
    if (lowerLine.includes('projects') || lowerLine.includes('portfolio')) {
      currentSection = 'projects';
      continue;
    }

    // Process content based on current section
    if (currentSection === 'personalSummary') {
      sections.personalSummary += line + '\n';
    } else if (currentSection === 'workExperience') {
      // Detect job titles (usually in caps or title case)
      if (line.match(/^[A-Z][a-zA-Z\s&]+$/) && !line.includes('•') && !line.includes('-')) {
        if (currentExperience) {
          sections.workExperience.push(currentExperience);
        }
        currentExperience = {
          title: line,
          company: '',
          duration: '',
          bullets: []
        };
      } else if (currentExperience && (line.includes('•') || line.includes('-'))) {
        currentExperience.bullets.push(line.replace(/^[•\-]\s*/, ''));
      } else if (currentExperience && line.includes('Company') || line.includes('Duration')) {
        // Handle company and duration info
        if (line.includes('Company')) {
          currentExperience.company = line.replace('Company:', '').trim();
        } else if (line.includes('Duration')) {
          currentExperience.duration = line.replace('Duration:', '').trim();
        }
      }
    } else if (currentSection === 'projects') {
      // Similar logic for projects
      if (line.match(/^[A-Z][a-zA-Z\s&]+$/) && !line.includes('•') && !line.includes('-')) {
        if (currentProject) {
          sections.projects.push(currentProject);
        }
        currentProject = {
          name: line,
          description: '',
          bullets: []
        };
      } else if (currentProject && (line.includes('•') || line.includes('-'))) {
        currentProject.bullets.push(line.replace(/^[•\-]\s*/, ''));
      } else if (currentProject) {
        currentProject.description += line + '\n';
      }
    }
  }

  // Add the last experience/project
  if (currentExperience) {
    sections.workExperience.push(currentExperience);
  }
  if (currentProject) {
    sections.projects.push(currentProject);
  }

  return sections;
}

// API Routes

// Upload and parse resume
app.post('/api/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    let parsedData;
    if (fileExtension === '.docx' || fileExtension === '.doc') {
      parsedData = await parseWordDocument(filePath);
    } else if (fileExtension === '.pdf') {
      parsedData = await parsePDF(filePath);
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    const sections = detectSections(parsedData.text);
    
    // Clean up uploaded file
    await fs.remove(filePath);

    res.json({
      success: true,
      sections,
      originalText: parsedData.text
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save resume version
app.post('/api/save-version', async (req, res) => {
  try {
    const { companyName, sections } = req.body;
    
    if (!companyName || !sections) {
      return res.status(400).json({ error: 'Company name and sections are required' });
    }

    const versionId = uuidv4();
    const versionData = {
      id: versionId,
      companyName,
      sections,
      createdAt: new Date().toISOString()
    };

    // Save to file system
    const versionsDir = path.join(__dirname, 'versions');
    await fs.ensureDir(versionsDir);
    
    const versionPath = path.join(versionsDir, `${companyName.replace(/\s+/g, '_')}_${versionId}.json`);
    await fs.writeJson(versionPath, versionData);

    res.json({
      success: true,
      versionId,
      message: 'Version saved successfully'
    });

  } catch (error) {
    console.error('Save version error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get saved versions
app.get('/api/versions', async (req, res) => {
  try {
    const versionsDir = path.join(__dirname, 'versions');
    await fs.ensureDir(versionsDir);
    
    const files = await fs.readdir(versionsDir);
    const versions = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const versionPath = path.join(versionsDir, file);
        const versionData = await fs.readJson(versionPath);
        versions.push(versionData);
      }
    }

    res.json({ versions });

  } catch (error) {
    console.error('Get versions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export resume as Word document
app.post('/api/export/word', async (req, res) => {
  try {
    const { sections, companyName } = req.body;
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Personal Summary
          new Paragraph({
            children: [
              new TextRun({
                text: "PERSONAL SUMMARY",
                bold: true,
                size: 24
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: sections.personalSummary || '',
                size: 20
              })
            ]
          }),
          
          // Work Experience
          new Paragraph({
            children: [
              new TextRun({
                text: "WORK EXPERIENCE",
                bold: true,
                size: 24
              })
            ]
          }),
          
          // Add work experience sections
          ...sections.workExperience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.title,
                  bold: true,
                  size: 20
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.company,
                  size: 18
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.duration,
                  size: 18
                })
              ]
            }),
            ...exp.bullets.map(bullet => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${bullet}`,
                    size: 18
                  })
                ]
              })
            )
          ]),
          
          // Projects
          new Paragraph({
            children: [
              new TextRun({
                text: "PROJECTS",
                bold: true,
                size: 24
              })
            ]
          }),
          
          // Add project sections
          ...sections.projects.flatMap(project => [
            new Paragraph({
              children: [
                new TextRun({
                  text: project.name,
                  bold: true,
                  size: 20
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: project.description,
                  size: 18
                })
              ]
            }),
            ...project.bullets.map(bullet => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${bullet}`,
                    size: 18
                  })
                ]
              })
            )
          ])
        ]
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    const fileName = `Resume_${companyName.replace(/\s+/g, '_')}_${Date.now()}.docx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Export Word error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export resume as PDF
app.post('/api/export/pdf', async (req, res) => {
  try {
    const { sections, companyName } = req.body;
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
          h2 { color: #666; margin-top: 30px; }
          h3 { color: #888; margin-top: 20px; }
          ul { margin: 10px 0; }
          li { margin: 5px 0; }
        </style>
      </head>
      <body>
        <h1>PERSONAL SUMMARY</h1>
        <p>${sections.personalSummary || ''}</p>
        
        <h1>WORK EXPERIENCE</h1>
        ${sections.workExperience.map(exp => `
          <h2>${exp.title}</h2>
          <h3>${exp.company}</h3>
          <p><strong>Duration:</strong> ${exp.duration}</p>
          <ul>
            ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
          </ul>
        `).join('')}
        
        <h1>PROJECTS</h1>
        ${sections.projects.map(project => `
          <h2>${project.name}</h2>
          <p>${project.description}</p>
          <ul>
            ${project.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
          </ul>
        `).join('')}
      </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1in',
        right: '1in',
        bottom: '1in',
        left: '1in'
      }
    });
    
    await browser.close();
    
    const fileName = `Resume_${companyName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pdf);

  } catch (error) {
    console.error('Export PDF error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
