import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useDisptachFilters } from "../../contexts/CoursesContext.js";
import { useComparison } from "../../contexts/ComparisonContext.jsx";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { dispatchSearch } = useDisptachFilters();
  const { selectedSchools } = useComparison();
  const location = useLocation();

  const handleOnChange = (ev) => {
    dispatchSearch({
      type: "SEARCH_COURSES",
      payload: { search: ev.target.value },
    });
  };

  const navLinks = [
    { to: "/", label: "Courses" },
    { to: "/schools", label: "Schools" },
    { to: "/compare", label: "Compare", badge: selectedSchools.length || null },
    { to: "/wizard", label: "Find Course" },
  ];

  const showSearch = location.pathname === "/";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.0"
                stroke="violet"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>
              <span className="font-bold text-violet-600 hidden sm:block">
                Basel German
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                      isActive
                        ? "bg-violet-100 text-violet-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  {link.label}
                  {link.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 text-white text-xs rounded-full flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <input
                type="search"
                name="courses"
                id="courses"
                className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Search courses..."
                onChange={handleOnChange}
              />
            </div>
          )}

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {showSearch && (
              <div className="mb-4">
                <input
                  type="search"
                  name="courses-mobile"
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Search courses..."
                  onChange={handleOnChange}
                />
              </div>
            )}
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-violet-100 text-violet-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  {link.label}
                  {link.badge && (
                    <span className="w-5 h-5 bg-violet-500 text-white text-xs rounded-full flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
