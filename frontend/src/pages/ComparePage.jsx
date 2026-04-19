import { useComparison } from "../contexts/ComparisonContext.jsx";
import useSchools from "../hooks/useSchools.jsx";
import {
  ComparisonTable,
  ComparisonSelector,
} from "../components/comparison/index.jsx";

const ComparePage = () => {
  const { selectedSchools, clearComparison } = useComparison();
  const { schools, getSchoolById } = useSchools();

  const selectedSchoolData = selectedSchools
    .map((id) => getSchoolById(id))
    .filter(Boolean);

  return (
    <main className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Compare Schools
        </h1>
        <p className="text-gray-600">
          Select up to 3 schools to compare side by side.
        </p>
      </div>

      <ComparisonSelector schools={schools} />

      {selectedSchoolData.length > 0 ? (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Comparing {selectedSchoolData.length} school
              {selectedSchoolData.length !== 1 ? "s" : ""}
            </h2>
            <button
              onClick={clearComparison}
              className="text-sm text-violet-600 hover:text-violet-800"
            >
              Clear comparison
            </button>
          </div>
          <ComparisonTable schools={selectedSchoolData} />
        </div>
      ) : (
        <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          <p className="text-gray-500">
            Select schools above to start comparing.
          </p>
        </div>
      )}
    </main>
  );
};

export default ComparePage;
