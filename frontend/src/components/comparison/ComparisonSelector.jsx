import { useComparison } from "../../contexts/ComparisonContext.jsx";

const ComparisonSelector = ({ schools }) => {
  const { selectedSchools, toggleSchool, isSelected } = useComparison();

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Select Schools to Compare</h3>
        <span className="text-sm text-gray-500">
          {selectedSchools.length}/3 selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {schools.map((school) => {
          const selected = isSelected(school.id);
          const canSelect = selectedSchools.length < 3 || selected;

          return (
            <button
              key={school.id}
              onClick={() => toggleSchool(school.id)}
              disabled={!canSelect}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selected
                  ? "bg-violet-500 text-white"
                  : canSelect
                  ? "bg-gray-100 text-gray-700 hover:bg-violet-100 hover:text-violet-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {school.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ComparisonSelector;
