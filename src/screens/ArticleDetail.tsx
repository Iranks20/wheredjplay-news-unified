'use client'

import { useEffect, useState } from 'react';
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
  Tag,
  Heart,
  Bookmark,
  ExternalLink,
  Clock
} from 'lucide-react';
import * as Components from '../components';
import { useApi } from '../hooks/useApi';
import { ArticlesService } from '../lib/api';
import { ImageUploadService } from '../lib/uploadService';
import { getAssetPath } from '../lib/utils';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { data: article, loading, error, execute } = useApi();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

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
      case 'copy':
        navigator.clipboard.writeText(url);
        setShowShareMenu(false);
        return;
      default:
        shareUrl = url;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Static data for sections without APIs
  const relatedArticles = [
    {
      id: '2',
      title: 'Pioneer Unveils Next-Gen CDJ-4000: AI-Powered Beat Matching and Holographic Displays',
      image: getAssetPath('images/articles/46_JC6vzus.jpg'),
      category: 'Gear & Tech',
      publishedAt: '4 hours ago'
    },
    {
      id: '3',
      title: 'Tomorrowland 2024: Record-Breaking Attendance and Groundbreaking Stage Designs',
      image: getAssetPath('images/articles/img_0002.jpg'),
      category: 'Event Reports',
      publishedAt: '6 hours ago'
    },
    {
      id: '4',
      title: 'Deadmau5 Signs Major Deal with Universal Music Group',
      image: getAssetPath('images/articles/38_d9az1XP.jpg'),
      category: 'Artist News',
      publishedAt: '8 hours ago'
    }
  ];

  const mostPopularArticles = [
    {
      id: '5',
      title: 'Aphex Twin & Supreme Drop New Collection Spring/Summer 2025',
      category: 'Artist News',
      publishedAt: '2 hours ago'
    },
    {
      id: '6',
      title: 'Eric Prydz Unleashes HOLOSPHERE 2.0 in Ibiza',
      category: 'Event Reports',
      publishedAt: '4 hours ago'
    },
    {
      id: '7',
      title: 'Dekmantel Festival 2025 Unveils Massive Lineup',
      category: 'Event Reports',
      publishedAt: '6 hours ago'
    }
  ];

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
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-3">
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center space-x-2 text-wdp-accent hover:text-wdp-accent-hover mb-6 transition-colors">
              <ArrowLeft size={20} />
              <span>Back to News</span>
            </Link>

            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-wdp-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {article.category_name}
                </span>
                <span className="text-gray-500 dark:text-wdp-text/60 text-sm">{formatDate(article.created_at)}</span>
                <span className="text-gray-500 dark:text-wdp-text/60 text-sm">5 min read</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-wdp-text mb-6 leading-tight">
                {article.title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={getAssetPath('images/authors/35_MVW1Wr9.jpg')} 
                  alt={article.author_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-wdp-text">{article.author_name}</p>
                  <p className="text-gray-600 dark:text-wdp-text/60 text-sm">Senior Music Journalist with 10+ years covering electronic music. Based in London.</p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {article.image && (
              <div className="mb-8">
                <img 
                  src={ImageUploadService.getImageUrl(article.image) || article.image} 
                  alt={article.title}
                  className="w-full h-96 object-cover rounded-xl"
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
            <div className="prose prose-lg max-w-none text-gray-900 dark:text-wdp-text">
              <div 
                className="text-gray-900 dark:text-wdp-text leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            {/* Article Actions */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200 dark:border-wdp-muted">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-wdp-accent text-white' 
                      : 'bg-gray-100 dark:bg-wdp-surface text-gray-700 dark:text-wdp-text hover:bg-gray-200 dark:hover:bg-wdp-muted'
                  }`}
                >
                  <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                  <span>{(article.views || 0) + (isLiked ? 1 : 0)}</span>
                </button>
                
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isBookmarked 
                      ? 'bg-wdp-accent text-white' 
                      : 'bg-gray-100 dark:bg-wdp-surface text-gray-700 dark:text-wdp-text hover:bg-gray-200 dark:hover:bg-wdp-muted'
                  }`}
                >
                  <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                  <span>Save</span>
                </button>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-wdp-surface text-gray-700 dark:text-wdp-text hover:bg-gray-200 dark:hover:bg-wdp-muted transition-colors"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
                
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white dark:bg-wdp-surface border border-gray-200 dark:border-wdp-muted rounded-lg shadow-lg p-2 z-10">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-wdp-muted transition-colors"
                    >
                      <Facebook size={16} className="text-blue-500" />
                      <span className="text-gray-900 dark:text-wdp-text">Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-wdp-muted transition-colors"
                    >
                      <Twitter size={16} className="text-blue-400" />
                      <span className="text-gray-900 dark:text-wdp-text">Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-wdp-muted transition-colors"
                    >
                      <Share2 size={16} className="text-wdp-accent" />
                      <span className="text-gray-900 dark:text-wdp-text">Copy Link</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-wdp-text mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link key={related.id} to={`/article/${related.id}`} className="group">
                    <div className="bg-white dark:bg-wdp-surface rounded-xl overflow-hidden border border-gray-200 dark:border-wdp-muted hover:border-wdp-accent transition-colors">
                      <img 
                        src={related.image} 
                        alt={related.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-4">
                        <span className="text-wdp-accent text-sm font-semibold">{related.category}</span>
                        <h4 className="text-gray-900 dark:text-wdp-text font-semibold mt-2 line-clamp-2 group-hover:text-wdp-accent transition-colors">
                          {related.title}
                        </h4>
                        <p className="text-gray-600 dark:text-wdp-text/60 text-sm mt-2">{related.publishedAt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sticky DJLink.me Ad */}
            <Components.DJLinkAd />

            {/* Newsletter Signup */}
            <div className="bg-wdp-accent rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Weekly Newsletter</h3>
              <p className="text-white/90 text-sm mb-4">
                Get the hottest electronic music news delivered to your inbox.
              </p>
              <button className="w-full bg-white text-wdp-accent py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe Now
              </button>
            </div>

            {/* News Categories */}
            <div className="bg-white dark:bg-wdp-surface rounded-xl p-6 shadow-md border border-gray-200 dark:border-wdp-muted">
              <h3 className="text-lg font-bold text-gray-900 dark:text-wdp-text mb-4">News Categories</h3>
              <div className="space-y-3">
                <a href="/category/artist-news" className="block text-gray-700 dark:text-wdp-text hover:text-wdp-accent transition-colors">
                  Artist News
                </a>
                <a href="/category/event-reports" className="block text-gray-700 dark:text-wdp-text hover:text-wdp-accent transition-colors">
                  Event Reports
                </a>
                <a href="/category/gear-tech" className="block text-gray-700 dark:text-wdp-text hover:text-wdp-accent transition-colors">
                  Gear & Tech
                </a>
                <a href="/category/trending-tracks" className="block text-gray-700 dark:text-wdp-text hover:text-wdp-accent transition-colors">
                  Trending Tracks
                </a>
                <a href="/category/industry-news" className="block text-gray-700 dark:text-wdp-text hover:text-wdp-accent transition-colors">
                  Industry News
                </a>
                <a href="/category/education-news" className="block text-gray-700 dark:text-wdp-text hover:text-wdp-accent transition-colors">
                  Education News
                </a>
              </div>
            </div>

            {/* DJLink.me CTA */}
            <div className="bg-wdp-accent rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Are you a DJ?</h3>
              <p className="text-white/90 text-sm mb-4">
                Create your professional profile and connect with venues, promoters, and fans worldwide.
              </p>
              <a
                href="https://djlink.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-white text-wdp-accent px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <span>Create Profile</span>
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Most Popular Articles */}
            <div className="bg-white dark:bg-wdp-surface rounded-xl p-6 shadow-md border border-gray-200 dark:border-wdp-muted">
              <h3 className="text-lg font-bold text-gray-900 dark:text-wdp-text mb-4">Most Popular</h3>
              <div className="space-y-4">
                {mostPopularArticles.map((popular, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-wdp-accent font-bold text-lg">{index + 1}</span>
                    <div>
                      <h4 className="text-gray-900 dark:text-wdp-text font-semibold text-sm line-clamp-2 hover:text-wdp-accent transition-colors">
                        {popular.title}
                      </h4>
                      <p className="text-gray-600 dark:text-wdp-text/60 text-xs mt-1">{popular.publishedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Components.Footer />
    </div>
  );
}