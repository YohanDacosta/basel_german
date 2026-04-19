import Card from "./Card.jsx";
import NoCourses from "../common/NoCourses.jsx";
import useFilteredCourses from "../../hooks/useFilteredCourses.jsx";
import { basel_img } from "../../assets/index.jsx";
import FilterBar from "./FilterBar.jsx";

const Main = () => {
  const { filtered, loading, error } = useFilteredCourses();

  return (
    <main className="flex flex-col px-2 sm:flex-row sm:px-0">
      <div className="flex-col w-full space-y-6 px-4 sm:px-0">
        {/*  */}
        <div className="flex flex-col space-y-4 bg-gray-100 p-4 md:flex-row md:h-[14rem] md:justify-center md:rounded-full md:p-0">
          <div className="flex flex-1">
            <div className="flex flex-col justify-center mx-auto space-y-1">
              <h1 className="text-lg font-semibold">
                Vergleichen Sie ganz einfach Deutschkurse in Basel
              </h1>
              <p className="text-md font-semibold text-gray-500">
                Wollen Sie Deutsch lernen?
              </p>
              <span className="text-xs font-semibold text-gray-400">
                "Wir aktualisieren die Daten für jede Schule."
              </span>
            </div>
          </div>
          <div className="flex">
            <img
              className="rounded-full shadow-lg shadow-green-100"
              src={basel_img}
              alt="basel_courses"
            />
          </div>
        </div>
        {/*  */}
        <div className="flex flex-col md:flex-row space-y-4">
          <FilterBar />
          <div className="flex flex-col space-y-4 w-full">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                <span className="ml-3 text-gray-600">Loading courses...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600">Failed to load courses: {error}</p>
                <p className="text-sm text-gray-500 mt-2">Please make sure the backend is running at http://localhost:8060</p>
              </div>
            ) : filtered.length <= 0 ? (
              <NoCourses />
            ) : (
              filtered.map((course) => <Card key={course.id} course={course} />)
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
