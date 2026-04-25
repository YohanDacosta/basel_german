const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8060';

export const fetchCourses = async (page = 1, limit = 200) => {
  const response = await fetch(`${API_BASE_URL}/api/courses?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }

  const result = await response.json();
  return result;
};

export const searchCourses = async ({ name, levels, school, page = 1, limit = 200 }) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);

  if (name) params.append('name', name);
  if (school) params.append('school', school);
  if (levels && levels.length > 0) {
    levels.forEach(level => params.append('levels[]', level));
  }

  const response = await fetch(`${API_BASE_URL}/api/courses/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to search courses');
  }

  const result = await response.json();
  return result;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const transformCourse = (course) => {
  const dateStart = formatDate(course.date_start);
  const dateEnd = formatDate(course.date_end);
  const date = dateStart && dateEnd ? `${dateStart} - ${dateEnd}` : dateStart || dateEnd || '';

  return {
    id: course.id,
    name: course.name,
    school: course.school?.name || '',
    schoolSlug: course.school?.slug || '',
    level: course.levels || [],
    level_description: course.level_description || '',
    registration_deadline: formatDate(course.registration_deadline),
    duration_course: course.duration_course || '',
    date,
    price: course.price || '',
    lessons: course.lessons || '',
    link: course.link || '',
    description: course.description || ''
  };
};

export const transformCourses = (courses) => {
  return courses.map(transformCourse);
};

export const fetchSchools = async () => {
  const response = await fetch(`${API_BASE_URL}/api/schools`);

  if (!response.ok) {
    throw new Error('Failed to fetch schools');
  }

  const result = await response.json();
  return result;
};

export const fetchSchoolBySlug = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/api/schools/${slug}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch school');
  }

  const result = await response.json();
  return result;
};

export const fetchSchoolCourses = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/api/schools/${slug}/courses`);

  if (!response.ok) {
    throw new Error('Failed to fetch school courses');
  }

  const result = await response.json();
  return result;
};

export const fetchSchoolReviews = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/api/schools/${slug}/reviews`);

  if (!response.ok) {
    throw new Error('Failed to fetch school reviews');
  }

  const result = await response.json();
  return result;
};

export const transformReview = (review) => {
  const date = review.review_date
    ? new Date(review.review_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return {
    id: review.id,
    author: review.author,
    rating: review.rating,
    text: review.text,
    date
  };
};

export const transformReviews = (reviews) => {
  return reviews.map(transformReview);
};

export const transformSchool = (school) => {
  return {
    id: school.id,
    name: school.name,
    slug: school.slug,
    description: school.description || '',
    shortDescription: school.short_description || '',
    priceRange: {
      min: parseFloat(school.price_range_min) || 0,
      max: parseFloat(school.price_range_max) || 0
    },
    rating: parseFloat(school.rating) || 0,
    reviewCount: school.review_count || 0,
    courseTypes: school.course_types || [],
    levels: school.levels || [],
    schedule: school.schedule || [],
    features: school.features || [],
    pros: school.pros || [],
    cons: school.cons || [],
    address: school.address || '',
    website: school.website || '',
    phone: school.phone || ''
  };
};

export const transformSchools = (schools) => {
  return schools.map(transformSchool);
};

// Review API functions
export const submitReview = async (reviewData) => {
  const response = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to submit review');
  }

  return result;
};

export const verifyReview = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/reviews/verify?token=${token}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to verify review');
  }

  return result;
};

export const resendVerification = async (email, schoolId) => {
  const response = await fetch(`${API_BASE_URL}/api/reviews/resend-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, schoolId }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to resend verification');
  }

  return result;
};
