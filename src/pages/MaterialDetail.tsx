import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Material {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  faculty: string;
  department: string;
  courseCode: string;
  courseName: string;
  year: number;
  semester: number;
  downloads: number;
  ratings: {
    userId: string;
    rating: number;
  }[];
  comments: {
    userId: string;
    text: string;
    createdAt: string;
  }[];
  uploadedBy: {
    name: string;
  };
}

const MaterialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetchMaterial();
  }, [id]);

  const fetchMaterial = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/materials/${id}`);
      setMaterial(response.data);
    } catch (error) {
      setError("Error fetching material");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await axios.post(`http://localhost:5000/api/materials/${id}/download`);
      window.open(material?.fileUrl, "_blank");
      fetchMaterial(); // Refresh to update download count
    } catch (error) {
      setError("Error downloading material");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await axios.post(`http://localhost:5000/api/materials/${id}/comments`, {
        text: comment
      });
      setComment("");
      fetchMaterial();
    } catch (error) {
      setError("Error adding comment");
    }
  };

  const handleRating = async (value: number) => {
    try {
      await axios.post(`http://localhost:5000/api/materials/${id}/rate`, {
        rating: value
      });
      setRating(value);
      fetchMaterial();
    } catch (error) {
      setError("Error rating material");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!material) return <div className="text-center py-8">Material not found</div>;

  const averageRating = material.ratings.length
    ? material.ratings.reduce((acc, curr) => acc + curr.rating, 0) / material.ratings.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">{material.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {material.courseCode} - {material.courseName}
          </p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Faculty</h3>
              <p className="mt-1 text-sm text-gray-900">{material.faculty}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Department</h3>
              <p className="mt-1 text-sm text-gray-900">{material.department}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Year</h3>
              <p className="mt-1 text-sm text-gray-900">{material.year}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Semester</h3>
              <p className="mt-1 text-sm text-gray-900">{material.semester}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="mt-1 text-sm text-gray-900">{material.description}</p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-sm text-gray-900">{averageRating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Downloads:</span>
              <span className="ml-1 text-sm text-gray-900">{material.downloads}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Download Material
          </button>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Comments</h3>
          {user && (
            <form onSubmit={handleComment} className="mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
              <button
                type="submit"
                className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Post Comment
              </button>
            </form>
          )}

          <div className="space-y-4">
            {material.comments.map((comment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900">{comment.text}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetail;
