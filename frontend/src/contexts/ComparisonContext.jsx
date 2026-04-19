import { createContext, useContext, useReducer } from "react";

const initialState = {
  selectedSchools: [],
};

const comparisonReducer = (state, action) => {
  switch (action.type) {
    case "ADD_SCHOOL":
      if (state.selectedSchools.length >= 3) {
        return state;
      }
      if (state.selectedSchools.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        selectedSchools: [...state.selectedSchools, action.payload],
      };
    case "REMOVE_SCHOOL":
      return {
        ...state,
        selectedSchools: state.selectedSchools.filter(
          (id) => id !== action.payload
        ),
      };
    case "CLEAR_COMPARISON":
      return initialState;
    default:
      return state;
  }
};

const ComparisonContext = createContext();
const ComparisonDispatchContext = createContext();

export const ComparisonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(comparisonReducer, initialState);

  const addSchool = (schoolId) => {
    dispatch({ type: "ADD_SCHOOL", payload: schoolId });
  };

  const removeSchool = (schoolId) => {
    dispatch({ type: "REMOVE_SCHOOL", payload: schoolId });
  };

  const clearComparison = () => {
    dispatch({ type: "CLEAR_COMPARISON" });
  };

  const toggleSchool = (schoolId) => {
    if (state.selectedSchools.includes(schoolId)) {
      removeSchool(schoolId);
    } else {
      addSchool(schoolId);
    }
  };

  const isSelected = (schoolId) => {
    return state.selectedSchools.includes(schoolId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        selectedSchools: state.selectedSchools,
        addSchool,
        removeSchool,
        clearComparison,
        toggleSchool,
        isSelected,
      }}
    >
      <ComparisonDispatchContext.Provider value={dispatch}>
        {children}
      </ComparisonDispatchContext.Provider>
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
};

export const useComparisonDispatch = () => {
  return useContext(ComparisonDispatchContext);
};
