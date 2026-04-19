import { useReducer } from "react";
import {
  CoursesContext,
  CoursesDispatchContext,
  filterReducer,
  initialStateFilters,
  initialStateSearch,
  searchReducer,
} from "./CoursesContext.js";

const CoursesProvider = ({ children }) => {
  const [filters, dispatchFilter] = useReducer(
    filterReducer,
    initialStateFilters
  );
  const [search, dispatchSearch] = useReducer(
    searchReducer,
    initialStateSearch
  );

  return (
    <CoursesContext.Provider value={{ filters, search }}>
      <CoursesDispatchContext.Provider
        value={{ dispatchFilter, dispatchSearch }}
      >
        {children}
      </CoursesDispatchContext.Provider>
    </CoursesContext.Provider>
  );
};

export default CoursesProvider;
