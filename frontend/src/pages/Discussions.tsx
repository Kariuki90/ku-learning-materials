import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Discussion {
  _id: string;
  title: string;
  content: string;
  courseCode: string;
  author: {
    name: string;
  };
  replies: {
    author: {
      name: string;
    };
    content: string;
    createdAt: string;
  }[];
  likes: string[];
  createdAt: string;
}

const Discussions: React.FC = () => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    courseCode: "",
    search: ""
  });

  useEffect(() => {
    fetchDiscussions();
  }, [filters]);

  const fetchDiscussions = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(`http://localhost:5000/api/discussions?${queryParams}`);
      setDiscussions(response.data);
    } catch (error) {
      setError("Error fetching discussions");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discussion Forum</h1>
        {user && (
          <Link
            to="/discussions/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start New Discussion
          </Link>
        )}
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search discussions..."
            value={filters.search}
            onChange={handleFilterChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            type="text"
            name="courseCode"
            placeholder="Filter by course code"
            value={filters.courseCode}
            onChange={handleFilterChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <div key={discussion._id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600">{discussion.courseCode}</span>
                <span className="text-sm text-gray-500">
                  {new Date(discussion.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{discussion.title}</h2>
              <p className="text-gray-600 mb-4">{discussion.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">By {discussion.author.name}</span>
                  <span className="text-sm text-gray-500">
                    {discussion.replies.length} replies
                  </span>
                </div>
                <Link
                  to={`/discussions/${discussion._id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Discussion
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {discussions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No discussions found. Try adjusting your filters.
        </div>
      )}
    </div>
  );
};

export default Discussions;
