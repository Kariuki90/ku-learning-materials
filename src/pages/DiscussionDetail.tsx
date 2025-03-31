import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Discussion {
  _id: string;
  title: string;
  content: string;
  courseCode: string;
  author: {
    _id: string;
    name: string;
  };
  replies: {
    _id: string;
    author: {
      _id: string;
      name: string;
    };
    content: string;
    createdAt: string;
    likes: string[];
  }[];
  likes: string[];
  createdAt: string;
}

const DiscussionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/discussions/${id}`);
      setDiscussion(response.data);
    } catch (error) {
      setError("Error fetching discussion");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    try {
      await axios.post(`http://localhost:5000/api/discussions/${id}/replies`, {
        content: reply
      });
      setReply("");
      fetchDiscussion();
    } catch (error) {
      setError("Error adding reply");
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:5000/api/discussions/${id}/like`);
      fetchDiscussion();
    } catch (error) {
      setError("Error updating likes");
    }
  };

  const handleReplyLike = async (replyId: string) => {
    try {
      await axios.post(`http://localhost:5000/api/discussions/${id}/replies/${replyId}/like`);
      fetchDiscussion();
    } catch (error) {
      setError("Error updating reply likes");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!discussion) return <div className="text-center py-8">Discussion not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">{discussion.courseCode}</span>
            <span className="text-sm text-gray-500">
              {new Date(discussion.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{discussion.title}</h1>
          <p className="mt-2 text-gray-600">{discussion.content}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">By {discussion.author.name}</span>
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 ${
                  discussion.likes.includes(user?._id || "") ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{discussion.likes.length}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Replies</h2>
          {user && (
            <form onSubmit={handleReply} className="mb-6">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Add a reply..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
              <button
                type="submit"
                className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Post Reply
              </button>
            </form>
          )}

          <div className="space-y-4">
            {discussion.replies.map((reply) => (
              <div key={reply._id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{reply.author.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{reply.content}</p>
                <div className="mt-2">
                  <button
                    onClick={() => handleReplyLike(reply._id)}
                    className={`flex items-center space-x-1 ${
                      reply.likes.includes(user?._id || "") ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{reply.likes.length}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetail;
