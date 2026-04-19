import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyReview } from "../services/api";

const VerifyReviewPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const verificationAttempted = useRef(false);

  useEffect(() => {
    const verify = async () => {
      // Prevent double execution in React StrictMode
      if (verificationAttempted.current) {
        return;
      }
      verificationAttempted.current = true;

      if (!token) {
        setStatus("error");
        setMessage("No verification token provided.");
        return;
      }

      try {
        const result = await verifyReview(token);
        setStatus("success");
        setMessage(result.message || "Your review has been verified successfully!");
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Failed to verify review.");
      }
    };

    verify();
  }, [token]);

  return (
    <main className="px-4 py-12">
      <div className="max-w-md mx-auto">
        {status === "loading" && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Verifying your review...
            </h1>
            <p className="text-gray-600">Please wait a moment.</p>
          </div>
        )}

        {status === "success" && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Review Verified!
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/schools"
              className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
            >
              Browse Schools
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
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
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                The verification link may have expired or already been used.
              </p>
              <Link
                to="/schools"
                className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
              >
                Browse Schools
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default VerifyReviewPage;
