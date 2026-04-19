import { useWizard } from "../../contexts/WizardContext.jsx";

const WizardStep = ({ question, currentAnswer }) => {
  const { answerAndProceed, prevStep, currentStep } = useWizard();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => answerAndProceed(question.id, option.value)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              currentAnswer === option.value
                ? "border-violet-500 bg-violet-50 text-violet-700"
                : "border-gray-200 hover:border-violet-300 hover:bg-violet-50"
            }`}
          >
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      {currentStep > 0 && (
        <button
          onClick={prevStep}
          className="mt-6 flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Previous question
        </button>
      )}
    </div>
  );
};

export default WizardStep;
