import React, { useState } from 'react';
import './SectionEditor.css';

interface SectionEditorProps {
  title: string;
  content: any;
  onUpdate: (content: any) => void;
  type: 'text' | 'experience' | 'projects';
}

const SectionEditor: React.FC<SectionEditorProps> = ({ title, content, onUpdate, type }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkEditContent, setBulkEditContent] = useState('');

  const handleTextChange = (newText: string) => {
    onUpdate(newText);
  };

  const handleExperienceUpdate = (index: number, field: string, value: string) => {
    const updatedContent = [...content];
    updatedContent[index] = {
      ...updatedContent[index],
      [field]: value
    };
    onUpdate(updatedContent);
  };

  const handleExperienceBulletUpdate = (expIndex: number, bulletIndex: number, newBullet: string) => {
    const updatedContent = [...content];
    updatedContent[expIndex].bullets[bulletIndex] = newBullet;
    onUpdate(updatedContent);
  };

  const addExperienceBullet = (expIndex: number) => {
    const updatedContent = [...content];
    updatedContent[expIndex].bullets.push('');
    onUpdate(updatedContent);
  };

  const removeExperienceBullet = (expIndex: number, bulletIndex: number) => {
    const updatedContent = [...content];
    updatedContent[expIndex].bullets.splice(bulletIndex, 1);
    onUpdate(updatedContent);
  };

  const handleProjectUpdate = (index: number, field: string, value: string) => {
    const updatedContent = [...content];
    updatedContent[index] = {
      ...updatedContent[index],
      [field]: value
    };
    onUpdate(updatedContent);
  };

  const handleProjectBulletUpdate = (projectIndex: number, bulletIndex: number, newBullet: string) => {
    const updatedContent = [...content];
    updatedContent[projectIndex].bullets[bulletIndex] = newBullet;
    onUpdate(updatedContent);
  };

  const addProjectBullet = (projectIndex: number) => {
    const updatedContent = [...content];
    updatedContent[projectIndex].bullets.push('');
    onUpdate(updatedContent);
  };

  const removeProjectBullet = (projectIndex: number, bulletIndex: number) => {
    const updatedContent = [...content];
    updatedContent[projectIndex].bullets.splice(bulletIndex, 1);
    onUpdate(updatedContent);
  };

  const handleBulkEdit = () => {
    if (type === 'experience') {
      // Format experience entries for easy editing
      const formattedContent = Array.isArray(content) 
        ? content.map((exp: any) => {
            const bullets = exp.bullets ? exp.bullets.join('\n') : '';
            return `[${exp.company || 'Company'}] ${exp.title || 'Title'} (${exp.duration || 'Duration'})\n${bullets}`;
          }).join('\n\n')
        : '';
      setBulkEditContent(formattedContent);
    } else if (type === 'projects') {
      // Format project entries for easy editing
      const formattedContent = Array.isArray(content) 
        ? content.map((project: any) => {
            const bullets = project.bullets ? project.bullets.join('\n') : '';
            return `[${project.name || 'Project Name'}] ${project.description || 'Description'}\n${bullets}`;
          }).join('\n\n')
        : '';
      setBulkEditContent(formattedContent);
    }
    setIsBulkEditing(true);
  };

  const handleBulkSave = () => {
    if (type === 'experience') {
      // Parse simple format: [Company] Title (Duration) followed by bullets
      try {
        const entries = bulkEditContent.split('\n\n').filter(entry => entry.trim());
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
    } else if (type === 'projects') {
      // Parse simple format: [Project Name] Description followed by bullets
      try {
        const entries = bulkEditContent.split('\n\n').filter(entry => entry.trim());
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
    }
    setIsBulkEditing(false);
  };

  const handleBulkCancel = () => {
    setIsBulkEditing(false);
    setBulkEditContent('');
  };

  return (
    <div className="section-editor">
      <div className="section-header">
        <h2 onClick={() => setIsExpanded(!isExpanded)}>{title}</h2>
        <div className="section-actions">
          {(type === 'experience' || type === 'projects') && !isBulkEditing && (
            <button 
              onClick={handleBulkEdit} 
              className="bulk-edit-button"
              type="button"
            >
              📝 Bulk Edit
            </button>
          )}
          <span 
            className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            ▼
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="section-content">
          {isBulkEditing ? (
            <div className="bulk-edit-mode">
              <textarea
                value={bulkEditContent}
                onChange={(e) => setBulkEditContent(e.target.value)}
                className="bulk-edit-textarea"
                placeholder={type === 'experience' 
                  ? "[Company Name] Job Title (Duration)\nFirst achievement or responsibility\nSecond achievement or responsibility\n\n[Another Company] Another Job Title (Duration)\nAnother achievement\nAnother responsibility"
                  : "[Project Name] Brief description\nFirst accomplishment\nSecond accomplishment\n\n[Another Project] Another description\nAnother accomplishment"
                }
                rows={15}
              />
              <div className="format-help">
                <h4>📝 Simple Format:</h4>
                <ul>
                  <li><strong>[Company/Project]</strong> Title/Description (Duration)</li>
                  <li>Bullet point 1</li>
                  <li>Bullet point 2</li>
                  <li><em>Empty line to separate entries</em></li>
                </ul>
              </div>
              <div className="bulk-edit-actions">
                <button onClick={handleBulkSave} className="save-button">
                  💾 Save
                </button>
                <button onClick={handleBulkCancel} className="cancel-button">
                  ❌ Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {type === 'text' && (
                <textarea
                  value={content}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="text-editor"
                  placeholder="Enter your personal summary..."
                  rows={4}
                />
              )}

              {type === 'experience' && (
                <div className="experience-list">
              {content.map((exp: any, expIndex: number) => (
                <div key={expIndex} className="experience-item">
                  <div className="experience-header">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => handleExperienceUpdate(expIndex, 'title', e.target.value)}
                      className="experience-title"
                      placeholder="Job Title"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleExperienceUpdate(expIndex, 'company', e.target.value)}
                      className="experience-company"
                      placeholder="Company Name"
                    />
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => handleExperienceUpdate(expIndex, 'duration', e.target.value)}
                      className="experience-duration"
                      placeholder="Duration (e.g., Jan 2020 - Present)"
                    />
                  </div>
                  
                  <div className="bullets-section">
                    <h4>Bullet Points:</h4>
                    {exp.bullets.map((bullet: string, bulletIndex: number) => (
                      <div key={bulletIndex} className="bullet-item">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleExperienceBulletUpdate(expIndex, bulletIndex, e.target.value)}
                          className="bullet-input"
                          placeholder="Enter bullet point..."
                        />
                        <button
                          onClick={() => removeExperienceBullet(expIndex, bulletIndex)}
                          className="remove-bullet"
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addExperienceBullet(expIndex)}
                      className="add-bullet"
                      type="button"
                    >
                      + Add Bullet Point
                    </button>
                  </div>
                </div>
              ))}
                </div>
              )}

              {type === 'projects' && (
                <div className="projects-list">
              {content.map((project: any, projectIndex: number) => (
                <div key={projectIndex} className="project-item">
                  <div className="project-header">
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => handleProjectUpdate(projectIndex, 'name', e.target.value)}
                      className="project-name"
                      placeholder="Project Name"
                    />
                  </div>
                  
                  <textarea
                    value={project.description}
                    onChange={(e) => handleProjectUpdate(projectIndex, 'description', e.target.value)}
                    className="project-description"
                    placeholder="Project description..."
                    rows={2}
                  />
                  
                  <div className="bullets-section">
                    <h4>Key Achievements:</h4>
                    {project.bullets.map((bullet: string, bulletIndex: number) => (
                      <div key={bulletIndex} className="bullet-item">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleProjectBulletUpdate(projectIndex, bulletIndex, e.target.value)}
                          className="bullet-input"
                          placeholder="Enter achievement..."
                        />
                        <button
                          onClick={() => removeProjectBullet(projectIndex, bulletIndex)}
                          className="remove-bullet"
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addProjectBullet(projectIndex)}
                      className="add-bullet"
                      type="button"
                    >
                      + Add Achievement
                    </button>
                  </div>
                </div>
              ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionEditor;
