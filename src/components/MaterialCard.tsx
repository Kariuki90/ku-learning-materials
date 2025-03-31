import React from "react";
import { Link } from "react-router-dom";

interface MaterialCardProps {
  material: {
    _id: string;
    title: string;
    description: string;
    courseCode: string;
    courseName: string;
    downloads: number;
    ratings: { rating: number }[];
    fileType: string;
  };
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const averageRating = material.ratings.length
    ? material.ratings.reduce((acc, curr) => acc + curr.rating, 0) / material.ratings.length
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-600">{material.courseCode}</span>
          <span className="text-sm text-gray-500">{material.fileType}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{material.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600">{averageRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Downloads:</span>
            <span className="text-sm font-medium text-gray-900">{material.downloads}</span>
          </div>
        </div>
        <Link
          to={`/materials/${material._id}`}
          className="mt-4 block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MaterialCard;
