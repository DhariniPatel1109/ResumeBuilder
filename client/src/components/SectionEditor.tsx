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

  return (
    <div className="section-editor">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h2>{title}</h2>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>

      {isExpanded && (
        <div className="section-content">
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
        </div>
      )}
    </div>
  );
};

export default SectionEditor;
