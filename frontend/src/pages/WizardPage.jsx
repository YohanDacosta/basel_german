import { useWizard } from "../contexts/WizardContext.jsx";
import {
  WizardStep,
  WizardProgress,
  RecommendationList,
} from "../components/wizard/index.jsx";

const questions = [
  {
    id: "isWorking",
    question: "What is your current work situation?",
    options: [
      { value: "fulltime", label: "Working full-time" },
      { value: "parttime", label: "Working part-time" },
      { value: "no", label: "Not currently working" },
    ],
  },
  {
    id: "timeAvailable",
    question: "When are you available to take classes?",
    options: [
      { value: "mornings", label: "Mornings (8:00 - 12:00)" },
      { value: "afternoons", label: "Afternoons (12:00 - 17:00)" },
      { value: "evenings", label: "Evenings (17:00 - 21:00)" },
      { value: "weekends", label: "Weekends" },
    ],
  },
  {
    id: "goal",
    question: "What is your main goal for learning German?",
    options: [
      { value: "integration", label: "Integration into Swiss society" },
      { value: "career", label: "Career advancement" },
      { value: "certificate", label: "Obtain an official certificate" },
      { value: "conversation", label: "Daily conversation skills" },
    ],
  },
  {
    id: "currentLevel",
    question: "What is your current German level?",
    options: [
      { value: "none", label: "Complete beginner" },
      { value: "alpha", label: "Learning to read/write (Alphabetization)" },
      { value: "a1", label: "A1 - Basic" },
      { value: "a2", label: "A2 - Elementary" },
      { value: "b1", label: "B1 - Intermediate" },
      { value: "b2", label: "B2+ - Upper Intermediate or higher" },
    ],
  },
  {
    id: "budget",
    question: "What is your budget for German courses?",
    options: [
      { value: "low", label: "Budget-friendly (under CHF 500)" },
      { value: "medium", label: "Moderate (CHF 500 - 2000)" },
      { value: "high", label: "Flexible (over CHF 2000)" },
    ],
  },
  {
    id: "hasChildren",
    question: "Do you need childcare during courses?",
    options: [
      { value: true, label: "Yes, I need childcare" },
      { value: false, label: "No, I don't need childcare" },
    ],
  },
];

const WizardPage = () => {
  const { currentStep, answers, recommendations, resetWizard } = useWizard();

  const isComplete = currentStep >= questions.length;

  return (
    <main className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Find Your Perfect German Course
        </h1>
        <p className="text-gray-600">
          Answer a few questions to get personalized school recommendations.
        </p>
      </div>

      {!isComplete ? (
        <>
          <WizardProgress
            currentStep={currentStep}
            totalSteps={questions.length}
          />
          <WizardStep
            question={questions[currentStep]}
            currentAnswer={answers[questions[currentStep].id]}
          />
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              Your Recommendations Are Ready!
            </h2>
            <p className="text-green-700 text-sm">
              Based on your answers, we found the best schools for you.
            </p>
          </div>

          <RecommendationList recommendations={recommendations} />

          <button
            onClick={resetWizard}
            className="w-full py-3 border border-violet-300 text-violet-600 rounded-lg hover:bg-violet-50 transition-colors"
          >
            Start Over
          </button>
        </div>
      )}
    </main>
  );
};

export default WizardPage;
