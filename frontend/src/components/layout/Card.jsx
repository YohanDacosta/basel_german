import { Link } from "react-router-dom";
import { school_icon } from "../../assets/index.jsx";

const Card = ({ course }) => {
  if (!course) return null;

  const schoolSlug = course.schoolSlug || course.school?.toLowerCase() || '';

  return (
    <article className="group relative rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-violet-200 hover:shadow-md md:p-5">
      <div className="flex min-w-0 items-start gap-3 md:gap-4">
        {/* Avatar */}
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-violet-50 md:size-14">
          <img
            src={school_icon}
            alt={course.school}
            className="size-6 object-contain md:size-8"
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* Title + Price */}
          <div className="flex items-baseline gap-2">
            <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-gray-800 md:text-lg">
              {course.name}
            </h3>
            <span className="shrink-0 text-base font-bold tabular-nums text-violet-600 md:text-lg">
              {course.price}
            </span>
          </div>

          {/* Description */}
          {course.description && (
            <p className="mt-0.5 truncate text-sm text-gray-500">
              {course.description}
            </p>
          )}

          {/* School + Level badges */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Link
              to={`/schools/${schoolSlug}`}
              className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-200"
            >
              {course.school}
            </Link>
            {course.level.map((lvl) => (
              <span
                key={lvl}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase text-gray-600"
              >
                {lvl}
              </span>
            ))}
          </div>

          {/* Meta info */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {course.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.duration_course}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {course.lessons}
            </span>
            {course.registration_deadline && (
              <span className="inline-flex items-center gap-1 font-medium text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {course.registration_deadline}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-3 text-sm">
            {course.link && (
              <a
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-green-600 transition-colors hover:text-green-800"
              >
                Course details
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            <Link
              to={`/schools/${schoolSlug}`}
              className="inline-flex items-center gap-1 font-medium text-violet-600 transition-colors hover:text-violet-800"
            >
              View school
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
