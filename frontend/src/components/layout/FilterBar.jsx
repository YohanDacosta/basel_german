import { useState } from "react";
import { useDisptachFilters, useFilters } from "../../contexts/CoursesContext.js";

const FilterBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { dispatchFilter } = useDisptachFilters();
  const { filters } = useFilters();

  const handleOnChange = (ev) => {
    const { checked, value, id } = ev.target;
    dispatchFilter({ type: "FILTER_COURSES", payload: { value, checked, id } });
  };

  const cleanChecked = () => {
    dispatchFilter({ type: "CLEAN_FILTERS" });
  };

  const hasActiveFilters = () => {
    return (
      Object.values(filters.school).some(Boolean) ||
      Object.values(filters.level).some(Boolean)
    );
  };

  const schools = [
    { id: "ecap", label: "ECAP" },
    { id: "k5", label: "K5" },
    { id: "academia", label: "Academia" },
  ];

  const levels = [
    { id: "a1", label: "A1" },
    { id: "a2", label: "A2" },
    { id: "b1", label: "B1" },
    { id: "b2", label: "B2" },
    { id: "c1", label: "C1" },
    { id: "c2", label: "C2" },
    { id: "alpha", label: "Alpha" },
  ];

  return (
    <div className="lg:w-64 flex-shrink-0">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-md mb-4"
      >
        <span className="font-semibold text-gray-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {hasActiveFilters() && (
            <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
          )}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter Panel */}
      <div className={`bg-white rounded-lg shadow-md p-4 ${isOpen ? "block" : "hidden"} lg:block`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Filters</h3>
          {hasActiveFilters() && (
            <button
              onClick={cleanChecked}
              className="text-sm text-violet-600 hover:text-violet-800"
            >
              Clear all
            </button>
          )}
        </div>

        {/* School Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            School
          </h4>
          <div className="space-y-2">
            {schools.map((school) => (
              <label
                key={school.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.school[school.id] || false}
                  value={school.id}
                  id="school"
                  onChange={handleOnChange}
                  className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                  {school.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Level Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Level
          </h4>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <label
                key={level.id}
                className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
                  filters.level[level.id]
                    ? "bg-violet-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-violet-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={filters.level[level.id] || false}
                  value={level.id}
                  id="level"
                  onChange={handleOnChange}
                  className="sr-only"
                />
                {level.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
