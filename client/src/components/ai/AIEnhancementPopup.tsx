/**
 * AI Enhancement Popup - Modern, Redesigned
 * Provides AI-powered resume enhancement suggestions
 */

import React, { useState, useEffect } from 'react';
import { useAIEnhancement } from '../../hooks/useAIEnhancement';
import { ResumeData } from '../../types';
import { AISuggestion } from '../../types/ai';
import Card from '../ui/Card';
import DiffView from './DiffView';
import Button from '../ui/Button';
import { 
  Bot, 
  X, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Sparkles,
  Target,
  FileText,
  Briefcase,
  Wrench,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  RefreshCw
} from 'lucide-react';

interface AIEnhancementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData | null;
  onApplySuggestions: (suggestions: AISuggestion[]) => void;
}

const AIEnhancementPopup: React.FC<AIEnhancementPopupProps> = ({
  isOpen,
  onClose,
  resumeData,
  onApplySuggestions
}) => {
  const {
    jobDescription,
    isProcessing,
    suggestions,
    error,
    canStartEnhancement,
    hasSuggestions,
    hasError,
    updateJobDescription,
    startEnhancement,
    applySuggestions,
    clearSuggestions,
    clearError,
    reset
  } = useAIEnhancement();

  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [processingStage, setProcessingStage] = useState<string>('');
  const [editingSuggestion, setEditingSuggestion] = useState<string | null>(null);
  const [editedSuggestions, setEditedSuggestions] = useState<Map<string, string>>(new Map());
  const [showFullText, setShowFullText] = useState<Map<string, boolean>>(new Map());

  // Reset state when popup opens
  useEffect(() => {
    if (isOpen) {
      reset();
      setSelectedSuggestions(new Set());
      setExpandedSections(new Set());
    }
  }, [isOpen, reset]);

  // Simulate processing stages
  useEffect(() => {
    if (isProcessing) {
      const stages = [
        'Analyzing job requirements...',
        'Enhancing bullet points...',
        'Optimizing keywords...',
        'Finalizing suggestions...'
      ];
      
      let currentStage = 0;
      const interval = setInterval(() => {
        if (currentStage < stages.length) {
          setProcessingStage(stages[currentStage]);
          currentStage++;
        } else {
          clearInterval(interval);
        }
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const handleStartEnhancement = async () => {
    if (!resumeData || !canStartEnhancement) return;

    try {
      await startEnhancement(resumeData);
    } catch (error) {
      console.error('AI enhancement failed:', error);
    }
  };

  const handleSuggestionToggle = (suggestionId: string) => {
    setSelectedSuggestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(suggestionId)) {
        newSet.delete(suggestionId);
      } else {
        newSet.add(suggestionId);
      }
      return newSet;
    });
  };

  const handleApplySelected = async () => {
    if (selectedSuggestions.size === 0) return;

    try {
      const success = await applySuggestions(Array.from(selectedSuggestions));
      if (success) {
        // Get the actual suggestions to pass to parent, using edited versions if available
        const suggestionsToApply = getAllSuggestions().filter(s => 
          selectedSuggestions.has(s.id)
        ).map(s => ({
          ...s,
          enhanced: editedSuggestions.get(s.id) || s.enhanced
        }));
        onApplySuggestions(suggestionsToApply);
        onClose();
      }
    } catch (error) {
      console.error('Failed to apply suggestions:', error);
    }
  };

  const handleApplyAll = async () => {
    const allSuggestionIds = getAllSuggestions().map(s => s.id);
    setSelectedSuggestions(new Set(allSuggestionIds));
    
    try {
      const success = await applySuggestions(allSuggestionIds);
      if (success) {
        const suggestionsToApply = getAllSuggestions().map(s => ({
          ...s,
          enhanced: editedSuggestions.get(s.id) || s.enhanced
        }));
        onApplySuggestions(suggestionsToApply);
        onClose();
      }
    } catch (error) {
      console.error('Failed to apply all suggestions:', error);
    }
  };

  const handleSuggestionEdit = (suggestionId: string, editedText: string) => {
    setEditedSuggestions(prev => {
      const newMap = new Map(prev);
      newMap.set(suggestionId, editedText);
      return newMap;
    });
    setEditingSuggestion(null);
  };

  const handleSuggestionAction = (suggestionId: string, action: 'accept' | 'reject' | 'edit') => {
    switch (action) {
      case 'accept':
        setSelectedSuggestions(prev => {
          const newSet = new Set(prev);
          newSet.add(suggestionId);
          return newSet;
        });
        break;
      case 'reject':
        setSelectedSuggestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(suggestionId);
          return newSet;
        });
        break;
      case 'edit':
        setEditingSuggestion(suggestionId);
        break;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const toggleFullText = (suggestionId: string) => {
    setShowFullText(prev => {
      const newMap = new Map(prev);
      newMap.set(suggestionId, !newMap.get(suggestionId));
      return newMap;
    });
  };

  const getAllSuggestions = (): AISuggestion[] => {
    if (!suggestions) return [];
    
    const allSuggestions: AISuggestion[] = [];
    
    if (suggestions.personalSummary) {
      allSuggestions.push(suggestions.personalSummary);
    }
    
    allSuggestions.push(...suggestions.workExperience);
    allSuggestions.push(...suggestions.projects);
    
    return allSuggestions;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'personalSummary': return <FileText className="w-4 h-4" />;
      case 'workExperience': return <Briefcase className="w-4 h-4" />;
      case 'projects': return <Wrench className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card variant="elevated" className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Resume Enhancement
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get AI-powered suggestions to optimize your resume
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Job Description Input */}
          {!hasSuggestions && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Job Description
                    </label>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {jobDescription.length}/2000 characters
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Paste the job description to get targeted AI suggestions for your resume
                  </p>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => updateJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none"
                    rows={6}
                  />
                  {jobDescription.length >= 2000 && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mt-3">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Job description is too long (maximum 2000 characters)
                      </p>
                    </div>
                  )}
                </div>

                {hasError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearError}
                      className="ml-auto text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={handleStartEnhancement}
                    disabled={!canStartEnhancement || isProcessing}
                    className="flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {isProcessing ? 'Processing...' : 'Enhance Resume'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  AI is working its magic...
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {processingStage}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions Display */}
          {hasSuggestions && suggestions && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Suggestions
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Review and select the suggestions you'd like to apply
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearSuggestions();
                      reset();
                    }}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Start Over
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Personal Summary Suggestions */}
                {suggestions.personalSummary && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('personalSummary')}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {getSectionIcon('personalSummary')}
                        <span className="font-medium text-gray-900 dark:text-white">
                          Personal Summary
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {suggestions.personalSummary.confidence > 0.8 ? 'High confidence' : 'Medium confidence'}
                        </span>
                      </div>
                      {expandedSections.has('personalSummary') ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedSections.has('personalSummary') && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-4">
                          {/* Confidence Indicator */}
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              suggestions.personalSummary.confidence >= 0.8 ? 'bg-green-500' :
                              suggestions.personalSummary.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <span className={`text-xs font-medium ${getConfidenceColor(suggestions.personalSummary.confidence)}`}>
                              {getConfidenceText(suggestions.personalSummary.confidence)} Confidence
                            </span>
                          </div>

                          {/* AI Reasoning */}
                          {suggestions.personalSummary.reasoning && (
                            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                              <span className="text-sm text-blue-700 dark:text-blue-300">{suggestions.personalSummary.reasoning}</span>
                            </div>
                          )}

                          {/* Enhanced Side-by-Side Diff View */}
                          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            {editingSuggestion === suggestions.personalSummary?.id ? (
                              <textarea
                                value={editedSuggestions.get(suggestions.personalSummary?.id || '') || suggestions.personalSummary?.enhanced || ''}
                                onChange={(e) => setEditedSuggestions(prev => {
                                  const newMap = new Map(prev);
                                  if (suggestions.personalSummary) {
                                    newMap.set(suggestions.personalSummary.id, e.target.value);
                                  }
                                  return newMap;
                                })}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none"
                                rows={6}
                              />
                            ) : (
                              <DiffView
                                original={showFullText.get(suggestions.personalSummary.id) 
                                  ? suggestions.personalSummary.original 
                                  : truncateText(suggestions.personalSummary.original)
                                }
                                enhanced={showFullText.get(suggestions.personalSummary.id) 
                                  ? (editedSuggestions.get(suggestions.personalSummary.id) || suggestions.personalSummary.enhanced)
                                  : truncateText(editedSuggestions.get(suggestions.personalSummary.id) || suggestions.personalSummary.enhanced)
                                }
                                className="min-h-[120px]"
                              />
                            )}
                          </div>

                          {/* Show More/Less */}
                          {suggestions.personalSummary && (suggestions.personalSummary.original.length > 200 || suggestions.personalSummary.enhanced.length > 200) && (
                            <button
                              onClick={() => toggleFullText(suggestions.personalSummary?.id || '')}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                            >
                              {showFullText.get(suggestions.personalSummary?.id || '') ? 'Show Less' : 'Show More'}
                            </button>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {editingSuggestion === suggestions.personalSummary?.id ? (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleSuggestionEdit(suggestions.personalSummary?.id || '', editedSuggestions.get(suggestions.personalSummary?.id || '') || suggestions.personalSummary?.enhanced || '')}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Save Changes
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingSuggestion(null);
                                    setEditedSuggestions(prev => {
                                      const newMap = new Map(prev);
                                      if (suggestions.personalSummary) {
                                        newMap.delete(suggestions.personalSummary.id);
                                      }
                                      return newMap;
                                    });
                                  }}
                                  className="flex items-center gap-2"
                                >
                                  <X className="w-4 h-4" />
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant={selectedSuggestions.has(suggestions.personalSummary?.id || '') ? "primary" : "outline"}
                                  size="sm"
                                  onClick={() => handleSuggestionAction(suggestions.personalSummary?.id || '', selectedSuggestions.has(suggestions.personalSummary?.id || '') ? 'reject' : 'accept')}
                                  className="flex items-center gap-2"
                                >
                                  {selectedSuggestions.has(suggestions.personalSummary?.id || '') ? (
                                    <XCircle className="w-4 h-4" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                  {selectedSuggestions.has(suggestions.personalSummary?.id || '') ? 'Reject' : 'Accept'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestionAction(suggestions.personalSummary?.id || '', 'edit')}
                                  className="flex items-center gap-2"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  Edit
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Work Experience Suggestions */}
                {suggestions.workExperience.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('workExperience')}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {getSectionIcon('workExperience')}
                        <span className="font-medium text-gray-900 dark:text-white">
                          Work Experience ({suggestions.workExperience.length} suggestions)
                        </span>
                      </div>
                      {expandedSections.has('workExperience') ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedSections.has('workExperience') && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                        {suggestions.workExperience.map((suggestion, index) => (
                          <div key={suggestion.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {suggestion.jobTitle} at {suggestion.company}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Bullet point {suggestion.bulletIndex + 1}
                                </p>
                              </div>
                              <Button
                                variant={selectedSuggestions.has(suggestion.id) ? "primary" : "outline"}
                                size="sm"
                                onClick={() => handleSuggestionToggle(suggestion.id)}
                                className="flex items-center gap-2"
                              >
                                {selectedSuggestions.has(suggestion.id) ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <Target className="w-4 h-4" />
                                )}
                                {selectedSuggestions.has(suggestion.id) ? 'Selected' : 'Select'}
                              </Button>
                            </div>
                            <div className="space-y-3">
                              <DiffView
                                original={suggestion.original}
                                enhanced={suggestion.enhanced}
                                className="min-h-[80px]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Projects Suggestions */}
                {suggestions.projects.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('projects')}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {getSectionIcon('projects')}
                        <span className="font-medium text-gray-900 dark:text-white">
                          Projects ({suggestions.projects.length} suggestions)
                        </span>
                      </div>
                      {expandedSections.has('projects') ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedSections.has('projects') && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                        {suggestions.projects.map((suggestion, index) => (
                          <div key={suggestion.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {suggestion.projectName}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Bullet point {suggestion.bulletIndex + 1}
                                </p>
                              </div>
                              <Button
                                variant={selectedSuggestions.has(suggestion.id) ? "primary" : "outline"}
                                size="sm"
                                onClick={() => handleSuggestionToggle(suggestion.id)}
                                className="flex items-center gap-2"
                              >
                                {selectedSuggestions.has(suggestion.id) ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <Target className="w-4 h-4" />
                                )}
                                {selectedSuggestions.has(suggestion.id) ? 'Selected' : 'Select'}
                              </Button>
                            </div>
                            <div className="space-y-3">
                              <DiffView
                                original={suggestion.original}
                                enhanced={suggestion.enhanced}
                                className="min-h-[80px]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedSuggestions.size} of {getAllSuggestions().length} suggestion{getAllSuggestions().length !== 1 ? 's' : ''} selected
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleApplyAll}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Apply All ({getAllSuggestions().length})
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleApplySelected}
                    disabled={selectedSuggestions.size === 0}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Apply Selected ({selectedSuggestions.size})
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AIEnhancementPopup;
