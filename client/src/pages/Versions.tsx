import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import './Versions.css';

interface Version {
  id: string;
  companyName: string;
  sections: any;
  createdAt: string;
}

const Versions: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_VERSIONS);
      setVersions(response.data.versions);
    } catch (error) {
      console.error('Error fetching versions:', error);
      setError('Failed to load saved versions');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadVersion = (version: Version) => {
    // Store the version data in sessionStorage and redirect to editor
    sessionStorage.setItem('resumeData', JSON.stringify({
      sections: version.sections,
      originalText: '' // We don't have original text for saved versions
    }));
    window.location.href = '/editor';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="versions-loading">
        <div className="spinner"></div>
        <p>Loading saved versions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="versions-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchVersions} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="versions">
      <div className="versions-header">
        <h1>Saved Versions</h1>
        <p>Manage your customized resume versions for different companies</p>
      </div>

      {versions.length === 0 ? (
        <div className="no-versions">
          <div className="no-versions-icon">📄</div>
          <h2>No saved versions yet</h2>
          <p>Create and save your first customized resume version</p>
          <a href="/" className="create-version-button">
            Create New Version
          </a>
        </div>
      ) : (
        <div className="versions-grid">
          {versions.map((version) => (
            <div key={version.id} className="version-card">
              <div className="version-header">
                <h3>{version.companyName}</h3>
                <span className="version-date">
                  {formatDate(version.createdAt)}
                </span>
              </div>
              
              <div className="version-preview">
                <div className="preview-section">
                  <strong>Personal Summary:</strong>
                  <p>{version.sections.personalSummary?.substring(0, 100)}...</p>
                </div>
                
                <div className="preview-section">
                  <strong>Work Experience:</strong>
                  <p>{version.sections.workExperience?.length || 0} positions</p>
                </div>
                
                <div className="preview-section">
                  <strong>Projects:</strong>
                  <p>{version.sections.projects?.length || 0} projects</p>
                </div>
              </div>
              
              <div className="version-actions">
                <button
                  onClick={() => handleLoadVersion(version)}
                  className="load-version-button"
                >
                  📝 Edit Version
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Versions;
