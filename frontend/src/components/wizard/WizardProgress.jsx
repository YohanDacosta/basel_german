const WizardProgress = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Question {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-violet-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default WizardProgress;
