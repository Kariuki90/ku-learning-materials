import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const WelcomeBanner: React.FC = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/first-visit");
        setShow(response.data.isFirstVisit);
      } catch (error) {
        console.error("Error checking first visit:", error);
      } finally {
        setLoading(false);
      }
    };

    checkFirstVisit();
  }, []);

  const handleDismiss = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/dismiss-welcome");
      setShow(false);
    } catch (error) {
      console.error("Error dismissing welcome banner:", error);
    }
  };

  if (loading || !show) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-blue-700">
            Welcome to Kenyatta University Learning Materials! Get started by exploring our{" "}
            <Link to="/materials" className="font-medium underline">learning materials</Link> or{" "}
            <Link to="/discussions" className="font-medium underline">joining discussions</Link>.
          </p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex space-x-4">
              <Link
                to="/upload"
                className="text-sm font-medium text-blue-700 hover:text-blue-600"
              >
                Upload Materials →
              </Link>
              <Link
                to="/discussions/create"
                className="text-sm font-medium text-blue-700 hover:text-blue-600"
              >
                Start Discussion →
              </Link>
            </div>
            <button
              onClick={handleDismiss}
              className="text-sm font-medium text-blue-700 hover:text-blue-600 focus:outline-none"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
