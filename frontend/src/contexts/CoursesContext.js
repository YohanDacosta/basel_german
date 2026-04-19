import { createContext, useContext } from "react";

const initialStateFilters = {
  school: {
    ecap: false,
    k5: false,
    academia: false,
    bilingua: false,
  },
  level: {
    a1: false,
    a2: false,
    b1: false,
    b2: false,
    c1: false,
    c2: false,
    alpha: false,
  },
};

const initialStateSearch = {
  search: null,
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case "FILTER_COURSES":
      return {
        ...state,
        [action.payload.id.split("_")[0]]: {
          ...state[action.payload.id.split("_")[0]],
          [action.payload.value]: action.payload.checked,
        },
      };
    case "CLEAN_FILTERS":
      return initialStateFilters;
  }
};

const searchReducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_COURSES":
      return {
        ...state,
        search: action.payload.search,
      };
    default:
      return state;
  }
};

const CoursesContext = createContext();
const CoursesDispatchContext = createContext();

const useFilters = () => {
  return useContext(CoursesContext);
};

const useDisptachFilters = () => {
  return useContext(CoursesDispatchContext);
};

export {
  CoursesContext,
  CoursesDispatchContext,
  useFilters,
  useDisptachFilters,
  filterReducer,
  searchReducer,
  initialStateFilters,
  initialStateSearch,
};
