import { useState } from "react";
import { submitReview } from "../../services/api";

const ReviewForm = ({ schoolId, schoolName, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rating: 5,
    comment: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim() || formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.comment.trim() || formData.comment.length < 10) {
      newErrors.comment = "Review must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await submitReview({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        rating: formData.rating,
        comment: formData.comment,
        schoolId: schoolId,
      });

      onSuccess(formData.email);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className="focus:outline-none"
          >
            <svg
              className={`w-8 h-8 ${
                star <= formData.rating ? "text-yellow-400" : "text-gray-300"
              } fill-current cursor-pointer hover:text-yellow-400 transition-colors`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Write a Review for {schoolName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                We'll send a verification link to this email
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              {renderStars()}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review *
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                  errors.comment ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Share your experience with this school..."
              />
              {errors.comment && (
                <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
