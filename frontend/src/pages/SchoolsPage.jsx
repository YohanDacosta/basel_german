import { SchoolCard } from "../components/schools/index.jsx";
import useSchools from "../hooks/useSchools.jsx";

const SchoolsPage = () => {
  const { schools, loading, error } = useSchools();

  return (
    <main className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          German Language Schools in Basel
        </h1>
        <p className="text-gray-600">
          Compare schools, read reviews, and find the perfect fit for your learning goals.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          <span className="ml-3 text-gray-600">Loading schools...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Failed to load schools: {error}</p>
          <p className="text-sm text-gray-500 mt-2">The data could not be loaded. Please try again later.</p>
        </div>
      ) : schools.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No schools found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      )}
    </main>
  );
};

export default SchoolsPage;
