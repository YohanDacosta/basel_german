const ProsCons = ({ pros, cons }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Pros & Cons</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-green-700 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pros
          </h3>
          <ul className="space-y-2">
            {pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-semibold text-red-700 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cons
          </h3>
          <ul className="space-y-2">
            {cons.map((con, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProsCons;
