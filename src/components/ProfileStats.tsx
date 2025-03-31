import React, { useState, useEffect } from "react";
import axios from "axios";

interface UserStats {
  materialsUploaded: number;
  discussionsStarted: number;
  repliesPosted: number;
  totalDownloads: number;
  averageRating: number;
}

const ProfileStats: React.FC = () => {
  const [stats, setStats] = useState<UserStats>({
    materialsUploaded: 0,
    discussionsStarted: 0,
    repliesPosted: 0,
    totalDownloads: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/stats");
      setStats(response.data);
    } catch (error) {
      setError("Error fetching user statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading stats...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Statistics</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-700">Materials Uploaded</div>
            <div className="mt-1 text-2xl font-semibold text-blue-900">{stats.materialsUploaded}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-700">Discussions Started</div>
            <div className="mt-1 text-2xl font-semibold text-green-900">{stats.discussionsStarted}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-yellow-700">Replies Posted</div>
            <div className="mt-1 text-2xl font-semibold text-yellow-900">{stats.repliesPosted}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-purple-700">Total Downloads</div>
            <div className="mt-1 text-2xl font-semibold text-purple-900">{stats.totalDownloads}</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-indigo-700">Average Rating</div>
            <div className="mt-1 text-2xl font-semibold text-indigo-900">
              {stats.averageRating.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
