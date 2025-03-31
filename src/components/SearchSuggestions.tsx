import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface SearchResult {
  type: "material" | "discussion";
  id: string;
  title: string;
  courseCode?: string;
  author?: string;
}

interface SearchSuggestionsProps {
  query: string;
  onSelect: (result: SearchResult) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ query, onSelect }) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/search?q=${query}`);
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  if (!query || query.length < 2) return null;

  return (
    <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1">
      {loading ? (
        <div className="p-4 text-center text-gray-500">Searching...</div>
      ) : results.length > 0 ? (
        <ul className="py-1">
          {results.map((result) => (
            <li key={`${result.type}-${result.id}`}>
              <button
                onClick={() => onSelect(result)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{result.title}</div>
                    {result.courseCode && (
                      <div className="text-sm text-gray-500">{result.courseCode}</div>
                    )}
                    {result.author && (
                      <div className="text-sm text-gray-500">By {result.author}</div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{result.type}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-gray-500">No results found</div>
      )}
    </div>
  );
};

export default SearchSuggestions;
