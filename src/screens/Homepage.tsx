'use client'

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Eye,
  Headphones,
  Zap,
  Star,
  ArrowRight,
  FileText,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { ArticlesService, CategoriesService } from '../lib/api';
import { useApi, useApiWithPagination } from '../hooks/useApi';
import NewsCard from '../components/NewsCard';
import DJLinkAd from '../components/DJLinkAd';
import NewsletterModal from '../components/NewsletterModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAssetPath } from '../lib/utils';
import { ImageUploadService } from '../lib/uploadService';
import { extractSpotifyTrackId, extractYouTubeVideoId, extractSoundCloudTrackPath } from '../utils/mediaUtils';

export default function Homepage() {
  const { category } = useParams();
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  const { data: articlesData, loading, error, execute } = useApi();
  const { data: categories, loading: categoriesLoading, execute: fetchCategories } = useApi();
  const { data: breakingNewsData, loading: breakingNewsLoading, execute: fetchBreakingNews } = useApi();
  const { data: latestHeadlinesData, loading: latestHeadlinesLoading, execute: fetchLatestHeadlines } = useApi();

  useEffect(() => {
    // Fetch categories
    fetchCategories(() => CategoriesService.getCategories());
    
    // Fetch articles based on category
    const params = {
      status: 'published',
      limit: 20,
      ...(category && { category })
    };
    execute(() => ArticlesService.getArticles(params));

    // Fetch breaking news and latest headlines only on homepage
    if (!category) {
      fetchBreakingNews(() => ArticlesService.getBreakingNews(6));
      fetchLatestHeadlines(() => ArticlesService.getLatestHeadlines(8));
    }
  }, [execute, fetchCategories, fetchBreakingNews, fetchLatestHeadlines, category]);

  const articles = articlesData?.articles || [];
  const categoriesList = categories || [];
  const breakingNews = breakingNewsData || [];
  const latestHeadlines = latestHeadlinesData || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (categorySlug: string) => {
    const category = categoriesList.find((cat: any) => cat.slug === categorySlug);
    return category?.color || '#09afdf';
  };

  // Static data for features that don't have APIs yet
  const trendingTracks = [
    { title: 'Follow The Light', artist: 'Armin van Buuren & Hardwell', plays: '3.2M', chart: 1 },
    { title: 'I\'m The Devil', artist: 'Hardwell & AVAO', plays: '2.8M', chart: 2 },
    { title: 'Body', artist: 'Gabry Ponte & Tai Woffinden', plays: '2.1M', chart: 3 },
    { title: 'Alright', artist: 'The Stickmen Project & Izzy Bizu', plays: '1.9M', chart: 4 },
    { title: 'Just Dance', artist: 'Macon & Chacel', plays: '1.7M', chart: 5 }
  ];

  const mostRead = [
    { title: 'Aphex Twin & Supreme Drop New Collection Spring/Summer 2025', views: '25K', category: 'Artist News' },
    { title: 'Eric Prydz Unleashes HOLOSPHERE 2.0 in Ibiza', views: '22K', category: 'Event Reports' },
    { title: 'Dekmantel Festival 2025 Unveils Massive Lineup', views: '18K', category: 'Event Reports' },
    { title: 'James Blake Introduces New Model for Artists', views: '15K', category: 'Artist News' },
    { title: '30 Years of the CDJ: Transforming DJ Culture', views: '12K', category: 'Gear & Tech' },
    { title: 'John Digweed Hospitalised, Cancels Shows', views: '10K', category: 'Industry News' }
  ];

  // Function to render media content for breaking news
  const renderBreakingNewsMedia = (article: any) => {
    // Priority: embedded media over image
    if (article.embedded_media && article.media_type !== 'image') {
      switch (article.media_type) {
        case 'spotify': {
          const trackId = extractSpotifyTrackId(article.embedded_media);
          if (!trackId) return null;
          return (
            <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <iframe 
                style={{borderRadius: '8px'}} 
                src={`https://open.spotify.com/embed/track/${trackId}`}
                width="100%" 
                height="120" 
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
            <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <iframe 
                width="100%" 
                height="120" 
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
          console.log('🔍 Homepage SoundCloud - embedded_media:', article.embedded_media, 'trackPath:', trackPath);
          if (!trackPath) return null;
          const iframeSrc = `https://w.soundcloud.com/player/?url=https://${trackPath}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&buying=false&liking=false&download=false&sharing=false&show_artwork=true&show_playcount=true&show_user=true&hide_related=false&visual=true&start_track=0`;
          console.log('🔍 Homepage SoundCloud - iframeSrc:', iframeSrc);
          return (
            <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <iframe 
                width="100%" 
                height="120" 
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
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      );
    }

    // Fallback to placeholder
    return (
      <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-2xl mb-1">🎵</div>
          <p className="text-xs">Media Preview</p>
        </div>
      </div>
    );
  };

  const editorsPicks = [
    { title: 'Aphex Twin & Supreme Drop New Collection Spring/Summer 2025', category: 'Artist News' },
    { title: 'Eric Prydz Unleashes HOLOSPHERE 2.0 in Ibiza', category: 'Event Reports' },
    { title: 'James Trystan & Steve Glass Unite for Live Melodic Techno Set in Thailand', category: 'Artist News' },
    { title: 'Dekmantel Festival 2025 Unveils Massive Lineup', category: 'Event Reports' },
    { title: 'Macon Drops Underground Hit \'Just Dance\' with Chacel', category: 'Artist News' },
    { title: 'Floating Points & Kerri Chandler Join Kappa FuturFestival 2025', category: 'Event Reports' }
  ];

  if (loading && !articlesData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-wdp-background">
        <Header />

        <main className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-8">
          <div className="animate-pulse space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-wdp-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-8">
        {/* Category Header */}
        {category && (
          <section className="mb-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-wdp-text mb-4 capitalize">
                {category.replace('-', ' ')} News
              </h1>
              <p className="text-xl text-gray-600 dark:text-wdp-text/80 max-w-2xl mx-auto">
                Latest updates and stories from the {category.replace('-', ' ')} scene
              </p>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Story Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-wdp-text">
                  {category ? `${category.replace('-', ' ').toUpperCase()} NEWS` : 'Featured Story'}
                </h1>
                <div className="flex items-center space-x-2 text-wdp-accent">
                  <Zap size={20} />
                  <span className="font-semibold">{category ? 'Category' : 'Breaking News'}</span>
                </div>
              </div>
              {articles.length > 0 && (
                <NewsCard
                  id={articles[0].id.toString()}
                  title={articles[0].title}
                  excerpt={articles[0].excerpt}
                  image={articles[0].image}
                  embeddedMedia={articles[0].embedded_media}
                  mediaType={articles[0].media_type}
                  category={articles[0].category_name}
                  author={articles[0].author_name}
                  publishedAt={formatDate(articles[0].created_at)}
                  readTime="5 min read"
                  featured={true}
                />
              )}
            </section>

            {/* Breaking News Section - Only show on homepage */}
            {!category && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-wdp-text">
                    Breaking News
                  </h2>
                  <div className="flex items-center space-x-2 text-wdp-accent">
                    <Zap size={20} />
                    <span className="font-semibold">Latest Updates</span>
                  </div>
                </div>
                {breakingNewsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white dark:bg-wdp-surface rounded-xl p-0 shadow-md border border-gray-200 dark:border-wdp-muted overflow-hidden animate-pulse">
                        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700"></div>
                        <div className="p-6">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : breakingNews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {breakingNews.map((article) => (
                                              <Link key={article.id} to={`/article/${article.id}`} className="group">
                          <div className="bg-white dark:bg-wdp-surface rounded-xl p-0 shadow-md border border-gray-200 dark:border-wdp-muted overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300">
                            {renderBreakingNewsMedia(article)}
                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-xs font-semibold text-red-600 dark:text-red-400">BREAKING</span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-wdp-text mb-2 group-hover:text-wdp-accent transition-colors">{article.title}</h3>
                            <p className="text-gray-600 dark:text-wdp-text/70 text-sm mb-3">{article.excerpt}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-wdp-text/50 mt-auto">
                              <span>{article.category_name}</span>
                              <span>{formatDate(article.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No breaking news</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      No breaking news articles available at the moment.
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Latest Headlines Section - Only show on homepage */}
            {!category && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-wdp-text">
                    Latest Headlines
                  </h2>
                  <div className="flex items-center space-x-2 text-wdp-accent">
                    <Clock size={20} />
                    <span className="font-semibold">Recent Updates</span>
                  </div>
                </div>
                {latestHeadlinesLoading ? (
                  <div className="space-y-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-white dark:bg-wdp-surface rounded-lg p-4 border border-gray-200 dark:border-wdp-muted animate-pulse">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : latestHeadlines.length > 0 ? (
                  <div className="space-y-4">
                    {latestHeadlines.map((headline) => (
                      <Link key={headline.id} to={`/article/${headline.id}`} className="block">
                        <div className="bg-white dark:bg-wdp-surface rounded-lg p-4 border border-gray-200 dark:border-wdp-muted hover:border-wdp-accent transition-colors group">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-wdp-text mb-1 group-hover:text-wdp-accent transition-colors">{headline.title}</h3>
                              <p className="text-gray-600 dark:text-wdp-text/70 text-sm mb-2">{headline.excerpt}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-wdp-text/50">
                                <span>{headline.category_name}</span>
                                <span>{formatDate(headline.created_at)}</span>
                                <span>• 5 min read</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No latest headlines</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      No latest headline articles available at the moment.
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Inline DJLink.me Ad */}
            <DJLinkAd format="inline" className="my-8" />

            {/* Latest News Grid */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-wdp-text">
                  {category ? `More ${category.replace('-', ' ').toUpperCase()} NEWS` : 'Latest News'}
                </h2>
                <button className="text-wdp-accent hover:text-wdp-accent-hover font-semibold transition-colors">
                  View All
                </button>
              </div>
              {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.slice(1).map((article: any) => (
                    <NewsCard
                      key={article.id}
                      id={article.id.toString()}
                      title={article.title}
                      excerpt={article.excerpt}
                      image={article.image}
                      embeddedMedia={article.embedded_media}
                      mediaType={article.media_type}
                      category={article.category_name}
                      author={article.author_name}
                      publishedAt={formatDate(article.created_at)}
                      readTime="5 min read"
                      featured={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No articles found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {category 
                      ? `No articles in the ${category.replace('-', ' ')} category yet.`
                      : 'No articles published yet.'
                    }
                  </p>
                </div>
              )}
            </section>

            {/* News Categories Grid - Only show on homepage */}
            {!category && (
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-wdp-surface rounded-xl p-6 shadow-md border border-gray-200 dark:border-wdp-muted">
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="text-wdp-accent" size={20} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-wdp-text">Editor's Picks</h3>
                  </div>
                  <div className="space-y-3">
                    {editorsPicks.map((pick, index) => (
                      <div key={index} className="border-l-4 border-wdp-accent pl-3">
                        <p className="font-semibold text-gray-900 dark:text-wdp-text text-sm line-clamp-2">
                          {pick.title}
                        </p>
                        <p className="text-gray-600 dark:text-wdp-text/70 text-xs">{pick.category}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-wdp-surface rounded-xl p-6 shadow-md border border-gray-200 dark:border-wdp-muted">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="text-wdp-accent" size={20} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-wdp-text">Trending Tracks</h3>
                  </div>
                  <div className="space-y-3">
                    {trendingTracks.map((track, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-wdp-text text-sm">{track.title}</p>
                          <p className="text-gray-600 dark:text-wdp-text/70 text-xs">{track.artist}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-wdp-accent text-xs font-semibold">#{track.chart}</span>
                          <p className="text-xs text-gray-500 dark:text-wdp-text/50">{track.plays}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-wdp-surface rounded-xl p-6 shadow-md border border-gray-200 dark:border-wdp-muted">
                  <div className="flex items-center space-x-2 mb-4">
                    <Headphones className="text-wdp-accent" size={20} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-wdp-text">Most Read</h3>
                  </div>
                  <div className="space-y-3">
                    {mostRead.map((article, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-wdp-text text-sm line-clamp-2">
                            {article.title}
                          </p>
                          <p className="text-gray-600 dark:text-wdp-text/70 text-xs">{article.category}</p>
                        </div>
                        <span className="text-wdp-accent text-xs font-semibold">{article.views}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Categories Section */}
            {!category && categoriesList.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-wdp-text mb-6">Browse by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categoriesList.map((cat: any) => (
                    <a
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-wdp-accent/50 transition-colors"
                    >
                      <div className="text-center">
                        <div 
                          className="w-8 h-8 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: cat.color }}
                        ></div>
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-wdp-accent transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {cat.article_count || 0} articles
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sticky DJLink.me Ad */}
            <DJLinkAd />

            {/* Newsletter Signup */}
            <div className="bg-wdp-accent rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Weekly Newsletter</h3>
              <p className="text-white/90 text-sm mb-4">
                Get the hottest electronic music news delivered to your inbox.
              </p>
              <button
                onClick={() => setShowNewsletterModal(true)}
                className="w-full bg-white text-wdp-accent py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
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
          </div>
        </div>

        {/* Hero Section - Moved to bottom, only show on homepage */}
        {!category && (
          <section className="mt-16 mb-8">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-wdp-surface dark:to-wdp-muted rounded-2xl p-8 md:p-12 text-gray-900 dark:text-wdp-text relative overflow-hidden border border-gray-200 dark:border-wdp-muted">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-wdp-accent/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-wdp-accent/20 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-wdp-accent/20 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <div className="max-w-4xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-wdp-accent/20 rounded-lg flex items-center justify-center">
                      <Headphones size={24} className="text-wdp-accent" />
                    </div>
                    <span className="text-wdp-accent font-semibold">PREMIER ELECTRONIC MUSIC NEWS</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-wdp-text">
                    WhereDJsPlay
                    <span className="block text-3xl md:text-4xl text-wdp-accent font-normal mt-2">
                      Your Ultimate Source for DJ & Electronic Music News
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-700 dark:text-wdp-text/90 mb-8 leading-relaxed max-w-3xl">
                    Stay ahead of the beat with breaking news, exclusive interviews, gear reviews, and industry insights from the global electronic music scene. From underground techno to mainstream EDM, we cover it all.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-wdp-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-wdp-accent-hover transition-all duration-200 flex items-center justify-center space-x-2">
                      <span>Explore Latest News</span>
                      <Zap size={20} />
                    </button>
                    <button 
                      onClick={() => setShowNewsletterModal(true)}
                      className="border-2 border-wdp-accent/30 text-wdp-accent px-8 py-3 rounded-lg font-bold hover:bg-wdp-accent/10 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>Subscribe to Newsletter</span>
                      <Star size={20} />
                    </button>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap gap-8 mt-8 pt-8 border-t border-gray-300 dark:border-wdp-muted">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-wdp-text">50K+</div>
                      <div className="text-wdp-accent text-sm">Monthly Readers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-wdp-text">1000+</div>
                      <div className="text-wdp-accent text-sm">Articles Published</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-wdp-text">24/7</div>
                      <div className="text-wdp-accent text-sm">News Coverage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-wdp-text">Global</div>
                      <div className="text-wdp-accent text-sm">Music Scene</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Newsletter Modal */}
      {showNewsletterModal && (
        <NewsletterModal
          isOpen={showNewsletterModal}
          onClose={() => setShowNewsletterModal(false)}
        />
      )}
    </div>
  );
}