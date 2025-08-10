'use client'

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Eye, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  ArrowLeft,
  Tag
} from 'lucide-react';
import * as Components from '../components';
import { useApi } from '../hooks/useApi';
import { ArticlesService } from '../lib/api';
import { ImageUploadService } from '../lib/uploadService';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { data: article, loading, error, execute } = useApi();

  useEffect(() => {
    if (slug) {
      execute(() => ArticlesService.getArticle(slug));
    }
  }, [execute, slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        shareUrl = url;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading && !article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-wdp-background">
        {/* Top Banner Ad for DJLink.me */}
        <div className="bg-wdp-accent text-white p-3 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="font-semibold">🎧 Create Your DJ Profile on</span>
            <a 
              href="https://djlink.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold underline hover:text-white/80 transition-colors"
            >
              DJLink.me
            </a>
            <span>→ Connect with venues worldwide</span>
          </div>
        </div>

        <Components.Header />

        <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-wdp-background">
        {/* Top Banner Ad for DJLink.me */}
        <div className="bg-wdp-accent text-white p-3 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="font-semibold">🎧 Create Your DJ Profile on</span>
            <a 
              href="https://djlink.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold underline hover:text-white/80 transition-colors"
            >
              DJLink.me
            </a>
            <span>→ Connect with venues worldwide</span>
          </div>
        </div>

        <Components.Header />

        <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-wdp-accent text-white px-6 py-3 rounded-lg hover:bg-wdp-accent-hover transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-wdp-background">
      {/* Top Banner Ad for DJLink.me */}
      <div className="bg-wdp-accent text-white p-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <span className="font-semibold">🎧 Create Your DJ Profile on</span>
          <a 
            href="https://djlink.me" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-bold underline hover:text-white/80 transition-colors"
          >
            DJLink.me
          </a>
          <span>→ Connect with venues worldwide</span>
        </div>
      </div>

      {/* Header */}
      <Components.Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link to="/" className="hover:text-wdp-accent transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link 
                to={`/category/${article.category_slug}`} 
                className="hover:text-wdp-accent transition-colors"
              >
                {article.category_name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white truncate">
              {article.title}
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <Link 
              to={`/category/${article.category_slug}`}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-wdp-accent/10 text-wdp-accent rounded-full text-sm font-medium hover:bg-wdp-accent/20 transition-colors"
            >
              <Tag size={14} />
              <span>{article.category_name}</span>
            </Link>
              </div>
              
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-wdp-text mb-4 leading-tight">
                {article.title}
              </h1>
              
          <p className="text-xl text-gray-600 dark:text-wdp-text/80 mb-6 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{article.author_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formatDate(article.created_at)}</span>
                </div>
              <div className="flex items-center space-x-2">
                <Eye size={16} />
                <span>{article.views?.toLocaleString() || '0'} views</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Share:</span>
              <button
                onClick={() => handleShare('facebook')}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Share on Facebook"
              >
                <Facebook size={16} />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                title="Share on Twitter"
              >
                <Twitter size={16} />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="p-2 text-gray-400 hover:text-blue-700 transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin size={16} />
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="p-2 text-gray-400 hover:text-wdp-accent transition-colors"
                title="Copy link"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </header>

            {/* Featured Image */}
        {article.image && (
            <div className="mb-8">
              <img 
                src={ImageUploadService.getImageUrl(article.image) || article.image} 
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
                onError={() => {
                  console.error('Failed to load article image:', article.image);
                  console.error('Constructed URL:', ImageUploadService.getImageUrl(article.image));
                }}
                onLoad={() => {
                  console.log('Article image loaded successfully:', article.image);
                }}
              />
            </div>
        )}

            {/* Article Content */}
        <article className="prose prose-lg max-w-none dark:prose-invert">
              <div 
                className="text-gray-900 dark:text-wdp-text leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
        </article>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Written by:</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-400" />
              </div>
                <span className="font-medium text-gray-900 dark:text-wdp-text">
                  {article.author_name}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {article.views?.toLocaleString() || '0'} views
              </span>
              {article.featured && (
                <span className="inline-flex items-center space-x-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-full text-xs font-medium">
                  <span>⭐</span>
                  <span>Featured</span>
                </span>
              )}
            </div>
          </div>
        </footer>

        {/* Related Articles Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-wdp-text mb-6">
            More from {article.category_name}
          </h2>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Related articles will appear here
            </p>
            <Link
              to={`/category/${article.category_slug}`}
              className="inline-flex items-center space-x-2 bg-wdp-accent text-white px-6 py-3 rounded-lg hover:bg-wdp-accent-hover transition-colors"
            >
              <span>View All {article.category_name} Articles</span>
              <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Components.Footer />
    </div>
  );
}