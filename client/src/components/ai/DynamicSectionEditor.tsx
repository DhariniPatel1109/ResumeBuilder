import React, { useState } from 'react';
import { DynamicSection } from '../../types';
import { Edit3, Save, X, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface DynamicSectionEditorProps {
  sectionName: string;
  section: DynamicSection;
  onUpdate: (content: any) => void;
  onDelete?: () => void;
}

const DynamicSectionEditor: React.FC<DynamicSectionEditorProps> = ({
  sectionName,
  section,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleEdit = () => {
    if (section.type === 'text') {
      setEditContent(section.content || '');
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
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{section.content}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No content available</p>
          )}
        </div>
      );
    } else if (section.type === 'list') {
      return (
        <div className="list-content">
          {Array.isArray(section.content) && section.content.length > 0 ? (
            <ul className="space-y-1">
              {section.content.map((item, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No items available</p>
          )}
        </div>
      );
    } else if (section.type === 'experience') {
      return (
        <div className="experience-content">
          {Array.isArray(section.content) && section.content.length > 0 ? (
            <div className="space-y-4">
              {section.content.map((exp: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{exp.title || 'Untitled Position'}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{exp.duration}</p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.map((bullet: string, bulletIndex: number) => (
                        <li key={bulletIndex} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No experience entries available</p>
          )}
        </div>
      );
    } else if (section.type === 'projects') {
      return (
        <div className="projects-content">
          {Array.isArray(section.content) && section.content.length > 0 ? (
            <div className="space-y-4">
              {section.content.map((project: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{project.name || 'Untitled Project'}</h4>
                  {project.description && <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>}
                  {project.bullets && project.bullets.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {project.bullets.map((bullet: string, bulletIndex: number) => (
                        <li key={bulletIndex} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No projects available</p>
          )}
        </div>
      );
    }

    return <p className="text-gray-500 dark:text-gray-400 italic">Unknown section type</p>;
  };

  const renderEditForm = () => {
    if (section.type === 'text') {
      return (
        <div className="space-y-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Enter text content..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none"
            rows={6}
          />
        </div>
      );
    } else if (section.type === 'list') {
      return (
        <div className="space-y-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Enter list items (one per line)..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none"
            rows={8}
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">💡 Enter one item per line</p>
        </div>
      );
    } else if (section.type === 'experience') {
      return (
        <div className="space-y-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="[Company Name] Job Title (Duration)&#10;First achievement or responsibility&#10;Second achievement or responsibility&#10;&#10;[Another Company] Another Job Title (Duration)&#10;Another achievement&#10;Another responsibility"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none font-mono text-sm"
            rows={15}
          />
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">📝 Simple Format:</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li><strong>[Company]</strong> Job Title (Duration)</li>
              <li>Bullet point 1</li>
              <li>Bullet point 2</li>
              <li><em>Empty line to separate jobs</em></li>
            </ul>
          </div>
        </div>
      );
    } else if (section.type === 'projects') {
      return (
        <div className="space-y-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="[Project Name] Brief description&#10;First accomplishment&#10;Second accomplishment&#10;&#10;[Another Project] Another description&#10;Another accomplishment"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none font-mono text-sm"
            rows={15}
          />
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">📝 Simple Format:</h4>
            <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
              <li><strong>[Project Name]</strong> Brief description</li>
              <li>Accomplishment 1</li>
              <li>Accomplishment 2</li>
              <li><em>Empty line to separate projects</em></li>
            </ul>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Enter JSON content..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none font-mono text-sm"
            rows={12}
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">💡 Enter valid JSON format</p>
        </div>
      );
    }
  };

  const getSectionIcon = () => {
    switch (section.type) {
      case 'text': return '📝';
      case 'list': return '📋';
      case 'experience': return '💼';
      case 'projects': return '🚀';
      default: return '📄';
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="mb-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getSectionIcon()}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                  {section.type}
                </span>
                <span>Original: "{section.originalHeader}"</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            {isEditing ? (
              <div className="space-y-4">
                {renderEditForm()}
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DynamicSectionEditor;
