/**
 * Versions Page - Modern, Enhanced UI/UX
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { VersionService, ExportService, Version } from '../services';

const Versions: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [filteredVersions, setFilteredVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'company' | 'lastModified' | 'mostExperiences'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVersions();
  }, []);

  // Filter and sort versions
  useEffect(() => {
    let filtered = [...versions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(version =>
        version.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        version.originalDocument?.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'company':
          return a.companyName.localeCompare(b.companyName);
        case 'lastModified':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'mostExperiences':
          const aExpCount = a.sections?.workExperience?.length || 0;
          const bExpCount = b.sections?.workExperience?.length || 0;
          return bExpCount - aExpCount;
        default:
          return 0;
      }
    });

    setFilteredVersions(filtered);
  }, [versions, searchQuery, sortBy]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const versions = await VersionService.getVersions();
      setVersions(versions);
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
      VersionService.loadVersionForEditing(version);
      navigate('/editor');
    } catch (error) {
      console.error('Error loading version:', error);
      alert('Failed to load version. Please try again.');
    }
  };

  const handleExportVersion = async (version: Version, format: 'word' | 'pdf') => {
    try {
      setExporting(version.id);
      await ExportService.exportVersion(format, version);
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
      await VersionService.deleteVersion(versionId);
      setVersions(versions.filter(v => v.id !== versionId));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete version. Please try again.');
    }
  };

  const getVersionStats = () => {
    return VersionService.getVersionStats(versions);
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

  const stats = getVersionStats();

  return (
    <PageLayout
      title="Resume Versions"
      subtitle="Manage and organize your customized resume versions"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Versions' }
      ]}
    >
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Stats Overview - Only show if meaningful */}
        {versions.length > 0 && (stats.thisWeek > 0 || stats.thisMonth > 0) && (
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Progress</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stats.totalVersions} total version{stats.totalVersions !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                  {stats.thisWeek}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  This Week
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-info-600 dark:text-info-400">
                  {stats.thisMonth}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  This Month
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        {versions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search versions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon="🔍"
                className="w-full"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="company">Company A-Z</option>
                <option value="lastModified">Last Modified</option>
                <option value="mostExperiences">Most Experiences</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                ☰
              </button>
            </div>
          </div>
        )}
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
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-6xl">📄</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Build Your Resume Collection?
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                Create customized resume versions for different companies and job applications. 
                Upload your resume to get started with AI-powered customization.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">How it works:</h4>
                <div className="grid md:grid-cols-3 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Upload Resume</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Upload your existing resume</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Customize</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">AI helps tailor for each company</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Export & Apply</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Download in Word or PDF format</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/')}
                  className="px-10 py-4 text-lg font-semibold"
                >
                  🚀 Upload Your Resume
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/editor')}
                  className="px-10 py-4 text-lg font-semibold"
                >
                  📝 Start from Scratch
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Versions Display */}
        {filteredVersions.length > 0 && (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
            : "space-y-3"
          }>
            {filteredVersions.map((version) => (
              <Card 
                key={version.id} 
                variant="elevated" 
                padding="lg" 
                className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  viewMode === 'list' ? 'flex items-center justify-between' : ''
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {version.companyName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                              {version.companyName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {VersionService.getRelativeTime(version.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {VersionService.getVersionPreview(version.sections)}
                          </div>
                          {VersionService.getVersionHighlights(version.sections).length > 0 && (
                            <div className="space-y-1">
                              {VersionService.getVersionHighlights(version.sections).map((highlight, idx) => (
                                <div key={idx} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
                                  {highlight}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVersion(version.id)}
                        className="text-gray-400 hover:text-error-600 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      >
                        🗑️
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleLoadVersion(version)}
                        className="w-full text-sm font-medium py-2"
                      >
                        ✏️ Edit Resume
                      </Button>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportVersion(version, 'pdf')}
                          disabled={exporting === version.id}
                          loading={exporting === version.id}
                          className="flex-1 text-sm py-2 border-primary-200 text-primary-700 hover:bg-primary-50"
                        >
                          📄 PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportVersion(version, 'word')}
                          disabled={exporting === version.id}
                          loading={exporting === version.id}
                          className="flex-1 text-sm py-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          📝 Word
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  // List View
                  <>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {version.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {version.companyName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{VersionService.getRelativeTime(version.createdAt)}</span>
                          <span>•</span>
                          <span>{VersionService.getVersionPreview(version.sections)}</span>
                          {version.originalDocument && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-32">{version.originalDocument.fileName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleLoadVersion(version)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportVersion(version, 'word')}
                        disabled={exporting === version.id}
                        loading={exporting === version.id}
                      >
                        Word
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportVersion(version, 'pdf')}
                        disabled={exporting === version.id}
                        loading={exporting === version.id}
                      >
                        PDF
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVersion(version.id)}
                        className="text-gray-400 hover:text-error-600"
                      >
                        🗑️
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {versions.length > 0 && filteredVersions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No versions found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        {versions.length > 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6 mt-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Create More?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Add another version or upload a new resume to expand your collection
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/editor')}
                className="px-8 py-3 text-lg font-semibold"
              >
                ✨ Create New Version
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/')}
                className="px-8 py-3 text-lg font-semibold"
              >
                📤 Upload Another Resume
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Versions;