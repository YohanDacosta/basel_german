import { Link } from "react-router-dom";
import { useComparison } from "../../contexts/ComparisonContext.jsx";

const RecommendationList = ({ recommendations }) => {
  const { isSelected, toggleSchool, selectedSchools } = useComparison();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i < fullStars ? "text-yellow-400" : "text-gray-300"} fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }
    return stars;
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No recommendations available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((school, index) => {
        const selected = isSelected(school.id);
        const canSelect = selectedSchools.length < 3 || selected;

        return (
          <div
            key={school.id}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
              index === 0 ? "border-violet-500" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {index === 0 && (
                    <span className="px-2 py-1 text-xs font-semibold bg-violet-100 text-violet-700 rounded-full">
                      Best Match
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {school.matchPercentage}% match
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {school.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">{renderStars(school.rating)}</div>
                  <span className="text-sm text-gray-600">
                    {school.rating} ({school.reviewCount} reviews)
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3">
                  {school.shortDescription}
                </p>

                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Why this school:</span>
                  <ul className="mt-1 space-y-1">
                    {school.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-sm text-violet-600 font-semibold">
                  CHF {school.priceRange.min} - {school.priceRange.max}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:min-w-[140px]">
                <Link
                  to={`/schools/${school.slug}`}
                  className="w-full text-center py-2 px-4 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors text-sm"
                >
                  View Details
                </Link>
                <button
                  onClick={() => toggleSchool(school.id)}
                  disabled={!canSelect}
                  className={`w-full py-2 px-4 rounded-lg text-sm transition-colors ${
                    selected
                      ? "bg-violet-100 text-violet-700 border border-violet-300"
                      : canSelect
                      ? "bg-gray-100 text-gray-700 hover:bg-violet-50"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {selected ? "Remove" : "Compare"}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {selectedSchools.length >= 2 && (
        <div className="text-center pt-4">
          <Link
            to="/compare"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Compare {selectedSchools.length} Schools
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecommendationList;
