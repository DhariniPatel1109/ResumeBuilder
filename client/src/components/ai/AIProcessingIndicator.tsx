// AI Processing Indicator Component
import React, { useEffect, useState } from 'react';
import { AIProcessingStatus } from '../../types/ai';
import './AIProcessingIndicator.css';

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
    <div className="ai-processing-overlay">
      <div className="ai-processing-modal">
        <div className="processing-header">
          <div className="processing-icon">
            <span className="ai-robot">🤖</span>
          </div>
          <h3>AI Enhancement in Progress</h3>
        </div>

        <div className="processing-content">
          <div className="stage-indicator">
            <div className="stage-icon">
              {getStageIcon(currentStage.stage)}
            </div>
            <div className="stage-info">
              <div className="stage-message">{currentStage.message}</div>
              <div className="stage-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${currentStage.progress}%`,
                      backgroundColor: getStageColor(currentStage.stage)
                    }}
                  />
                </div>
                <div className="progress-text">{currentStage.progress}%</div>
              </div>
            </div>
          </div>

          <div className="processing-steps">
            {stages.map((stage, index) => (
              <div 
                key={stage.stage}
                className={`processing-step ${
                  currentStage.stage === stage.stage ? 'active' : 
                  stages.findIndex(s => s.stage === currentStage.stage) > index ? 'completed' : 'pending'
                }`}
              >
                <div className="step-icon">
                  {stages.findIndex(s => s.stage === currentStage.stage) > index ? '✅' : 
                   currentStage.stage === stage.stage ? getStageIcon(stage.stage) : '⏳'}
                </div>
                <div className="step-text">{stage.message}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="processing-actions">
          <button 
            onClick={onCancel}
            className="cancel-button"
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
