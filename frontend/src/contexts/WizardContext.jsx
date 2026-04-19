import { createContext, useContext, useReducer, useEffect } from "react";
import useRecommendations from "../hooks/useRecommendations.jsx";

const initialState = {
  currentStep: 0,
  answers: {
    isWorking: null,
    timeAvailable: null,
    goal: null,
    currentLevel: null,
    budget: null,
    hasChildren: null,
  },
  recommendations: [],
};

const wizardReducer = (state, action) => {
  switch (action.type) {
    case "SET_ANSWER":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer,
        },
      };
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      };
    case "SET_RECOMMENDATIONS":
      return {
        ...state,
        recommendations: action.payload,
      };
    case "RESET_WIZARD":
      return initialState;
    default:
      return state;
  }
};

const WizardContext = createContext();
const WizardDispatchContext = createContext();

export const WizardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  const { getRecommendations } = useRecommendations();

  const setAnswer = (questionId, answer) => {
    dispatch({ type: "SET_ANSWER", payload: { questionId, answer } });
  };

  const nextStep = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const prevStep = () => {
    dispatch({ type: "PREV_STEP" });
  };

  const resetWizard = () => {
    dispatch({ type: "RESET_WIZARD" });
  };

  const answerAndProceed = (questionId, answer) => {
    setAnswer(questionId, answer);
    nextStep();
  };

  useEffect(() => {
    const totalQuestions = 6;
    if (state.currentStep >= totalQuestions) {
      const recs = getRecommendations(state.answers);
      dispatch({ type: "SET_RECOMMENDATIONS", payload: recs });
    }
  }, [state.currentStep, state.answers, getRecommendations]);

  return (
    <WizardContext.Provider
      value={{
        currentStep: state.currentStep,
        answers: state.answers,
        recommendations: state.recommendations,
        setAnswer,
        nextStep,
        prevStep,
        resetWizard,
        answerAndProceed,
      }}
    >
      <WizardDispatchContext.Provider value={dispatch}>
        {children}
      </WizardDispatchContext.Provider>
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
};

export const useWizardDispatch = () => {
  return useContext(WizardDispatchContext);
};
