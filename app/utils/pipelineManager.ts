// Pipeline Manager for Sequential Boolean Status System
// Multiple steps can be true (all completed + current step)

export interface PipelineStep {
  id: string;
  label: string;
  completed: boolean;
  isCurrent: boolean;
  timestamp?: string;
  order: number;
}

export interface PipelineStatus {
  registered: PipelineStep;
  dropOff: PipelineStep;
  inTransit: PipelineStep;
  delivered: PipelineStep;
  notified: PipelineStep;
  collected: PipelineStep;
}

// Define the sequential order of pipeline steps
export const PIPELINE_STEPS_ORDER = [
  'registered',
  'dropOff', 
  'inTransit',
  'delivered',
  'notified',
  'collected'
] as const;

export type PipelineStepId = typeof PIPELINE_STEPS_ORDER[number];

// Step labels for display
export const STEP_LABELS: Record<PipelineStepId, string> = {
  registered: 'Registered',
  dropOff: 'Drop off',
  inTransit: 'In-transit',
  delivered: 'Delivered',
  notified: 'Notified',
  collected: 'Collected'
};

/**
 * Creates initial pipeline status with only 'registered' as true and current
 */
export function createInitialPipelineStatus(): PipelineStatus {
  const now = new Date().toISOString();
  
  return {
    registered: {
      id: 'registered',
      label: STEP_LABELS.registered,
      completed: true,
      isCurrent: true,
      timestamp: now,
      order: 0
    },
    dropOff: {
      id: 'dropOff',
      label: STEP_LABELS.dropOff,
      completed: false,
      isCurrent: false,
      order: 1
    },
    inTransit: {
      id: 'inTransit',
      label: STEP_LABELS.inTransit,
      completed: false,
      isCurrent: false,
      order: 2
    },
    delivered: {
      id: 'delivered',
      label: STEP_LABELS.delivered,
      completed: false,
      isCurrent: false,
      order: 3
    },
    notified: {
      id: 'notified',
      label: STEP_LABELS.notified,
      completed: false,
      isCurrent: false,
      order: 4
    },
    collected: {
      id: 'collected',
      label: STEP_LABELS.collected,
      completed: false,
      isCurrent: false,
      order: 5
    }
  };
}

/**
 * Gets the current active step from pipeline status
 */
export function getCurrentStep(pipelineStatus: PipelineStatus): PipelineStep | null {
  const steps = Object.values(pipelineStatus);
  return steps.find(step => step.isCurrent) || null;
}

/**
 * Gets all completed steps (true) from pipeline status
 */
export function getCompletedSteps(pipelineStatus: PipelineStatus): PipelineStep[] {
  const steps = Object.values(pipelineStatus);
  return steps.filter(step => step.completed).sort((a, b) => a.order - b.order);
}

/**
 * Gets the next step in sequence that can be activated
 */
export function getNextStep(pipelineStatus: PipelineStatus): PipelineStep | null {
  const currentStep = getCurrentStep(pipelineStatus);
  if (!currentStep) return null;
  
  const nextOrder = currentStep.order + 1;
  const steps = Object.values(pipelineStatus);
  return steps.find(step => step.order === nextOrder) || null;
}

/**
 * Validates if a step transition is allowed (sequential only)
 */
export function canAdvanceToStep(
  pipelineStatus: PipelineStatus, 
  targetStepId: PipelineStepId
): boolean {
  const currentStep = getCurrentStep(pipelineStatus);
  if (!currentStep) return false;
  
  const targetStep = pipelineStatus[targetStepId];
  if (!targetStep) return false;
  
  // Can only advance to the immediate next step
  return targetStep.order === currentStep.order + 1;
}

/**
 * Advances pipeline to the next step in sequence
 * - Current step becomes completed (remains true)
 * - Next step becomes current (becomes true)
 * - All previous steps remain completed (true)
 */
export function advanceToNextStep(pipelineStatus: PipelineStatus): PipelineStatus {
  const currentStep = getCurrentStep(pipelineStatus);
  if (!currentStep) return pipelineStatus;
  
  const nextStep = getNextStep(pipelineStatus);
  if (!nextStep) return pipelineStatus; // Already at final step
  
  const now = new Date().toISOString();
  
  // Create new pipeline status
  const newPipelineStatus = { ...pipelineStatus };
  
  // Update current step - no longer current but remains completed
  const currentStepKey = currentStep.id as PipelineStepId;
  newPipelineStatus[currentStepKey] = {
    ...currentStep,
    isCurrent: false,
    completed: true // Ensure it stays true
  };
  
  // Update next step - becomes current and completed
  const nextStepKey = nextStep.id as PipelineStepId;
  newPipelineStatus[nextStepKey] = {
    ...nextStep,
    isCurrent: true,
    completed: true,
    timestamp: now
  };
  
  return newPipelineStatus;
}

/**
 * Sets pipeline to a specific step (for admin/manual updates)
 * Ensures all previous steps are marked as completed
 */
export function setPipelineToStep(
  pipelineStatus: PipelineStatus, 
  targetStepId: PipelineStepId
): PipelineStatus {
  const targetStep = pipelineStatus[targetStepId];
  if (!targetStep) return pipelineStatus;
  
  const now = new Date().toISOString();
  const newPipelineStatus = { ...pipelineStatus };
  
  // Reset all steps first
  Object.keys(newPipelineStatus).forEach(key => {
    const stepKey = key as PipelineStepId;
    newPipelineStatus[stepKey] = {
      ...newPipelineStatus[stepKey],
      isCurrent: false
    };
  });
  
  // Mark all steps up to and including target as completed
  Object.keys(newPipelineStatus).forEach(key => {
    const stepKey = key as PipelineStepId;
    const step = newPipelineStatus[stepKey];
    
    if (step.order <= targetStep.order) {
      newPipelineStatus[stepKey] = {
        ...step,
        completed: true,
        isCurrent: step.order === targetStep.order,
        timestamp: step.order === targetStep.order ? now : step.timestamp
      };
    } else {
      newPipelineStatus[stepKey] = {
        ...step,
        completed: false,
        isCurrent: false
      };
    }
  });
  
  return newPipelineStatus;
}

/**
 * Gets pipeline progress as percentage
 */
export function getPipelineProgress(pipelineStatus: PipelineStatus): number {
  const completedSteps = getCompletedSteps(pipelineStatus);
  const totalSteps = PIPELINE_STEPS_ORDER.length;
  return Math.round((completedSteps.length / totalSteps) * 100);
}

/**
 * Converts old string status to new pipeline status
 * For backward compatibility with existing data
 */
export function convertLegacyStatus(status: string): PipelineStatus {
  const pipelineStatus = createInitialPipelineStatus();
  
  // Map old status strings to new pipeline steps
  const statusMap: Record<string, PipelineStepId> = {
    'Registered': 'registered',
    'Drop off': 'dropOff',
    'In-transit': 'inTransit',
    'Delivered': 'delivered',
    'Notified': 'notified',
    'Collected': 'collected'
  };
  
  const targetStepId = statusMap[status];
  if (targetStepId) {
    return setPipelineToStep(pipelineStatus, targetStepId);
  }
  
  return pipelineStatus;
}

/**
 * Gets current status as string (for display/compatibility)
 */
export function getCurrentStatusString(pipelineStatus: PipelineStatus): string {
  const currentStep = getCurrentStep(pipelineStatus);
  return currentStep?.label || 'Unknown';
}
