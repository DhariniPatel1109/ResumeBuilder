/**
 * Versions Page - Refactored with centralized theme system
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { API_ENDPOINTS } from '../config/api';
interface Version {
  id: string;
  companyName: string;
  sections: any;
  createdAt: string;
  originalDocument?: {
    fileName: string;
    filePath: string;
    fileType: string;
    uploadDate: string;
  };
}

const Versions: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_VERSIONS);
      console.log('API Response:', response.data);
      
      // Handle different response structures
      if (response.data.success && response.data.data && response.data.data.versions) {
        setVersions(response.data.data.versions);
      } else if (Array.isArray(response.data.versions)) {
        setVersions(response.data.versions);
      } else if (Array.isArray(response.data)) {
        setVersions(response.data);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setVersions([]);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
      setError('Failed to load saved versions');
      setVersions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadVersion = (version: Version) => {
    try {
      console.log('Loading version:', version);
      
      // Create resume data object with the version's sections
      const resumeData = {
        sections: version.sections,
        originalText: '', // We don't store original text in versions
        companyName: version.companyName,
        originalDocument: version.originalDocument
      };
      
      // Store in sessionStorage for the editor
      sessionStorage.setItem('resumeData', JSON.stringify(resumeData));
      
      // Navigate to editor
      navigate('/editor');
    } catch (error) {
      console.error('Error loading version:', error);
      alert('Failed to load version. Please try again.');
    }
  };

  const handleExportVersion = async (version: Version, format: 'word' | 'pdf') => {
    try {
      setExporting(version.id);
      
      const response = await axios.post(
        API_ENDPOINTS[format === 'word' ? 'EXPORT_WORD' : 'EXPORT_PDF'],
        {
          sections: version.sections,
          companyName: version.companyName,
          originalDocument: version.originalDocument
        },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Resume_${version.companyName.replace(/\s+/g, '_')}.${format === 'word' ? 'docx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export resume. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const handleDeleteVersion = async (versionId: string) => {
    if (!window.confirm('Are you sure you want to delete this version?')) {
      return;
    }

    try {
      await axios.delete(`${API_ENDPOINTS.DELETE_VERSION}/${versionId}`);
      setVersions(versions.filter(v => v.id !== versionId));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete version. Please try again.');
    }
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
      <PageLayout title="Loading Versions...">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading saved versions...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Saved Versions"
      subtitle="Manage your customized resume versions"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Versions' }
      ]}
    >
      <div className="space-y-8">
        {/* Error State */}
        {error && (
          <Card variant="elevated" padding="lg" className="border-error-200 bg-error-50">
            <div className="flex items-center gap-3">
              <span className="text-error-600 text-2xl">⚠️</span>
              <div>
                <h3 className="text-error-800 font-semibold">Error Loading Versions</h3>
                <p className="text-error-600">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchVersions}
                className="ml-auto border-error-300 text-error-700 hover:bg-error-100"
              >
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && versions.length === 0 && (
          <Card variant="elevated" padding="lg" className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No Saved Versions
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't saved any resume versions yet. Create your first version in the editor!
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/editor')}
            >
              Go to Editor
            </Button>
          </Card>
        )}

        {/* Versions Grid */}
        {versions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {versions.map((version) => (
              <Card key={version.id} variant="elevated" padding="lg" className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {version.companyName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created: {formatDate(version.createdAt)}
                    </p>
                    {version.originalDocument && (
                      <p className="text-xs text-gray-400 mt-1">
                        Source: {version.originalDocument.fileName}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVersion(version.id)}
                    className="text-gray-400 hover:text-error-600"
                  >
                    🗑️
                  </Button>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="base"
                    onClick={() => handleLoadVersion(version)}
                    fullWidth
                  >
                    📝 Edit Version
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportVersion(version, 'word')}
                      disabled={exporting === version.id}
                      loading={exporting === version.id}
                    >
                      📄 Word
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportVersion(version, 'pdf')}
                      disabled={exporting === version.id}
                      loading={exporting === version.id}
                    >
                      📋 PDF
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {versions.length > 0 && (
          <Card variant="default" padding="lg" className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need to create a new version?
              </h3>
              <p className="text-gray-600 mb-4">
                Start fresh or load an existing version to edit
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="primary"
                  onClick={() => navigate('/editor')}
                >
                  Create New Version
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Upload New Resume
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default Versions;