import { Link } from "react-router-dom";

const NoCourses = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 mx-auto text-gray-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        No courses found
      </h3>
      <p className="text-gray-500 mb-4">
        Try adjusting your filters or search criteria
      </p>
      <Link
        to="/wizard"
        className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Get Personalized Recommendations
      </Link>
    </div>
  );
};

export default NoCourses;
