import { Link } from "react-router-dom";

const Card = ({ course }) => {
  if (!course) return null;

  const schoolSlug = course.schoolSlug || course.school?.toLowerCase() || '';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {course.name}
            </h3>
            <Link
              to={`/schools/${schoolSlug}`}
              className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 rounded-full hover:bg-violet-200 transition-colors"
            >
              {course.school}
            </Link>
          </div>

          {/* Level Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {course.level.map((lvl) => (
              <span
                key={lvl}
                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded uppercase font-medium"
              >
                {lvl}
              </span>
            ))}
          </div>

          {/* Description */}
          {course.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {course.description}
            </p>
          )}

          {/* Course Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <span className="text-gray-500 text-xs">Dates</span>
                <p className="text-gray-700">{course.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="text-gray-500 text-xs">Schedule</span>
                <p className="text-gray-700">{course.duration_course}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div>
                <span className="text-gray-500 text-xs">Lessons</span>
                <p className="text-gray-700">{course.lessons}</p>
              </div>
            </div>

            {course.registration_deadline && (
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <span className="text-gray-500 text-xs">Deadline</span>
                  <p className="text-orange-600 font-medium">{course.registration_deadline}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="flex flex-col items-end gap-2 md:min-w-[140px]">
          <div className="text-right">
            <span className="text-xs text-gray-500">Price</span>
            <p className="text-lg font-bold text-violet-600">{course.price}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {course.link && (
              <a
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
              >
                Course Details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            <Link
              to={`/schools/${schoolSlug}`}
              className="text-sm text-violet-600 hover:text-violet-800 flex items-center gap-1"
            >
              View School
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
