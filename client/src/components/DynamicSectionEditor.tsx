import React, { useState } from 'react';
import { DynamicSection } from '../types';
import './DynamicSectionEditor.css';

interface DynamicSectionEditorProps {
  sectionName: string;
  section: DynamicSection;
  onUpdate: (content: any) => void;
}

const DynamicSectionEditor: React.FC<DynamicSectionEditorProps> = ({
  sectionName,
  section,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const handleEdit = () => {
    if (section.type === 'text') {
      setEditContent(section.content);
    } else if (section.type === 'list') {
      setEditContent(Array.isArray(section.content) ? section.content.join('\n') : '');
    } else if (section.type === 'experience') {
      // Simple format: One experience per line with bullets
      const formattedContent = Array.isArray(section.content) 
        ? section.content.map((exp: any) => {
            const bullets = exp.bullets ? exp.bullets.join('\n') : '';
            return `[${exp.company || 'Company'}] ${exp.title || 'Title'} (${exp.duration || 'Duration'})\n${bullets}`;
          }).join('\n\n')
        : '';
      setEditContent(formattedContent);
    } else if (section.type === 'projects') {
      // Simple format: One project per line with bullets
      const formattedContent = Array.isArray(section.content) 
        ? section.content.map((project: any) => {
            const bullets = project.bullets ? project.bullets.join('\n') : '';
            return `[${project.name || 'Project Name'}] ${project.description || 'Description'}\n${bullets}`;
          }).join('\n\n')
        : '';
      setEditContent(formattedContent);
    } else {
      setEditContent(JSON.stringify(section.content, null, 2));
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (section.type === 'text') {
      onUpdate(editContent);
    } else if (section.type === 'list') {
      const listItems = editContent.split('\n').filter(item => item.trim());
      onUpdate(listItems);
    } else if (section.type === 'experience') {
      // Parse simple format: [Company] Title (Duration) followed by bullets
      try {
        const entries = editContent.split('\n\n').filter(entry => entry.trim());
        const parsedEntries = entries.map(entry => {
          const lines = entry.split('\n');
          const headerLine = lines[0];
          const bullets = lines.slice(1).filter(line => line.trim());
          
          // Parse header: [Company] Title (Duration)
          const companyMatch = headerLine.match(/^\[([^\]]+)\]/);
          const titleMatch = headerLine.match(/\]\s*([^(]+)/);
          const durationMatch = headerLine.match(/\(([^)]+)\)/);
          
          return {
            company: companyMatch ? companyMatch[1].trim() : '',
            title: titleMatch ? titleMatch[1].trim() : '',
            duration: durationMatch ? durationMatch[1].trim() : '',
            bullets: bullets
          };
        });
        onUpdate(parsedEntries);
      } catch (error) {
        console.error('Error parsing experience content:', error);
        alert('Invalid format. Please check your input.');
        return;
      }
    } else if (section.type === 'projects') {
      // Parse simple format: [Project Name] Description followed by bullets
      try {
        const entries = editContent.split('\n\n').filter(entry => entry.trim());
        const parsedEntries = entries.map(entry => {
          const lines = entry.split('\n');
          const headerLine = lines[0];
          const bullets = lines.slice(1).filter(line => line.trim());
          
          // Parse header: [Project Name] Description
          const nameMatch = headerLine.match(/^\[([^\]]+)\]/);
          const descriptionMatch = headerLine.match(/\]\s*(.+)/);
          
          return {
            name: nameMatch ? nameMatch[1].trim() : '',
            description: descriptionMatch ? descriptionMatch[1].trim() : '',
            bullets: bullets
          };
        });
        onUpdate(parsedEntries);
      } catch (error) {
        console.error('Error parsing project content:', error);
        alert('Invalid format. Please check your input.');
        return;
      }
    } else {
      // For other complex types, use JSON
      try {
        const parsed = JSON.parse(editContent);
        onUpdate(parsed);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Invalid format. Please check your input.');
        return;
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent('');
  };

  const renderContent = () => {
    if (section.type === 'text') {
      return (
        <div className="text-content">
          {section.content ? (
            <p>{section.content}</p>
          ) : (
            <p className="empty-content">No content available</p>
          )}
        </div>
      );
    } else if (section.type === 'list') {
      return (
        <div className="list-content">
          {Array.isArray(section.content) && section.content.length > 0 ? (
            <ul>
              {section.content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-content">No items available</p>
          )}
        </div>
      );
    } else if (section.type === 'experience') {
      return (
        <div className="experience-content">
          {Array.isArray(section.content) && section.content.length > 0 ? (
            <div className="experience-list">
              {section.content.map((exp: any, index: number) => (
                <div key={index} className="experience-item">
                  <h4>{exp.title || 'Untitled Position'}</h4>
                  <p className="company">{exp.company}</p>
                  <p className="duration">{exp.duration}</p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul>
                      {exp.bullets.map((bullet: string, bulletIndex: number) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-content">No experience entries available</p>
          )}
        </div>
      );
    } else if (section.type === 'projects') {
      return (
        <div className="projects-content">
          {Array.isArray(section.content) && section.content.length > 0 ? (
            <div className="projects-list">
              {section.content.map((project: any, index: number) => (
                <div key={index} className="project-item">
                  <h4>{project.name || 'Untitled Project'}</h4>
                  {project.description && <p className="description">{project.description}</p>}
                  {project.bullets && project.bullets.length > 0 && (
                    <ul>
                      {project.bullets.map((bullet: string, bulletIndex: number) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-content">No projects available</p>
          )}
        </div>
      );
    }

    return <p className="empty-content">Unknown section type</p>;
  };

  const renderEditForm = () => {
    if (section.type === 'text') {
      return (
        <div className="edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Enter text content..."
            rows={6}
          />
        </div>
      );
    } else if (section.type === 'list') {
      return (
        <div className="edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Enter list items (one per line)..."
            rows={8}
          />
          <small>💡 Enter one item per line</small>
        </div>
      );
    } else if (section.type === 'experience') {
      return (
        <div className="edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="[Company Name] Job Title (Duration)&#10;First achievement or responsibility&#10;Second achievement or responsibility&#10;&#10;[Another Company] Another Job Title (Duration)&#10;Another achievement&#10;Another responsibility"
            rows={15}
          />
          <div className="format-help">
            <h4>📝 Simple Format:</h4>
            <ul>
              <li><strong>[Company]</strong> Job Title (Duration)</li>
              <li>Bullet point 1</li>
              <li>Bullet point 2</li>
              <li><em>Empty line to separate jobs</em></li>
            </ul>
            <p>💡 <strong>Example:</strong><br/>
            [Google] Software Engineer (2020-2023)<br/>
            Developed scalable web applications<br/>
            Led team of 5 developers<br/>
            <br/>
            [Microsoft] Intern (Summer 2019)<br/>
            Built machine learning models</p>
          </div>
        </div>
      );
    } else if (section.type === 'projects') {
      return (
        <div className="edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="[Project Name] Brief description&#10;First accomplishment&#10;Second accomplishment&#10;&#10;[Another Project] Another description&#10;Another accomplishment"
            rows={15}
          />
          <div className="format-help">
            <h4>📝 Simple Format:</h4>
            <ul>
              <li><strong>[Project Name]</strong> Brief description</li>
              <li>Accomplishment 1</li>
              <li>Accomplishment 2</li>
              <li><em>Empty line to separate projects</em></li>
            </ul>
            <p>💡 <strong>Example:</strong><br/>
            [E-commerce Platform] Full-stack web application<br/>
            Built with React and Node.js<br/>
            Handled 10,000+ daily users<br/>
            <br/>
            [Mobile App] iOS fitness tracker<br/>
            Used Swift and Core Data<br/>
            Achieved 4.8 App Store rating</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Enter JSON content..."
            rows={12}
          />
          <small>💡 Enter valid JSON format</small>
        </div>
      );
    }
  };

  return (
    <div className="dynamic-section-editor">
      <div className="section-header">
        <h3>{sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
        <span className="section-type">{section.type}</span>
        <span className="original-header">Original: "{section.originalHeader}"</span>
        {!isEditing && (
          <button onClick={handleEdit} className="edit-button">
            ✏️ Edit
          </button>
        )}
      </div>

      <div className="section-content">
        {isEditing ? (
          <div className="editing-mode">
            {renderEditForm()}
            <div className="edit-actions">
              <button onClick={handleSave} className="save-button">
                💾 Save
              </button>
              <button onClick={handleCancel} className="cancel-button">
                ❌ Cancel
              </button>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default DynamicSectionEditor;
