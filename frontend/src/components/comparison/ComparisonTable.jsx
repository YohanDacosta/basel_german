import { Link } from "react-router-dom";

const ComparisonTable = ({ schools }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i < fullStars ? "text-yellow-400" : "text-gray-300"} fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }
    return stars;
  };

  const rows = [
    {
      label: "Price Range",
      getValue: (school) => `CHF ${school.priceRange?.min || 0} - ${school.priceRange?.max || 0}`,
    },
    {
      label: "Rating",
      getValue: (school) => (
        <div className="flex items-center gap-1">
          <div className="flex">{renderStars(school.rating || 0)}</div>
          <span className="text-sm">({school.rating || 0})</span>
        </div>
      ),
    },
    {
      label: "Reviews",
      getValue: (school) => `${school.reviewCount || 0} reviews`,
    },
    {
      label: "Levels",
      getValue: (school) => (
        <div className="flex flex-wrap gap-1">
          {school.levels?.length > 0 ? (
            school.levels.map((level) => (
              <span key={level} className="px-1.5 py-0.5 text-xs bg-gray-100 rounded uppercase">
                {level}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">All levels</span>
          )}
        </div>
      ),
    },
    {
      label: "Course Types",
      getValue: (school) => (
        <div className="flex flex-wrap gap-1">
          {school.courseTypes?.length > 0 ? (
            school.courseTypes.map((type) => (
              <span key={type} className="px-1.5 py-0.5 text-xs bg-violet-100 text-violet-700 rounded capitalize">
                {type.replace("_", " ")}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </div>
      ),
    },
    {
      label: "Schedule",
      getValue: (school) => (
        <div className="flex flex-wrap gap-1">
          {school.schedule?.length > 0 ? (
            school.schedule.map((s) => (
              <span key={s} className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded capitalize">
                {s}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </div>
      ),
    },
    {
      label: "Pros",
      getValue: (school) => (
        <ul className="text-sm text-green-700 space-y-1">
          {school.pros?.length > 0 ? (
            school.pros.slice(0, 3).map((pro, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-green-500">+</span>
                {pro}
              </li>
            ))
          ) : (
            <li className="text-gray-400">-</li>
          )}
        </ul>
      ),
    },
    {
      label: "Cons",
      getValue: (school) => (
        <ul className="text-sm text-red-700 space-y-1">
          {school.cons?.length > 0 ? (
            school.cons.slice(0, 3).map((con, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-red-500">-</span>
                {con}
              </li>
            ))
          ) : (
            <li className="text-gray-400">-</li>
          )}
        </ul>
      ),
    },
    {
      label: "Contact",
      getValue: (school) => (
        <div className="text-sm space-y-1">
          <p className="text-gray-600">{school.phone || '-'}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-violet-50">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700 min-w-[120px]">
                Feature
              </th>
              {schools.map((school) => (
                <th key={school.id} className="text-left p-4 min-w-[200px]">
                  <Link
                    to={`/schools/${school.slug}`}
                    className="font-semibold text-violet-600 hover:text-violet-800"
                  >
                    {school.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.label} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="p-4 font-medium text-gray-700">{row.label}</td>
                {schools.map((school) => (
                  <td key={school.id} className="p-4 text-gray-600">
                    {row.getValue(school)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
