import { Link } from "react-router-dom";
import { useComparison } from "../../contexts/ComparisonContext.jsx";

const SchoolCard = ({ school }) => {
  const { isSelected, toggleSchool, selectedSchools } = useComparison();
  const selected = isSelected(school.id);
  const canSelect = selectedSchools.length < 3 || selected;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-${school.id}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill={`url(#half-${school.id})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{school.name}</h3>
        <button
          onClick={() => toggleSchool(school.id)}
          disabled={!canSelect}
          className={`p-2 rounded-full transition-colors ${
            selected
              ? "bg-violet-100 text-violet-600"
              : canSelect
              ? "bg-gray-100 text-gray-400 hover:bg-violet-50 hover:text-violet-500"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
          title={selected ? "Remove from comparison" : "Add to comparison"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">{school.shortDescription}</p>

      <div className="flex items-center mb-3">
        {school.reviewCount > 0 ? (
          <>
            <div className="flex">{renderStars(school.rating)}</div>
            <span className="ml-2 text-sm text-gray-600">
              {school.rating} ({school.reviewCount} {school.reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </>
        ) : (
          <span className="text-sm text-gray-400 italic">No reviews yet</span>
        )}
      </div>

      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700">Price range: </span>
        <span className="text-sm text-violet-600 font-semibold">
          CHF {school.priceRange.min} - {school.priceRange.max}
        </span>
      </div>

      {school.courseTypes?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {school.courseTypes.slice(0, 4).map((type) => (
            <span
              key={type}
              className="px-2 py-1 text-xs bg-violet-100 text-violet-700 rounded-full capitalize"
            >
              {type.replace("_", " ")}
            </span>
          ))}
        </div>
      )}

      {school.levels?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {school.levels.map((level) => (
            <span
              key={level}
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded uppercase"
            >
              {level}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2">
        <Link
          to={`/schools/${school.slug}`}
          className="block w-full text-center py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
        >
          View Details
        </Link>
        <Link
          to={`/schools/${school.slug}?writeReview=true`}
          className="block w-full text-center py-2 border border-violet-500 text-violet-600 rounded-lg hover:bg-violet-50 transition-colors"
        >
          Write a Review
        </Link>
      </div>
    </div>
  );
};

export default SchoolCard;
