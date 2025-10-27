import React, { useState } from 'react';

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 
          className="text-xl font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {(type === 'experience' || type === 'projects') && !isBulkEditing && (
            <button 
              onClick={handleBulkEdit} 
              className="px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30 rounded-md transition-colors"
              type="button"
            >
              📝 Bulk Edit
            </button>
          )}
          <button
            className={`p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          {isBulkEditing ? (
            <div className="space-y-4">
              <textarea
                value={bulkEditContent}
                onChange={(e) => setBulkEditContent(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400 resize-none"
                placeholder={type === 'experience' 
                  ? "[Company Name] Job Title (Duration)\nFirst achievement or responsibility\nSecond achievement or responsibility\n\n[Another Company] Another Job Title (Duration)\nAnother achievement\nAnother responsibility"
                  : "[Project Name] Brief description\nFirst accomplishment\nSecond accomplishment\n\n[Another Project] Another description\nAnother accomplishment"
                }
                rows={15}
              />
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">📝 Simple Format:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li><strong>[Company/Project]</strong> Title/Description (Duration)</li>
                  <li>Bullet point 1</li>
                  <li>Bullet point 2</li>
                  <li><em>Empty line to separate entries</em></li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleBulkSave} 
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  💾 Save
                </button>
                <button 
                  onClick={handleBulkCancel} 
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400 resize-none"
                  placeholder="Enter your personal summary..."
                  rows={4}
                />
              )}

              {type === 'experience' && (
                <div className="space-y-6">
                  {content.map((exp: any, expIndex: number) => (
                    <div key={expIndex} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => handleExperienceUpdate(expIndex, 'title', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                          placeholder="Job Title"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleExperienceUpdate(expIndex, 'company', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                          placeholder="Company Name"
                        />
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => handleExperienceUpdate(expIndex, 'duration', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                          placeholder="Duration (e.g., Jan 2020 - Present)"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bullet Points:</h4>
                        {exp.bullets.map((bullet: string, bulletIndex: number) => (
                          <div key={bulletIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => handleExperienceBulletUpdate(expIndex, bulletIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                              placeholder="Enter bullet point..."
                            />
                            <button
                              onClick={() => removeExperienceBullet(expIndex, bulletIndex)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-md transition-colors"
                              type="button"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addExperienceBullet(expIndex)}
                          className="px-4 py-2 text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30 rounded-md transition-colors text-sm font-medium"
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
                <div className="space-y-6">
                  {content.map((project: any, projectIndex: number) => (
                    <div key={projectIndex} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="mb-4">
                        <input
                          type="text"
                          value={project.name}
                          onChange={(e) => handleProjectUpdate(projectIndex, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400 text-lg font-semibold"
                          placeholder="Project Name"
                        />
                      </div>
                      
                      <textarea
                        value={project.description}
                        onChange={(e) => handleProjectUpdate(projectIndex, 'description', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400 resize-none mb-4"
                        placeholder="Project description..."
                        rows={2}
                      />
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Key Achievements:</h4>
                        {project.bullets.map((bullet: string, bulletIndex: number) => (
                          <div key={bulletIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => handleProjectBulletUpdate(projectIndex, bulletIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                              placeholder="Enter achievement..."
                            />
                            <button
                              onClick={() => removeProjectBullet(projectIndex, bulletIndex)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-md transition-colors"
                              type="button"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addProjectBullet(projectIndex)}
                          className="px-4 py-2 text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30 rounded-md transition-colors text-sm font-medium"
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
