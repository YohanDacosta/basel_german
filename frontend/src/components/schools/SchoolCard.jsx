import { Link } from "react-router-dom";
import { useComparison } from "../../contexts/ComparisonContext.jsx";
import { school_icon } from "../../assets/index.jsx";

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
    <div className="group flex flex-col rounded-2xl bg-white p-5 shadow-[0_12px_50px_rgba(17,17,17,0.08)] transition-shadow hover:shadow-[0_12px_50px_rgba(17,17,17,0.14)]">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-50">
          <img src={school_icon} alt={school.name} className="size-7 object-contain" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 truncate text-lg font-semibold text-gray-800">
              {school.name}
            </h3>
            <button
              onClick={() => toggleSchool(school.id)}
              disabled={!canSelect}
              className={`shrink-0 rounded-full p-2 transition-colors ${
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
          <p className="mt-0.5 truncate text-sm text-gray-500">{school.shortDescription}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center">
        {school.reviewCount > 0 ? (
          <>
            <div className="flex">{renderStars(school.rating)}</div>
            <span className="ml-2 text-sm text-gray-500">
              {school.rating} ({school.reviewCount} {school.reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </>
        ) : (
          <span className="text-sm italic text-gray-400">No reviews yet</span>
        )}
      </div>

      <div className="mt-3 rounded-xl bg-violet-50 px-3 py-2">
        <p className="text-xs text-gray-500">Price range</p>
        <p className="font-mono text-base font-semibold tracking-tight text-violet-600 tabular-nums">
          CHF {school.priceRange.min} - {school.priceRange.max}
        </p>
      </div>

      {(school.courseTypes?.length > 0 || school.levels?.length > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {school.courseTypes?.slice(0, 4).map((type) => (
            <span
              key={type}
              className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium capitalize text-violet-700"
            >
              {type.replace("_", " ")}
            </span>
          ))}
          {school.levels?.map((level) => (
            <span
              key={level}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase text-gray-600"
            >
              {level}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2 border-t border-gray-100 pt-4">
        <Link
          to={`/schools/${school.slug}`}
          className="block w-full rounded-xl bg-violet-500 py-2 text-center font-medium text-white transition-colors hover:bg-violet-600"
        >
          View Details
        </Link>
        <Link
          to={`/schools/${school.slug}?writeReview=true`}
          className="block w-full rounded-xl border border-violet-500 py-2 text-center font-medium text-violet-600 transition-colors hover:bg-violet-50"
        >
          Write a Review
        </Link>
      </div>
    </div>
  );
};

export default SchoolCard;
