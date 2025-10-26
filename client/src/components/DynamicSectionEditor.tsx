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
      // Format experience entries for easy editing
      const formattedContent = Array.isArray(section.content) 
        ? section.content.map((exp: any, index: number) => {
            const bullets = exp.bullets ? exp.bullets.join('\n  • ') : '';
            return `Company: ${exp.company || ''}\nTitle: ${exp.title || ''}\nDuration: ${exp.duration || ''}\nBullets:\n  • ${bullets}`;
          }).join('\n\n---\n\n')
        : '';
      setEditContent(formattedContent);
    } else if (section.type === 'projects') {
      // Format project entries for easy editing
      const formattedContent = Array.isArray(section.content) 
        ? section.content.map((project: any, index: number) => {
            const bullets = project.bullets ? project.bullets.join('\n  • ') : '';
            return `Name: ${project.name || ''}\nDescription: ${project.description || ''}\nBullets:\n  • ${bullets}`;
          }).join('\n\n---\n\n')
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
      // Parse formatted experience content back to structured data
      try {
        const entries = editContent.split('\n\n---\n\n').filter(entry => entry.trim());
        const parsedEntries = entries.map(entry => {
          const lines = entry.split('\n');
          const exp: any = { company: '', title: '', duration: '', bullets: [] };
          
          lines.forEach(line => {
            if (line.startsWith('Company:')) {
              exp.company = line.replace('Company:', '').trim();
            } else if (line.startsWith('Title:')) {
              exp.title = line.replace('Title:', '').trim();
            } else if (line.startsWith('Duration:')) {
              exp.duration = line.replace('Duration:', '').trim();
            } else if (line.startsWith('Bullets:')) {
              // Skip the "Bullets:" line
            } else if (line.startsWith('  • ')) {
              exp.bullets.push(line.replace('  • ', '').trim());
            }
          });
          
          return exp;
        });
        onUpdate(parsedEntries);
      } catch (error) {
        console.error('Error parsing experience content:', error);
        alert('Invalid format. Please check your input.');
        return;
      }
    } else if (section.type === 'projects') {
      // Parse formatted project content back to structured data
      try {
        const entries = editContent.split('\n\n---\n\n').filter(entry => entry.trim());
        const parsedEntries = entries.map(entry => {
          const lines = entry.split('\n');
          const project: any = { name: '', description: '', bullets: [] };
          
          lines.forEach(line => {
            if (line.startsWith('Name:')) {
              project.name = line.replace('Name:', '').trim();
            } else if (line.startsWith('Description:')) {
              project.description = line.replace('Description:', '').trim();
            } else if (line.startsWith('Bullets:')) {
              // Skip the "Bullets:" line
            } else if (line.startsWith('  • ')) {
              project.bullets.push(line.replace('  • ', '').trim());
            }
          });
          
          return project;
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
            placeholder="Company: Your Company Name&#10;Title: Your Job Title&#10;Duration: Jan 2020 - Present&#10;Bullets:&#10;  • First achievement&#10;  • Second achievement&#10;&#10;---&#10;&#10;Company: Another Company&#10;Title: Another Position&#10;Duration: Jan 2018 - Dec 2019&#10;Bullets:&#10;  • Another achievement"
            rows={15}
          />
          <small>
            💡 Format: Company, Title, Duration, then Bullets (one per line with • prefix)<br/>
            💡 Separate multiple jobs with "---" on its own line
          </small>
        </div>
      );
    } else if (section.type === 'projects') {
      return (
        <div className="edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Name: Project Name&#10;Description: Brief project description&#10;Bullets:&#10;  • First accomplishment&#10;  • Second accomplishment&#10;&#10;---&#10;&#10;Name: Another Project&#10;Description: Another description&#10;Bullets:&#10;  • Another accomplishment"
            rows={15}
          />
          <small>
            💡 Format: Name, Description, then Bullets (one per line with • prefix)<br/>
            💡 Separate multiple projects with "---" on its own line
          </small>
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
