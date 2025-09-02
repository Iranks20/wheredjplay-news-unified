'use client'

import React, { useEffect, useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Calendar,
  User,
  Star,
  StarOff,
  FileText,
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi, useApiWithPagination } from '../hooks/useApi';
import { ArticlesService, CategoriesService, UsersService } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { extractSpotifyTrackId, extractYouTubeVideoId, extractSoundCloudTrackPath, extractBeatportTrackId } from '../utils/mediaUtils';

export default function Articles() {
  const { data: articlesData, loading, error, execute, pagination } = useApiWithPagination();
  const { data: categories, execute: fetchCategories } = useApi();
  const { data: allAuthors, execute: fetchAuthors } = useApi();
  const { isAuthenticated, token, user } = useAuth();
  
  // Local state for authors (either all authors for admin or just current user)
  const [authors, setAuthors] = useState<any[]>([]);
  
  const [filters, setFilters] = useState({
    status: 'all',
    category: '',
    author: '',
    search: '',
    page: 1,
    limit: 10
  });

  const [showFilters, setShowFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to render media content for admin articles list
  const renderArticleMedia = (article: any) => {
    // Priority: embedded media over image
    if (article.embedded_media && article.media_type !== 'image') {
      switch (article.media_type) {
        case 'spotify': {
          const trackId = extractSpotifyTrackId(article.embedded_media);
          if (!trackId) return null;
          return (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <iframe 
                style={{borderRadius: '8px'}} 
                src={`https://open.spotify.com/embed/track/${trackId}`}
                width="100%" 
                height="80" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                className="w-full h-full"
              />
            </div>
          );
        }
        
        case 'youtube': {
          const videoId = extractYouTubeVideoId(article.embedded_media);
          if (!videoId) return null;
          return (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <iframe 
                width="100%" 
                height="80" 
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          );
        }
        
        case 'soundcloud': {
          const trackPath = extractSoundCloudTrackPath(article.embedded_media);
          console.log('🔍 Articles Admin SoundCloud - embedded_media:', article.embedded_media, 'trackPath:', trackPath);
          if (!trackPath) return null;
          const iframeSrc = `https://w.soundcloud.com/player/?url=https://${trackPath}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&buying=false&liking=false&download=false&sharing=false&show_artwork=true&show_playcount=true&show_user=true&hide_related=false&visual=true&start_track=0`;
          console.log('🔍 Articles Admin SoundCloud - iframeSrc:', iframeSrc);
          return (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <iframe 
                width="100%" 
                height="80" 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay" 
                src={iframeSrc}
                className="w-full h-full"
                onError={(e) => {
                  console.error('SoundCloud iframe failed to load:', iframeSrc);
                  console.error('Error event:', e);
                }}
                onLoad={() => {
                  console.log('SoundCloud iframe loaded successfully:', iframeSrc);
                }}
              />
            </div>
          );
        }
        
        case 'beatport': {
          const trackId = extractBeatportTrackId(article.embedded_media);
          console.log('🔍 Articles Admin Beatport - embedded_media:', article.embedded_media, 'trackId:', trackId);
          if (!trackId) return null;
          const iframeSrc = `https://embed.beatport.com/track/${trackId}?color=ff5500&bgcolor=000000&autoplay=false&show_artwork=true&show_playcount=true&show_user=true&hide_related=false&visual=true&start_track=0`;
          console.log('🔍 Articles Admin Beatport - iframeSrc:', iframeSrc);
          return (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <iframe 
                width="100%" 
                height="80" 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay" 
                src={iframeSrc}
                className="w-full h-full"
                onError={(e) => {
                  console.error('Beatport iframe failed to load:', iframeSrc);
                  console.error('Error event:', e);
                }}
                onLoad={() => {
                  console.log('Beatport iframe loaded successfully:', iframeSrc);
                }}
              />
            </div>
          );
        }
        
        default:
          return null;
      }
    }

    // Fallback to image if no embedded media
    if (article.image) {
      return (
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
      );
    }

    // Fallback to placeholder
    return (
      <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
        <FileText size={20} className="text-gray-400" />
      </div>
    );
  };

  useEffect(() => {
    // Debug authentication state
    console.log('Auth state:', { isAuthenticated, token: token ? 'present' : 'missing', user });
    
    // Test API connectivity
    const testApiConnection = async () => {
      try {
        console.log('Testing API connection...');
        
        // Test health endpoint
        const healthResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://13.60.95.22:3001'}/health`);
        console.log('API health check response:', healthResponse.status, healthResponse.ok);
        
        // Test articles endpoint without auth
        const articlesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://13.60.95.22:3001'}/api/v1/articles`);
        console.log('Articles endpoint response:', articlesResponse.status, articlesResponse.ok);
        
        // Test articles endpoint with auth
        if (token) {
          const authArticlesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://13.60.95.22:3001'}/api/v1/articles`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Authenticated articles response:', authArticlesResponse.status, authArticlesResponse.ok);
        } else {
          console.log('No auth token available');
        }
        
      } catch (error) {
        console.error('API health check failed:', error);
      }
    };
    
    testApiConnection();
    fetchCategories(() => CategoriesService.getCategories());
    // Only fetch all authors if user is admin, otherwise use current user
    if (user?.role === 'admin') {
      fetchAuthors(() => UsersService.getAuthors());
    } else {
      // For non-admin users, set themselves as the only author option
      setAuthors([user]);
    }
  }, [fetchCategories, fetchAuthors, isAuthenticated, token, user]);

  // Update authors when allAuthors data changes (for admin users)
  useEffect(() => {
    if (user?.role === 'admin' && allAuthors?.users) {
      setAuthors(allAuthors.users);
    }
  }, [allAuthors, user?.role]);

  useEffect(() => {
    execute(() => ArticlesService.getArticles(filters));
  }, [execute, filters]);

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

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleStatusChange = async (articleId: number, newStatus: string) => {
    try {
      console.log('Changing article status:', articleId, 'to', newStatus);
      
      if (newStatus === 'published') {
        const response = await ArticlesService.publishArticle(articleId);
        console.log('Publish response:', response);
        toast.success(response.message || 'Article published successfully');
      } else if (newStatus === 'draft') {
        const response = await ArticlesService.unpublishArticle(articleId);
        console.log('Unpublish response:', response);
        toast.success(response.message || 'Article unpublished successfully');
      } else if (newStatus === 'pending') {
        // For pending status, we need to update the article directly
        const response = await ArticlesService.updateArticle(articleId, { status: 'pending' });
        console.log('Pending response:', response);
        toast.success(response.message || 'Article submitted for review');
      }
      
      // Refresh the articles list
      await execute(() => ArticlesService.getArticles(filters));
      console.log('Articles refreshed successfully');
    } catch (error) {
      console.error('Error updating article status:', error);
      toast.error(`Error updating article status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleFeaturedToggle = async (articleId: number) => {
    try {
      console.log('Toggling featured status for article:', articleId);
      
      const response = await ArticlesService.toggleFeatured(articleId);
      console.log('Toggle featured response:', response);
      toast.success(response.message || 'Featured status updated successfully');
      
      // Refresh the articles list
      await execute(() => ArticlesService.getArticles(filters));
      console.log('Articles refreshed successfully');
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error(`Error toggling featured status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleBreakingNewsToggle = async (articleId: number) => {
    try {
      console.log('Toggling breaking news status for article:', articleId);
      const response = await ArticlesService.toggleBreakingNews(articleId);
      console.log('Toggle breaking news response:', response);
      toast.success(response.message || 'Breaking news status updated successfully');
      await execute(() => ArticlesService.getArticles(filters));
      console.log('Articles refreshed successfully');
    } catch (error) {
      console.error('Error toggling breaking news status:', error);
      toast.error(`Error toggling breaking news status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleLatestHeadlineToggle = async (articleId: number) => {
    try {
      console.log('Toggling latest headline status for article:', articleId);
      const response = await ArticlesService.toggleLatestHeadline(articleId);
      console.log('Toggle latest headline response:', response);
      toast.success(response.message || 'Latest headline status updated successfully');
      await execute(() => ArticlesService.getArticles(filters));
      console.log('Articles refreshed successfully');
    } catch (error) {
      console.error('Error toggling latest headline status:', error);
      toast.error(`Error toggling latest headline status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (articleId: number) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        console.log('Deleting article:', articleId);
        
        const response = await ArticlesService.deleteArticle(articleId);
        console.log('Delete response:', response);
        toast.success(response.message || 'Article deleted successfully');
        
        // Refresh the articles list
        await execute(() => ArticlesService.getArticles(filters));
        console.log('Articles refreshed successfully');
      } catch (error) {
        console.error('Error deleting article:', error);
        toast.error(`Error deleting article: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const toggleDropdown = (articleId: number) => {
    setOpenDropdown(openDropdown === articleId ? null : articleId);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-admin-success text-white';
      case 'draft':
        return 'bg-admin-warning text-white';
      case 'pending':
        return 'bg-orange-500 text-white';
      case 'scheduled':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Check if article is scheduled (has future publish_date)
  const isArticleScheduled = (article: any) => {
    if (!article.publish_date) return false;
    const publishDate = new Date(article.publish_date);
    const now = new Date();
    return publishDate > now && article.status === 'draft';
  };

  // Get display status for article
  const getArticleDisplayStatus = (article: any) => {
    if (isArticleScheduled(article)) {
      return 'scheduled';
    }
    return article.status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && !articlesData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Articles</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Loading articles...
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Articles</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Error loading articles
            </p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const articles = articlesData?.articles || [];
  
  // Debug logging for pagination
  console.log('Articles page debug:', {
    articlesData,
    articles: articles.length,
    pagination,
    total: pagination?.total
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Articles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your news articles and content
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/articles/new"
            className="flex items-center space-x-2 bg-admin-accent text-white px-4 py-2 rounded-lg hover:bg-admin-accent-hover transition-colors"
          >
            <Plus size={16} />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-admin-accent focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories?.map((category: any) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author
              </label>
              <select
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
              >
                <option value="">All Authors</option>
                {authors?.map((author: any) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Limit Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Per Page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Articles List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Articles ({pagination?.total || 0})
            </h2>
            {loading && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-4 h-4 border-2 border-admin-accent border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {articles.length > 0 ? (
            articles.map((article: any) => (
              <div key={article.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Article Media */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                      {renderArticleMedia(article)}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <User size={14} />
                            <span>{article.author_name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{formatDate(article.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye size={14} />
                            <span>{article.views?.toLocaleString() || '0'} views</span>
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getArticleDisplayStatus(article))}`}>
                  {getArticleDisplayStatus(article)}
                </span>
                        
                        {article.featured && (
                          <Star size={16} className="text-yellow-500" />
                        )}
                        
                        {article.is_breaking_news && (
                          <Zap size={16} className="text-red-500" />
                        )}
                        
                        {article.is_latest_headline && (
                          <Clock size={16} className="text-blue-500" />
                        )}

                        <div className="relative">
                          <button 
                            onClick={() => toggleDropdown(article.id)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <MoreVertical size={16} className="text-gray-400" />
                          </button>
                          {openDropdown === article.id && (
                            <div 
                              ref={dropdownRef}
                              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                            >
                              <Link
                                to={`/admin/articles/edit/${article.id}`}
                                onClick={closeDropdown}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Edit size={14} />
                                <span>Edit</span>
                              </Link>
                              
                              <button
                                onClick={() => {
                                  handleFeaturedToggle(article.id);
                                  closeDropdown();
                                }}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {article.featured ? <StarOff size={14} /> : <Star size={14} />}
                                <span>{article.featured ? 'Unfeature' : 'Feature'}</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  handleBreakingNewsToggle(article.id);
                                  closeDropdown();
                                }}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {article.is_breaking_news ? <Zap size={14} /> : <Zap size={14} />}
                                <span>{article.is_breaking_news ? 'Remove from Breaking News' : 'Add to Breaking News'}</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  handleLatestHeadlineToggle(article.id);
                                  closeDropdown();
                                }}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {article.is_latest_headline ? <Clock size={14} /> : <Clock size={14} />}
                                <span>{article.is_latest_headline ? 'Remove from Latest Headlines' : 'Add to Latest Headlines'}</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  const displayStatus = getArticleDisplayStatus(article);
                                  if (displayStatus === 'scheduled') {
                                    // For scheduled articles, show a message
                                    toast.info('This article is scheduled for future publication');
                                  } else {
                                    handleStatusChange(article.id, article.status === 'draft' ? 'published' : 'draft');
                                  }
                                  closeDropdown();
                                }}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {getArticleDisplayStatus(article) === 'scheduled' ? (
                                  <>
                                    <Clock size={14} />
                                    <span>Scheduled</span>
                                  </>
                                ) : article.status === 'draft' ? (
                                  <>
                                    <Eye size={14} />
                                    <span>Publish</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff size={14} />
                                    <span>Unpublish</span>
                                  </>
                                )}
                              </button>
                              
                              {/* Show Approve button for pending articles */}
                              {article.status === 'pending' && (
                                <button
                                  onClick={() => {
                                    handleStatusChange(article.id, 'published');
                                    closeDropdown();
                                  }}
                                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                >
                                  <CheckCircle size={14} />
                                  <span>Approve & Publish</span>
                                </button>
                              )}
                              
                              <button
                                onClick={() => {
                                  handleDelete(article.id);
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
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No articles found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {filters.search || filters.status !== 'all' || filters.category
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first article'
                }
              </p>
              {!filters.search && filters.status === 'all' && !filters.category && (
                <Link
                  to="/admin/articles/new"
                  className="inline-flex items-center space-x-2 bg-admin-accent text-white px-4 py-2 rounded-lg hover:bg-admin-accent-hover transition-colors"
                >
                  <Plus size={16} />
                  <span>Create Article</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} articles
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 