import React from 'react';
import { PipelineStatus, PipelineStep, getCurrentStep, getCompletedSteps, getPipelineProgress } from '../utils/pipelineManager';

interface TrackingPipelineProps {
  pipelineStatus: PipelineStatus;
  onStatusUpdate?: (newStatus: PipelineStatus) => void;
  showUpdateControls?: boolean;
}

const TrackingPipeline: React.FC<TrackingPipelineProps> = ({ 
  pipelineStatus, 
  onStatusUpdate,
  showUpdateControls = false 
}) => {
  const currentStep = getCurrentStep(pipelineStatus);
  const completedSteps = getCompletedSteps(pipelineStatus);
  const progress = getPipelineProgress(pipelineStatus);
  
  // Convert pipeline status to array for rendering
  const steps = Object.values(pipelineStatus).sort((a, b) => a.order - b.order);
  
  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 md:p-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Tracking Progress
      </h3>
      
      <div className="relative">
        {/* Progress line background */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full" 
             style={{ 
               left: `${100 / (steps.length * 2)}%`, 
               right: `${100 / (steps.length * 2)}%` 
             }} 
        />
        
        {/* Active progress line - shows progress based on completed steps */}
        <div 
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
          style={{ 
            left: `${100 / (steps.length * 2)}%`,
            width: `${Math.max(0, (completedSteps.length - 1) * (100 / (steps.length - 1)) * (1 - 1/steps.length))}%`
          }}
        />

        <div className="flex justify-between items-start relative">
          {steps.map((step, index) => {
            const isCompleted = step.completed;
            const isCurrent = step.isCurrent;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10" style={{ flex: '1' }}>
                {/* Step circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                    isCompleted
                      ? isCurrent
                        ? 'bg-green-600 border-green-600 text-white shadow-lg transform scale-110 ring-4 ring-purple-200' 
                        : 'bg-green-600 border-green-600 text-white shadow-lg'
                      : 'bg-white border-gray-300 text-gray-400 shadow-md'
                  }`}
                >
                  {isCompleted ? (
                    isCurrent ? (
                      <div className="relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {/* Pulsing indicator for current step */}
                        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30"></div>
                      </div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                
                {/* Step label */}
                <div className={`mt-3 text-center transition-all duration-300 ${
                  isCompleted 
                    ? isCurrent 
                      ? 'text-green-600 font-bold' 
                      : 'text-green-600 font-semibold'
                    : 'text-gray-600 font-medium'
                }`}>
                  <div className="text-sm md:text-base">
                    {step.label}
                  </div>
                  
                  {/* Timestamp */}
                  {step.timestamp && (
                    <div className="mt-1 text-xs text-gray-800">
                      <div>{new Date(step.timestamp).toLocaleDateString()}</div>
                      <div>{new Date(step.timestamp).toLocaleTimeString()}</div>
                    </div>
                  )}
                </div>
                
                {/* Status indicator */}
                {isCompleted && (
                  <div className={`mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                    isCurrent 
                      ? 'bg-purple-100 text-green-700 animate-pulse' 
                      : isLast 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-green-100 text-green-700'
                  }`}>
                    {isCurrent ? 'Current' : isLast ? 'Final' : 'Completed'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Progress summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Current Status: <span className="font-semibold text-green-600">{currentStep?.label || 'Unknown'}</span>
            <span className="text-gray-400 ml-2">({completedSteps.length} of {steps.length} completed)</span>
          </span>
          <span className="text-green-600 font-bold text-lg">
            {progress}%
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Completed steps summary */}
        {completedSteps.length > 0 && (
          <div className="mt-3 text-xs text-gray-500">
            <span className="font-medium">Completed steps:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {completedSteps.map((step, index) => (
                <span 
                  key={step.id}
                  className={`px-2 py-1 rounded-full ${
                    step.isCurrent 
                      ? 'bg-purple-200 text-green-800' 
                      : 'bg-green-200 text-green-800'
                  }`}
                >
                  {step.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPipeline;
