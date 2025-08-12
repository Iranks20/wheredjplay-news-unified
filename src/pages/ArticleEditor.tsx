'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  Image as ImageIcon,
  Upload,
  X,
  Settings,
  Globe,
  Tag
} from 'lucide-react'
import { ArticlesService, CategoriesService, UsersService } from '../lib/api';
import { ImageUploadService } from '../lib/uploadService';

export default function ArticleEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = id !== 'new'
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    image: '',
    featured: false,
    status: 'draft',
    tags: '',
    seoTitle: '',
    seoDescription: '',
    publishDate: ''
  })

  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Categories and users state
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Load categories, users and article data
  useEffect(() => {
    // Load categories
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await CategoriesService.getCategories();
        setCategories(response.data || []);
        console.log('Categories loaded:', response.data);
      } catch (err: any) {
        console.error('Error loading categories:', err);
        setError('Error loading categories: ' + err.message);
      } finally {
        setCategoriesLoading(false);
      }
    };

    // Load users
    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        const response = await UsersService.getUsers();
        // Handle both direct array and paginated response
        const usersData = response.data?.data || response.data || [];
        setUsers(Array.isArray(usersData) ? usersData : []);
        console.log('Users loaded:', usersData);
      } catch (err: any) {
        console.error('Error loading users:', err);
        setError('Error loading users: ' + err.message);
      } finally {
        setUsersLoading(false);
      }
    };

    loadCategories();
    loadUsers();
  }, []);

  // Load article data if editing
  useEffect(() => {
    if (isEditing && id) {
      ArticlesService.getArticle(id).then(response => {
        console.log('Article API response:', response);
        const article = response.data || response;
        console.log('Article data:', article);
        
        setFormData({
          title: article.title || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          category: article.category_id?.toString() || '',
          author: article.author_id?.toString() || '',
          image: article.image || '',
          featured: article.featured || false,
          status: article.status || 'draft',
          tags: article.tags || '',
          seoTitle: article.seo_title || '',
          seoDescription: article.seo_description || '',
          publishDate: article.publish_date ? new Date(article.publish_date).toISOString().slice(0, 16) : ''
        });
      }).catch(err => {
        console.error('Error loading article:', err);
        setError('Error loading article: ' + err.message);
      });
    }
  }, [isEditing, id])

  // Cleanup object URLs on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Image file size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    // Revoke previous preview URL if it exists
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(previewUrl);

    setImageUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      console.log('Starting image upload:', file.name, file.size, file.type);
      console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:3001');
      
      const result = await ImageUploadService.uploadImage(file);

      console.log('Upload result:', result);

      if (!result.success) {
        throw new Error(result.message || 'Error uploading image');
      }

      // Store the full URL in the form data
      const imageUrl = result.data?.fullUrl || result.data?.url;
      console.log('Upload successful! Image URL:', imageUrl);
      
      if (!imageUrl) {
        throw new Error('No image URL returned from server');
      }

      handleInputChange('image', imageUrl);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000); // Hide success message after 3 seconds
      
      // Clear the file input
      event.target.value = '';
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('Error uploading image: ' + err.message);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setIsSaving(true)
    setError(null)
    
    try {
      // Validate required fields
      if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.author) {
        throw new Error('Please fill in all required fields including category and author');
      }

      const categoryId = parseInt(formData.category);
      if (isNaN(categoryId)) {
        throw new Error('Please select a valid category');
      }

      const authorId = parseInt(formData.author);
      if (isNaN(authorId)) {
        throw new Error('Please select a valid author');
      }

      const articleData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category_id: categoryId,
        author_id: authorId,
        featured: formData.featured,
        status: status,
        tags: formData.tags,
        seo_title: formData.seoTitle,
        seo_description: formData.seoDescription,
        image: formData.image || null,
        ...(status === 'published' && { publish_date: new Date().toISOString() })
      }

      let response;
      if (isEditing && id) {
        response = await ArticlesService.updateArticle(id, articleData);
      } else {
        response = await ArticlesService.createArticle(articleData);
      }

      if (response.error) {
        throw new Error(response.message || 'Error saving article');
      }

      // Navigate back to articles list on success
      navigate('/admin/articles');
    } catch (err: any) {
      setError(err.message || 'Error saving article');
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                Success
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                Image uploaded successfully!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Article' : 'New Article'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEditing ? 'Update your article content and settings' : 'Create a new article for your news platform'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-admin-accent text-white rounded-lg hover:bg-admin-accent-hover transition-colors disabled:opacity-50"
          >
            <Globe size={16} />
            <span>{isSaving ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Article Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter article title..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-admin-accent focus:border-transparent text-lg font-medium"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Write a brief excerpt for the article..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-admin-accent focus:border-transparent"
            />
          </div>

          {/* Featured Image */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured Image
            </label>
            <div className="space-y-4">
              {formData.image || imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || formData.image}
                    alt="Featured"
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      console.error('Image failed to load:', imagePreview || formData.image);
                      // Set a fallback image
                      e.currentTarget.src = 'https://via.placeholder.com/800x400/e5e7eb/6b7280?text=Image+Not+Found';
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', imagePreview || formData.image);
                    }}
                  />
                  <button
                    onClick={() => {
                      handleInputChange('image', '');
                      if (imagePreview) {
                        URL.revokeObjectURL(imagePreview);
                        setImagePreview(null);
                      }
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  {imagePreview && imageUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <p>Uploading...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">Upload featured image</p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={imageUploading}
                    />
                    <span className={`inline-flex items-center space-x-2 px-4 py-2 bg-admin-accent text-white rounded-lg transition-colors ${imageUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-admin-accent-hover cursor-pointer'}`}>
                      {imageUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>Choose Image</span>
                        </>
                      )}
                    </span>
                  </label>
                  {imageUploading && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Please wait while your image is being uploaded...
                    </p>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload a featured image for your article. Recommended size: 1200x630px. Max file size: 5MB.
              </p>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Article Content
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
              {/* Toolbar */}
              <div className="flex items-center space-x-1 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                  <strong>B</strong>
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                  <em>I</em>
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                  <u>U</u>
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                  H1
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                  H2
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                  H3
                </button>
              </div>
              
              {/* Editor */}
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your article content here..."
                rows={20}
                className="w-full p-4 border-none outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Settings size={20} />
              <span>Publishing</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Publish Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.publishDate}
                  onChange={(e) => handleInputChange('publishDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="rounded border-gray-300 text-admin-accent focus:ring-admin-accent"
                />
                <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">
                  Featured Article
                </label>
              </div>
            </div>
          </div>

          {/* Article Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Tag size={20} />
              <span>Article Details</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  disabled={categoriesLoading}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent disabled:opacity-50"
                >
                  <option value="">
                    {categoriesLoading ? 'Loading categories...' : 'Select Category'}
                  </option>
                  {categories.length > 0 ? (
                    categories.map((category: any) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))
                  ) : (
                    !categoriesLoading && (
                      <option value="" disabled>No categories available</option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  disabled={usersLoading}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent disabled:opacity-50"
                >
                  <option value="">
                    {usersLoading ? 'Loading authors...' : 'Select Author'}
                  </option>
                  {users.length > 0 ? (
                    users.map((user: any) => (
                      <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                    ))
                  ) : (
                    !usersLoading && (
                      <option value="" disabled>No authors available</option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Enter tags separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                />
              </div>


            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Globe size={20} />
              <span>SEO Settings</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  placeholder="Enter SEO title"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SEO Description
                </label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  placeholder="Enter SEO description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Article Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <article className="prose prose-lg max-w-none">
                <h1>{formData.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{formData.excerpt}</p>
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 