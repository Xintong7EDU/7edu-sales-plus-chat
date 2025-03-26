import React from 'react';

type OnboardingStep = 'form' | 'chat' | 'analysis';

interface OnboardingProgressBarProps {
  currentStep: OnboardingStep;
}

const OnboardingProgressBar: React.FC<OnboardingProgressBarProps> = ({ currentStep }) => {
  const steps: { id: OnboardingStep; label: string }[] = [
    { id: 'form', label: 'Basic Info' },
    { id: 'chat', label: 'Guided Chat' },
    { id: 'analysis', label: 'Analysis' },
  ];

  // Calculate progress percentage
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <div className="relative bg-green-200/50 rounded-full h-2">
        {/* Progress fill */}
        <div 
          className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${currentStepIndex === 0 ? 33.3 : currentStepIndex === 1 ? 66.6 : 100}%` 
          }}
        ></div>
        
        {/* Step indicators */}
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-1">
          {steps.map((step, index) => {
            const isActive = index <= currentStepIndex;
            const isCurrentStep = step.id === currentStep;
            const isPreviousStep = index < currentStepIndex;
            
            return (
              <div 
                key={step.id} 
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs
                  ${isPreviousStep 
                    ? 'bg-green-600 text-white' 
                    : isCurrentStep 
                      ? 'bg-green-500 text-white' 
                      : 'bg-green-100 text-green-800'
                  }
                  ${index === 0 ? 'ml-0' : index === steps.length - 1 ? 'mr-0' : ''}
                  transition-all duration-300 shadow-sm
                `}
              >
                {isPreviousStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OnboardingProgressBar; 