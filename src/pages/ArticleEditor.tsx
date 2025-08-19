'use client'

import React, { useEffect, useState, useRef } from 'react';
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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArticlesService, CategoriesService, UsersService } from '../lib/api';
import { ImageUploadService } from '../lib/uploadService';

export default function ArticleEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = id !== 'new'
  const quillRef = useRef<ReactQuill>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    image: '',
    embeddedMedia: '',
    mediaType: 'image',
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

  // Simple Quill editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    },
    keyboard: {
      bindings: {
        tab: false
      }
    }
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'indent',
    'color', 'background',
    'align',
    'link', 'image', 'video',
    'blockquote', 'code-block'
  ];

  // Simple content change handler
  const handleContentChange = (content: string) => {
    handleInputChange('content', content);
  };

  // Simple auto-scroll function
  const handleAutoScroll = () => {
    setTimeout(() => {
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const editorElement = quill.root;
        if (editorElement) {
          editorElement.scrollTop = editorElement.scrollHeight;
        }
      }
    }, 100);
  };

  // Simple form validation
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Article title is required');
      return false;
    }
    if (!formData.excerpt.trim()) {
      setError('Article excerpt is required');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Article content is required');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (!formData.author) {
      setError('Please select an author');
      return false;
    }
    return true;
  };

  // Simple save function
  const handleSave = async (status: 'draft' | 'published') => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      const articleData = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content,
        category_id: parseInt(formData.category),
        author_id: parseInt(formData.author),
        image: formData.image,
        embedded_media: formData.embeddedMedia,
        media_type: formData.mediaType,
        featured: formData.featured,
        status: status,
        tags: formData.tags.trim(),
        seo_title: formData.seoTitle.trim(),
        seo_description: formData.seoDescription.trim(),
        publish_date: formData.publishDate || null
      };
      
      let response;
      if (isEditing && id) {
        response = await ArticlesService.updateArticle(id, articleData);
      } else {
        response = await ArticlesService.createArticle(articleData);
      }
      
      if (response.error) {
        throw new Error(response.message || 'Failed to save article');
      }
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      navigate('/admin/articles');
      
    } catch (err: any) {
      setError('Error saving article: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  // Essential functions
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle media type change with mutual exclusivity
  const handleMediaTypeChange = (newMediaType: string) => {
    handleInputChange('mediaType', newMediaType);
    
    // Clear the other media when switching types
    if (newMediaType === 'image') {
      handleInputChange('embeddedMedia', '');
    } else {
      handleInputChange('image', '');
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    }
  };

  // Handle embedded media input with mutual exclusivity
  const handleEmbeddedMediaChange = (value: string) => {
    handleInputChange('embeddedMedia', value);
    
    // Clear image when embedded media is provided
    if (value && value.trim()) {
      handleInputChange('image', '');
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear embedded media when uploading image
    handleInputChange('embeddedMedia', '');
    handleInputChange('mediaType', 'image');

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
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(previewUrl);

    setImageUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const result = await ImageUploadService.uploadImage(file);

      if (!result.success) {
        throw new Error(result.message || 'Error uploading image');
      }

      const imageUrl = result.data?.fullUrl || result.data?.url;
      
      if (!imageUrl) {
        throw new Error('No image URL returned from server');
      }

      handleInputChange('image', imageUrl);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      
      event.target.value = '';
    } catch (err: any) {
      setError('Error uploading image: ' + err.message);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    } finally {
      setImageUploading(false);
    }
  };

  // Load data
  useEffect(() => {
    // Load categories
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await CategoriesService.getCategories();
        setCategories(response.data || []);
      } catch (err: any) {
        console.error('Error loading categories:', err);
        setError('Error loading categories: ' + err.message);
      } finally {
        setCategoriesLoading(false);
      }
    };

    // Load users (authors only)
    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        const response = await UsersService.getUsers({ role: 'author' });
        const usersData = response.data?.users || [];
        const authors = Array.isArray(usersData) ? usersData : [];
        setUsers(authors);
      } catch (err: any) {
        console.error('Error loading authors:', err);
        setError('Error loading authors: ' + err.message);
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
        const article = response.data || response;
        
        setFormData({
          title: article.title || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          category: article.category_id?.toString() || '',
          author: article.author_id?.toString() || '',
          image: article.image || '',
          embeddedMedia: article.embedded_media || '',
          mediaType: article.media_type || 'image',
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
  }, [isEditing, id]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Custom link handler to open links in new tab
  const handleLinkClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      e.preventDefault();
      window.open(target.getAttribute('href'), '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEditing ? 'Update your article content and settings' : 'Write and publish your article'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Eye size={20} />
            <span>{showPreview ? 'Hide Preview' : 'Preview'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-admin-accent text-white rounded-lg hover:bg-admin-accent-hover transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            <span>{isSaving ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Please fix the following errors:
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <pre className="whitespace-pre-wrap font-sans">{error}</pre>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Article saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}

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

          {/* Media Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Media Type
            </label>
            <div className="space-y-4">
              {/* Media Type Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'image', label: 'Image', icon: '🖼️' },
                  { value: 'spotify', label: 'Spotify', icon: '🎵' },
                  { value: 'youtube', label: 'YouTube', icon: '📺' },
                  { value: 'soundcloud', label: 'SoundCloud', icon: '🎧' }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleMediaTypeChange(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.mediaType === type.value
                        ? 'border-admin-accent bg-admin-accent/10 text-admin-accent'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>

              {/* Media Input */}
              {formData.mediaType === 'image' ? (
                <div className="space-y-4">
                  {formData.image || imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || formData.image}
                        alt="Featured"
                        className="w-full h-64 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('Image failed to load:', imagePreview || formData.image);
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
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {formData.mediaType === 'spotify' ? 'Spotify Track URL' :
                       formData.mediaType === 'youtube' ? 'YouTube Video URL' :
                       'SoundCloud Track URL'}
                    </label>
                    <input
                      type="url"
                      value={formData.embeddedMedia}
                      onChange={(e) => handleEmbeddedMediaChange(e.target.value)}
                      placeholder={
                        formData.mediaType === 'spotify' ? 'https://open.spotify.com/track/...' :
                        formData.mediaType === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                        'https://soundcloud.com/artist/track-name'
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                    />
                  </div>
                  
                  {/* Media Preview */}
                  {formData.embeddedMedia && (
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preview
                      </h4>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        {formData.mediaType === 'spotify' && formData.embeddedMedia.includes('spotify.com') ? (
                          <iframe 
                            style={{borderRadius: '12px'}} 
                            src={`https://open.spotify.com/embed/track/${formData.embeddedMedia.split('/track/')[1]?.split('?')[0]}`}
                            width="100%" 
                            height="152" 
                            frameBorder="0" 
                            allowFullScreen 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy"
                          />
                        ) : formData.mediaType === 'youtube' && formData.embeddedMedia.includes('youtube.com') ? (
                          <iframe 
                            width="100%" 
                            height="200" 
                            src={`https://www.youtube.com/embed/${formData.embeddedMedia.split('v=')[1]?.split('&')[0]}`}
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          />
                        ) : formData.mediaType === 'soundcloud' && formData.embeddedMedia.includes('soundcloud.com') ? (
                          <iframe 
                            width="100%" 
                            height="166" 
                            scrolling="no" 
                            frameBorder="no" 
                            allow="autoplay" 
                            src={`https://w.soundcloud.com/player/?url=https://${formData.embeddedMedia.replace('https://', '').replace('http://', '')}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                          />
                        ) : (
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formData.mediaType === 'spotify' ? '🎵 Spotify track will be embedded here' :
                               formData.mediaType === 'youtube' ? '📺 YouTube video will be embedded here' :
                               '🎧 SoundCloud track will be embedded here'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formData.embeddedMedia}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formData.mediaType === 'spotify' ? 'Paste a Spotify track URL (e.g., https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh)' :
                     formData.mediaType === 'youtube' ? 'Paste a YouTube video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)' :
                     'Paste a SoundCloud track URL (e.g., https://soundcloud.com/artist/track-name)'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Content Editor - WYSIWYG */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Article Content
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write your article content here..."
                style={{ 
                  height: '400px',
                  backgroundColor: 'white'
                }}
                className="dark:bg-gray-700"
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Use the toolbar above to format your content. You can add links, images, videos, and apply various text formatting options.
                <br />
                <strong>Pro tip:</strong> Use the link button in the toolbar to add clickable links to your content.
              </div>
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
                      <option key={user.id} value={user.id}>{user.name}</option>
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
              <article className="prose prose-lg max-w-none dark:prose-invert">
                <h1>{formData.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{formData.excerpt}</p>
                <div 
                  className="article-content prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                  onClick={handleLinkClick}
                />
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 