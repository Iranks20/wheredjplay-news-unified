'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Headphones, 
  Zap, 
  Star, 
  ArrowRight,
  Calendar,
  User,
  Eye,
  FileText
} from 'lucide-react';
import * as Components from '../components';
import { useApi } from '../hooks/useApi';
import { ArticlesService, CategoriesService } from '../lib/api';

export default function Homepage() {
  const { category } = useParams();
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  const { data: articlesData, loading, error, execute } = useApi();
  const { data: categories, loading: categoriesLoading, execute: fetchCategories } = useApi();

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
  }, [execute, fetchCategories, category]);

  const articles = articlesData?.articles || [];
  const categoriesList = categories || [];

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

  if (loading && !articlesData) {
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
      <main className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-8">
        {/* Hero Section - Only show on homepage */}
        {!category && (
          <section className="mb-12">
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

        {/* Breaking News Section */}
        {!category && articles.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-wdp-text">Breaking News</h2>
              <a href="#" className="text-wdp-accent hover:text-wdp-accent-hover font-medium flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight size={16} />
              </a>
                  </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(0, 3).map((article: any) => (
                <Components.NewsCard
                  key={article.id}
                  id={article.id.toString()}
                  title={article.title}
                  excerpt={article.excerpt}
                  image={article.image}
                  category={article.category_name}
                  author={article.author_name}
                  publishedAt={formatDate(article.created_at)}
                  readTime="5 min read"
                  featured={article.featured}
                />
              ))}
                </div>
              </section>
            )}

        {/* Latest Headlines */}
        <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-wdp-text">
              {category ? 'Latest Articles' : 'Latest Headlines'}
                </h2>
            <a href="#" className="text-wdp-accent hover:text-wdp-accent-hover font-medium flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any) => (
                <Components.NewsCard
                  key={article.id}
                  id={article.id.toString()}
                  title={article.title}
                  excerpt={article.excerpt}
                  image={article.image}
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
      </main>

      {/* Footer */}
      <Components.Footer />

      {/* Newsletter Modal */}
      {showNewsletterModal && (
      <Components.NewsletterModal
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
      />
      )}
    </div>
  );
}