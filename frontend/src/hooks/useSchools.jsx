import { useState, useEffect, useCallback } from "react";
import {
  fetchSchools,
  fetchSchoolBySlug,
  fetchSchoolCourses,
  fetchSchoolReviews,
  transformSchools,
  transformSchool,
  transformCourses,
  transformReviews
} from "../services/api.js";

const useSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSchools = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchSchools();
        const transformed = transformSchools(result.data);
        setSchools(transformed);
      } catch (err) {
        setError(err.message);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
  }, []);

  const getSchoolBySlug = useCallback(async (slug) => {
    try {
      const result = await fetchSchoolBySlug(slug);
      if (!result || result.errors) {
        return null;
      }
      return transformSchool(result.data);
    } catch {
      return null;
    }
  }, []);

  const getCoursesForSchool = useCallback(async (schoolSlug) => {
    try {
      const result = await fetchSchoolCourses(schoolSlug);
      if (!result || result.errors) {
        return [];
      }
      return transformCourses(result.data);
    } catch {
      return [];
    }
  }, []);

  const getReviewsForSchool = useCallback(async (schoolSlug) => {
    try {
      const result = await fetchSchoolReviews(schoolSlug);
      if (!result || result.errors) {
        return [];
      }
      return transformReviews(result.data);
    } catch {
      return [];
    }
  }, []);

  const getSchoolsWithFilters = useCallback((filters) => {
    let filtered = schools;

    if (filters.level && filters.level.length > 0) {
      filtered = filtered.filter((school) =>
        filters.level.some((level) => school.levels?.includes(level))
      );
    }

    if (filters.schedule && filters.schedule.length > 0) {
      filtered = filtered.filter((school) =>
        filters.schedule.some((schedule) => school.schedule?.includes(schedule))
      );
    }

    if (filters.budget) {
      const { min, max } = filters.budget;
      filtered = filtered.filter(
        (school) =>
          school.priceRange?.min <= max && school.priceRange?.max >= min
      );
    }

    return filtered;
  }, [schools]);

  const getSchoolById = useCallback((id) => {
    return schools.find((school) => school.id === id) || null;
  }, [schools]);

  return {
    schools,
    loading,
    error,
    getSchoolBySlug,
    getSchoolById,
    getCoursesForSchool,
    getReviewsForSchool,
    getSchoolsWithFilters,
  };
};

export default useSchools;
