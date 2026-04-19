const SchoolCourseList = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Available Courses</h2>
        <p className="text-gray-500">No courses available at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Available Courses ({courses.length})
      </h2>

      <div className="space-y-4">
        {courses.slice(0, 10).map((course) => (
          <div
            key={course.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-violet-300 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{course.name}</h3>
                <p className="text-sm text-gray-500">{course.level_description}</p>
                {course.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                )}
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <span className="font-semibold text-violet-600">{course.price}</span>
                {course.link && (
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    More info
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{course.date}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{course.duration_course}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{course.lessons}</span>
              </div>

              {course.registration_deadline && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Deadline: {course.registration_deadline}</span>
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {course.level.map((lvl) => (
                <span
                  key={lvl}
                  className="px-2 py-0.5 text-xs bg-violet-100 text-violet-700 rounded uppercase"
                >
                  {lvl}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {courses.length > 10 && (
        <p className="mt-4 text-center text-sm text-gray-500">
          Showing 10 of {courses.length} courses
        </p>
      )}
    </div>
  );
};

export default SchoolCourseList;
