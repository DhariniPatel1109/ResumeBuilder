// AI Processing Indicator Component
import React, { useEffect, useState } from 'react';
import { AIProcessingStatus } from '../../../types/ai';

interface AIProcessingIndicatorProps {
  isVisible: boolean;
  onComplete?: () => void;
  onCancel?: () => void;
}

const AIProcessingIndicator: React.FC<AIProcessingIndicatorProps> = ({
  isVisible,
  onComplete,
  onCancel,
}) => {
  const [currentStage, setCurrentStage] = useState<AIProcessingStatus>({
    stage: 'analyzing',
    progress: 0,
    message: 'Initializing AI enhancement...',
  });

  const stages: AIProcessingStatus[] = [
    { stage: 'analyzing', progress: 20, message: 'Analyzing job requirements...' },
    { stage: 'enhancing', progress: 50, message: 'Enhancing bullet points...' },
    { stage: 'optimizing', progress: 80, message: 'Optimizing keywords and structure...' },
    { stage: 'complete', progress: 100, message: 'Enhancement complete!' },
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStage({
        stage: 'analyzing',
        progress: 0,
        message: 'Initializing AI enhancement...',
      });
      return;
    }

    let stageIndex = 0;
    const interval = setInterval(() => {
      if (stageIndex < stages.length) {
        setCurrentStage(stages[stageIndex]);
        stageIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'analyzing': return '🔍';
      case 'enhancing': return '✨';
      case 'optimizing': return '🎯';
      case 'complete': return '✅';
      default: return '🤖';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'analyzing': return '#667eea';
      case 'enhancing': return '#28a745';
      case 'optimizing': return '#f39c12';
      case 'complete': return '#20c997';
      default: return '#6c757d';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🤖</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI Enhancement in Progress</h3>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="text-2xl mb-3">
              {getStageIcon(currentStage.stage)}
            </div>
            <div className="text-gray-700 dark:text-gray-300 mb-4">{currentStage.message}</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${currentStage.progress}%`,
                  backgroundColor: getStageColor(currentStage.stage)
                }}
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{currentStage.progress}%</div>
          </div>

          <div className="space-y-3">
            {stages.map((stage, index) => {
              const isActive = currentStage.stage === stage.stage;
              const isCompleted = stages.findIndex(s => s.stage === currentStage.stage) > index;
              const isPending = !isActive && !isCompleted;
              
              return (
                <div 
                  key={stage.stage}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700' 
                      : isCompleted
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                      : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className={`text-lg ${
                    isActive ? 'text-primary-600 dark:text-primary-400' :
                    isCompleted ? 'text-green-600 dark:text-green-400' :
                    'text-gray-400 dark:text-gray-500'
                  }`}>
                    {isCompleted ? '✅' : isActive ? getStageIcon(stage.stage) : '⏳'}
                  </div>
                  <div className={`text-sm ${
                    isActive ? 'text-primary-700 dark:text-primary-300 font-medium' :
                    isCompleted ? 'text-green-700 dark:text-green-300' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {stage.message}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            disabled={currentStage.stage === 'complete'}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIProcessingIndicator;
