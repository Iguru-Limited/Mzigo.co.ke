import React, { useState } from 'react';
import { 
  PipelineStatus, 
  PipelineStepId, 
  PIPELINE_STEPS_ORDER, 
  STEP_LABELS,
  getCurrentStep, 
  getNextStep,
  canAdvanceToStep,
  advanceToNextStep,
  setPipelineToStep 
} from '../utils/pipelineManager';

interface StatusUpdaterProps {
  pipelineStatus: PipelineStatus;
  onStatusUpdate: (newStatus: PipelineStatus) => void;
  isAdmin?: boolean;
  disabled?: boolean;
}

const StatusUpdater: React.FC<StatusUpdaterProps> = ({ 
  pipelineStatus, 
  onStatusUpdate, 
  isAdmin = false,
  disabled = false 
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'advance' | 'set';
    targetStep?: PipelineStepId;
  } | null>(null);

  const currentStep = getCurrentStep(pipelineStatus);
  const nextStep = getNextStep(pipelineStatus);

  const handleAdvanceToNext = () => {
    if (!nextStep || disabled) return;
    
    setPendingAction({ type: 'advance' });
    setShowConfirmDialog(true);
  };

  const handleSetToStep = (stepId: PipelineStepId) => {
    if (disabled) return;
    
    setPendingAction({ type: 'set', targetStep: stepId });
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    if (!pendingAction) return;

    let newStatus: PipelineStatus;

    if (pendingAction.type === 'advance') {
      newStatus = advanceToNextStep(pipelineStatus);
    } else if (pendingAction.type === 'set' && pendingAction.targetStep) {
      newStatus = setPipelineToStep(pipelineStatus, pendingAction.targetStep);
    } else {
      return;
    }

    onStatusUpdate(newStatus);
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  const cancelAction = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  const getActionDescription = () => {
    if (!pendingAction) return '';

    if (pendingAction.type === 'advance' && nextStep) {
      return `Advance from "${currentStep?.label}" to "${nextStep.label}"`;
    } else if (pendingAction.type === 'set' && pendingAction.targetStep) {
      const targetLabel = STEP_LABELS[pendingAction.targetStep];
      return `Set status to "${targetLabel}"`;
    }
    return '';
  };

  if (disabled) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-gray-500 text-sm">Status updates are currently disabled</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Update Status
      </h3>

      {/* Current Status Display */}
      <div className="mb-4 p-3 bg-purple-50 rounded-lg">
        <div className="text-sm text-gray-600">Current Status:</div>
        <div className="text-lg font-semibold text-green-600">
          {currentStep?.label || 'Unknown'}
        </div>
        {currentStep?.timestamp && (
          <div className="text-xs text-gray-500 mt-1">
            Updated: {new Date(currentStep.timestamp).toLocaleString()}
          </div>
        )}
      </div>

      {/* Quick Advance Button */}
      {nextStep && (
        <div className="mb-4">
          <button
            onClick={handleAdvanceToNext}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Advance to {nextStep.label}
          </button>
        </div>
      )}

      {/* Admin Controls */}
      {isAdmin && (
        <div className="border-t pt-4">
          <div className="text-sm font-medium text-gray-700 mb-3">
            Admin Controls - Set to any status:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PIPELINE_STEPS_ORDER.map((stepId) => {
              const step = pipelineStatus[stepId];
              const isCurrent = step.isCurrent;
              const isCompleted = step.completed;
              
              return (
                <button
                  key={stepId}
                  onClick={() => handleSetToStep(stepId)}
                  disabled={isCurrent}
                  className={`p-2 text-xs font-medium rounded transition-colors duration-200 ${
                    isCurrent
                      ? 'bg-purple-100 text-green-600 cursor-not-allowed'
                      : isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {step.label}
                  {isCurrent && ' (Current)'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No Next Step Message */}
      {!nextStep && (
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-green-600 font-medium">
            🎉 Pipeline Complete!
          </div>
          <div className="text-sm text-green-600 mt-1">
            All steps have been completed successfully.
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Status Update
            </h4>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {getActionDescription()}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelAction}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusUpdater;
