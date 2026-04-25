import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import useSchools from "../hooks/useSchools.jsx";
import {
  SchoolInfo,
  SchoolCourseList,
  ProsCons,
  SchoolReviews,
} from "../components/schools/index.jsx";

const SchoolDetailPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getSchoolBySlug, getCoursesForSchool, getReviewsForSchool } = useSchools();

  const [school, setSchool] = useState(null);
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(
    searchParams.get("writeReview") === "true"
  );

  useEffect(() => {
    if (searchParams.get("writeReview")) {
      setSearchParams({}, { replace: true });
    }
  }, []);

  const loadReviews = async () => {
    const reviewsData = await getReviewsForSchool(slug);
    setReviews(reviewsData);
  };

  useEffect(() => {
    const loadSchoolData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [schoolData, coursesData, reviewsData] = await Promise.all([
          getSchoolBySlug(slug),
          getCoursesForSchool(slug),
          getReviewsForSchool(slug)
        ]);

        setSchool(schoolData);
        setCourses(coursesData);
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSchoolData();
  }, [slug, getSchoolBySlug, getCoursesForSchool, getReviewsForSchool]);

  if (loading) {
    return (
      <main className="px-4 py-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          <span className="ml-3 text-gray-600">Loading school...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Failed to load school: {error}</p>
          <Link
            to="/schools"
            className="text-violet-600 hover:text-violet-800 underline mt-4 inline-block"
          >
            Back to Schools
          </Link>
        </div>
      </main>
    );
  }

  if (!school) {
    return (
      <main className="px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            School not found
          </h1>
          <Link
            to="/schools"
            className="text-violet-600 hover:text-violet-800 underline"
          >
            Back to Schools
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-6">
      <Link
        to="/schools"
        className="inline-flex items-center text-violet-600 hover:text-violet-800 mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Schools
      </Link>

      <div className="space-y-8">
        <SchoolInfo school={school} />
        <ProsCons pros={school.pros} cons={school.cons} />
        <SchoolCourseList courses={courses} />
        <SchoolReviews
          reviews={reviews}
          schoolId={school.id}
          schoolName={school.name}
          onReviewSubmitted={loadReviews}
          showForm={showReviewForm}
          setShowForm={setShowReviewForm}
        />
      </div>
    </main>
  );
};

export default SchoolDetailPage;
