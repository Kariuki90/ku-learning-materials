import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialCard from "../components/MaterialCard";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";

interface Material {
  _id: string;
  title: string;
  description: string;
  courseCode: string;
  courseName: string;
  downloads: number;
  ratings: { rating: number }[];
  fileType: string;
  faculty: string;
  department: string;
  year: number;
  semester: number;
}

const Materials: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    faculty: "",
    department: "",
    courseCode: "",
    year: "",
    semester: "",
    search: ""
  });

  useEffect(() => {
    fetchMaterials();
  }, [filters]);

  const fetchMaterials = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(`http://localhost:5000/api/materials?${queryParams}`);
      setMaterials(response.data);
    } catch (error) {
      setError("Error fetching materials");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Learning Materials</h1>
        <SearchBar
          value={filters.search}
          onChange={(value) => handleFilterChange("search", value)}
          placeholder="Search materials by title, description, or course code..."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterPanel filters={filters} onChange={handleFilterChange} />
        </div>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <MaterialCard key={material._id} material={material} />
            ))}
          </div>

          {materials.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No materials found. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Materials;
