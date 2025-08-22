'use client'

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Eye, 
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
import { extractSpotifyTrackId, extractYouTubeVideoId, extractSoundCloudTrackPath, extractBeatportTrackId } from '../utils/mediaUtils';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { data: article, loading, error, execute } = useApi();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  // Function to render media content for article detail
  const renderArticleDetailMedia = (article: any) => {
    // Priority: embedded media over image
    if (article.embedded_media && article.media_type !== 'image') {
      switch (article.media_type) {
        case 'spotify': {
          const trackId = extractSpotifyTrackId(article.embedded_media);
          if (!trackId) return null;
          return (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <iframe 
                style={{borderRadius: '12px'}} 
                src={`https://open.spotify.com/embed/track/${trackId}`}
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                className="w-full"
              />
            </div>
          );
        }
        
        case 'youtube': {
          const videoId = extractYouTubeVideoId(article.embedded_media);
          if (!videoId) return null;
          return (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <iframe 
                width="100%" 
                height="400" 
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full"
              />
            </div>
          );
        }
        
        case 'soundcloud': {
          const trackPath = extractSoundCloudTrackPath(article.embedded_media);
          console.log('🔍 ArticleDetail SoundCloud - embedded_media:', article.embedded_media, 'trackPath:', trackPath);
          if (!trackPath) return null;
          const iframeSrc = `https://w.soundcloud.com/player/?url=https://${trackPath}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&buying=false&liking=false&download=false&sharing=false&show_artwork=true&show_playcount=true&show_user=true&hide_related=false&visual=true&start_track=0`;
          console.log('🔍 ArticleDetail SoundCloud - iframeSrc:', iframeSrc);
          return (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <iframe 
                width="100%" 
                height="166" 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay" 
                src={iframeSrc}
                className="w-full"
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
          console.log('🔍 ArticleDetail Beatport - embedded_media:', article.embedded_media, 'trackId:', trackId);
          if (!trackId) return null;
          const iframeSrc = `https://embed.beatport.com/track/${trackId}?color=ff5500&bgcolor=000000&autoplay=false&show_artwork=true&show_playcount=true&show_user=true&hide_related=false&visual=true&start_track=0`;
          console.log('🔍 ArticleDetail Beatport - iframeSrc:', iframeSrc);
          return (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <iframe 
                width="100%" 
                height="166" 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay" 
                src={iframeSrc}
                className="w-full"
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
          src={ImageUploadService.getImageUrl(article.image)} 
          alt={article.title} 
          className="w-full h-96 object-cover rounded-lg" 
        />
      );
    }

    // Fallback to placeholder
    return (
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🎵</div>
          <p className="text-sm">No media available</p>
        </div>
      </div>
    );
  };

  if (loading && !article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-wdp-background">
        {/* Top Banner Ad for DJLink.me */}
        

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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className="bg-wdp-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {article.category_name}
                  </span>
                  <span className="text-gray-500 dark:text-wdp-text/60 text-sm">{formatDate(article.created_at)}</span>
                  <span className="text-gray-500 dark:text-wdp-text/60 text-sm">5 min read</span>
                </div>
                
                <Components.SocialShare 
                  url={window.location.href}
                  title={article.title}
                  description={article.excerpt || `Check out this article on WhereDJsPlay: ${article.title}`}
                  image={ImageUploadService.getImageUrl(article.image)}
                  className="sm:hidden"
                />
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

            {/* Featured Media */}
            <div className="mb-8">
              {renderArticleDetailMedia(article)}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none text-gray-900 dark:text-wdp-text">
              <div 
                className="article-content text-gray-900 dark:text-wdp-text leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'A') {
                    e.preventDefault();
                    window.open(target.getAttribute('href'), '_blank', 'noopener,noreferrer');
                  }
                }}
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
              
              <Components.SocialShare 
                url={window.location.href}
                title={article.title}
                description={article.excerpt || `Check out this article on WhereDJsPlay: ${article.title}`}
                image={ImageUploadService.getImageUrl(article.image)}
              />
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