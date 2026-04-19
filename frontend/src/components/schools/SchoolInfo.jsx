import { useComparison } from "../../contexts/ComparisonContext.jsx";

const SchoolInfo = ({ school }) => {
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
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-detail-${school.id}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill={`url(#half-detail-${school.id})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{school.name}</h1>
          <div className="flex items-center mb-4">
            {school.reviewCount > 0 ? (
              <>
                <div className="flex">{renderStars(school.rating)}</div>
                <span className="ml-2 text-gray-600">
                  {school.rating} ({school.reviewCount} {school.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </>
            ) : (
              <span className="text-gray-400 italic">No reviews yet</span>
            )}
          </div>
          <p className="text-gray-600 mb-4">{school.description}</p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => toggleSchool(school.id)}
            disabled={!canSelect}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              selected
                ? "bg-violet-100 text-violet-700 border border-violet-300"
                : canSelect
                ? "bg-violet-500 text-white hover:bg-violet-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            {selected ? "Remove from Compare" : "Add to Compare"}
          </button>

          {school.website && (
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit Website
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Price Range</h3>
            <p className="text-lg font-semibold text-violet-600">
              CHF {school.priceRange.min} - {school.priceRange.max}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Course Types</h3>
            <div className="flex flex-wrap gap-1">
              {school.courseTypes?.length > 0 ? (
                school.courseTypes.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 text-xs bg-violet-100 text-violet-700 rounded-full capitalize"
                  >
                    {type.replace("_", " ")}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400">Not specified</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Levels</h3>
            <div className="flex flex-wrap gap-1">
              {school.levels?.length > 0 ? (
                school.levels.map((level) => (
                  <span
                    key={level}
                    className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded uppercase"
                  >
                    {level}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400">All levels</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {(school.address || school.phone) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            {school.address && (
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{school.address}</span>
              </div>
            )}
            {school.phone && (
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{school.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolInfo;
