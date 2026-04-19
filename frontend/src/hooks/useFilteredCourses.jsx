import { useState, useEffect, useMemo } from "react";
import { useFilters } from "../contexts/CoursesContext.js";
import { fetchCourses, transformCourses } from "../services/api.js";

const filteredCourses = ({ courses, filters, search }) => {
  let filtered = courses.filter((course) => {
    const schoolChecked = filters.school[course.schoolSlug] || false;
    const levelChecked = course.level.some((level) => filters.level[level]);

    const hasSchoolFilters = Object.values(filters.school).some(
      (value) => value
    );
    const hasLevelFilters = Object.values(filters.level).some((value) => value);

    if (hasSchoolFilters && hasLevelFilters) {
      return schoolChecked && levelChecked;
    } else if (hasSchoolFilters) {
      return schoolChecked;
    } else if (hasLevelFilters) {
      return levelChecked;
    } else {
      return true;
    }
  });

  if (search.search) {
    filtered = filtered.filter((course) => {
      return course.name.toLowerCase().includes(search.search.toLowerCase());
    });
  }

  return filtered;
};

const parsePrice = (priceStr) => {
  if (!priceStr) return null;
  const match = priceStr.match(/[\d',.]+/);
  if (match) {
    return parseFloat(match[0].replace(/[',]/g, ''));
  }
  return null;
};

const useFilteredCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filters, search } = useFilters();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchCourses(1, 500);
        const transformed = transformCourses(result.data);
        setCourses(transformed);
      } catch (err) {
        setError(err.message);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filtered = useMemo(() => {
    return filteredCourses({ courses, filters, search });
  }, [courses, filters, search]);

  const stats = useMemo(() => {
    const schoolSlugs = new Set(courses.map((c) => c.schoolSlug).filter(Boolean));
    const prices = courses.map((c) => parsePrice(c.price)).filter((p) => p !== null && p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    return {
      totalCourses: courses.length,
      totalSchools: schoolSlugs.size,
      minPrice: minPrice,
    };
  }, [courses]);

  return { filtered, loading, error, stats, totalCourses: courses.length };
};

export default useFilteredCourses;
