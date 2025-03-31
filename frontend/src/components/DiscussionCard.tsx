import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface DiscussionCardProps {
  discussion: {
    _id: string;
    title: string;
    content: string;
    courseCode: string;
    author: {
      _id: string;
      name: string;
    };
    replies: any[];
    likes: string[];
    createdAt: string;
  };
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({ discussion }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-600">{discussion.courseCode}</span>
          <span className="text-sm text-gray-500">
            {new Date(discussion.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Link to={`/discussions/${discussion._id}`} className="block">
          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
            {discussion.title}
          </h3>
        </Link>
        <p className="mt-2 text-gray-600 line-clamp-2">{discussion.content}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">By {discussion.author.name}</span>
            <div className="flex items-center space-x-1 text-gray-500">
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
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{discussion.replies.length}</span>
            </div>
          </div>
          <Link
            to={`/discussions/${discussion._id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DiscussionCard;
