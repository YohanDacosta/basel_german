import { Link } from "react-router-dom";
import Card from "../components/layout/Card.jsx";
import NoCourses from "../components/common/NoCourses.jsx";
import useFilteredCourses from "../hooks/useFilteredCourses.jsx";
import FilterBar from "../components/layout/FilterBar.jsx";

const HomePage = () => {
  const { filtered, loading, error, stats } = useFilteredCourses();

  return (
    <main className="px-4 py-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg p-6 md:p-8 mb-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            Find Your Perfect German Course in Basel
          </h1>
          <p className="text-violet-100 mb-4">
            Compare {stats.totalCourses || '...'} courses from {stats.totalSchools || '...'} schools. Filter by level, school, and schedule to find the right fit.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/wizard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-violet-600 rounded-lg font-medium hover:bg-violet-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Get Recommendations
            </Link>
            <Link
              to="/schools"
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-400 text-white rounded-lg font-medium hover:bg-violet-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Browse Schools
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-violet-600">{stats.totalCourses || '...'}</p>
          <p className="text-sm text-gray-500">Courses</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-violet-600">{stats.totalSchools || '...'}</p>
          <p className="text-sm text-gray-500">Schools</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-violet-600">A1-C2</p>
          <p className="text-sm text-gray-500">All Levels</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-violet-600">
            {stats.minPrice ? `CHF ${stats.minPrice}` : '...'}
          </p>
          <p className="text-sm text-gray-500">Starting Price</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        <FilterBar />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Available Courses
            </h2>
            {!loading && !error && (
              <span className="text-sm text-gray-500">
                {filtered.length} courses found
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
              <span className="ml-3 text-gray-600">Loading courses...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">Failed to load courses: {error}</p>
              <p className="text-sm text-gray-500 mt-2">The data could not be loaded. Please try again later.</p>
            </div>
          ) : filtered.length <= 0 ? (
            <NoCourses />
          ) : (
            <div className="space-y-4">
              {filtered.map((course) => (
                <Card key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
