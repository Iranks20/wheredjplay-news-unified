import React, { useState, useEffect } from 'react';
import { CategoriesService } from '../lib/api';

export default function CategoriesTest() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing categories API...');
      const response = await CategoriesService.getCategories();
      console.log('Categories API response:', response);
      
      if (response.error) {
        throw new Error(response.message || 'API returned error');
      }
      
      setCategories(response.data || []);
      console.log('Categories loaded successfully:', response.data);
    } catch (err: any) {
      console.error('Categories API error:', err);
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Categories API Test</h3>
      
      <button 
        onClick={loadCategories}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Reload Categories'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Categories ({categories.length}):</h4>
        {categories.length > 0 ? (
          <ul className="space-y-1">
            {categories.map((category: any) => (
              <li key={category.id} className="p-2 bg-gray-100 rounded">
                {category.name} (ID: {category.id})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No categories found</p>
        )}
      </div>
    </div>
  );
}

