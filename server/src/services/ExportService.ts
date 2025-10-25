import { Document, Packer, Paragraph, TextRun } from 'docx';
import puppeteer from 'puppeteer';
import { ResumeSection } from '../types';

export class ExportService {
  /**
   * Export resume as Word document
   */
  static async exportToWord(sections: ResumeSection, companyName: string): Promise<Buffer> {
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

    return await Packer.toBuffer(doc);
  }

  /**
   * Export resume as PDF
   */
  static async exportToPDF(sections: ResumeSection, companyName: string): Promise<Buffer> {
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
    
    return pdf;
  }
}
