'use client'

import React, { useEffect, useState, useRef } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  Eye,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { CategoriesService } from '../lib/api';
import { toast } from 'sonner';

export default function Categories() {
  const { data: categories, loading, error, execute } = useApi();
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    execute(() => CategoriesService.getCategories());
  }, [execute]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = async (categoryId: number) => {
    try {
      console.log('Deleting category:', categoryId);
      
      const response = await CategoriesService.deleteCategory(categoryId);
      console.log('Delete category response:', response);
      
      // Refresh the categories list
      await execute(() => CategoriesService.getCategories());
      console.log('Categories refreshed successfully');
      toast.success('Category deleted successfully');
      setShowDeleteModal(null);
    } catch (error: any) {
      console.error('Error deleting category:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error deleting category: ${errorMessage}`);
    }
  };

  const toggleDropdown = (categoryId: number) => {
    setOpenDropdown(openDropdown === categoryId ? null : categoryId);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && !categories) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Loading categories...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Error loading categories
            </p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const categoriesList = categories || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize your articles with categories
          </p>
        </div>
        <Link
          to="/admin/categories/new"
          className="flex items-center space-x-2 bg-admin-accent text-white px-4 py-2 rounded-lg hover:bg-admin-accent-hover transition-colors"
        >
          <Plus size={16} />
          <span>New Category</span>
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesList.length > 0 ? (
          categoriesList.map((category: any) => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                  </div>
                  
                  {category.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <FileText size={14} />
                      <span>{category.article_count || 0} articles</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span>{category.total_views?.toLocaleString() || '0'} views</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 mt-3 text-xs text-gray-400">
                    <Calendar size={12} />
                    <span>Created {formatDate(category.created_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative">
                  <button 
                    onClick={() => toggleDropdown(category.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
                  {openDropdown === category.id && (
                    <div 
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                    >
                      <Link
                        to={`/admin/categories/edit/${category.id}`}
                        onClick={closeDropdown}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleDelete(category.id);
                          closeDropdown();
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create your first category to organize your articles
              </p>
              <Link
                to="/admin/categories/new"
                className="inline-flex items-center space-x-2 bg-admin-accent text-white px-4 py-2 rounded-lg hover:bg-admin-accent-hover transition-colors"
              >
                <Plus size={16} />
                <span>Create Category</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Category
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 