import { useState } from "react";
import ReviewForm from "./ReviewForm";

const SchoolReviews = ({ reviews, schoolId, schoolName }) => {
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"} fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }
    return stars;
  };

  const handleReviewSuccess = (email) => {
    setShowForm(false);
    setSuccessMessage(
      `Thank you! We've sent a verification link to ${email}. Please check your inbox to publish your review.`
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Reviews {reviews && reviews.length > 0 ? `(${reviews.length})` : ""}
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Write a Review
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex">
            <svg
              className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-green-800 text-sm">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-600 text-xs underline mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {!reviews || reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to write one!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                    <span className="text-violet-600 font-semibold">
                      {review.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{review.author}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              <p className="text-gray-600 ml-13">{review.text}</p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ReviewForm
          schoolId={schoolId}
          schoolName={schoolName}
          onClose={() => setShowForm(false)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default SchoolReviews;
