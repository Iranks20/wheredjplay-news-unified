'use client'

import React, { useEffect, useState } from 'react';
import { 
  Eye, 
  Users, 
  FileText, 
  Clock, 
  BarChart3,
  Settings,
  TrendingUp,
  TrendingDown,
  MapPin,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { AnalyticsService, ShortLinksService } from '../lib/api';

export default function Dashboard() {
  const { data: analytics, loading, error, execute } = useApi();
  const { data: shortLinkAnalytics, loading: shortLinkLoading, execute: executeShortLinks } = useApi();
  const { data: detailedClicks, loading: detailedClicksLoading, execute: executeDetailedClicks } = useApi();
  
  const [showDetailedClicks, setShowDetailedClicks] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    execute(() => AnalyticsService.getDashboard());
    executeShortLinks(() => ShortLinksService.getDashboardAnalytics(30));
    executeDetailedClicks(() => ShortLinksService.getDetailedClicks({ period: 30, page: currentPage, limit: 20 }));
  }, [execute, executeShortLinks, executeDetailedClicks, currentPage]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Loading dashboard data...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-red-600 dark:text-red-400 mt-1">
              Error loading dashboard data: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const stats = analytics ? [
    {
      name: 'Total Views',
      value: analytics.totalViews?.toLocaleString() || '0',
      change: analytics.viewsChange || 0,
      icon: Eye
    },
    {
      name: 'Total Articles',
      value: analytics.totalArticles?.toLocaleString() || '0',
      change: analytics.articlesChange || 0,
      icon: FileText
    },
    {
      name: 'Total Users',
      value: analytics.totalUsers?.toLocaleString() || '0',
      change: analytics.usersChange || 0,
      icon: Users
    },
    {
      name: 'Avg. Read Time',
      value: analytics.avgReadTime || '0 min',
      change: analytics.readTimeChange || 0,
      icon: Clock
    }
  ] : [];

  const recentArticles = analytics?.popularArticles || [];
  const topCategories = analytics?.categoryStats || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-admin-success text-white';
      case 'draft':
        return 'bg-admin-warning text-white';
      case 'pending':
        return 'bg-admin-error text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your news platform.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/articles/new"
            className="flex items-center space-x-2 bg-admin-accent text-white px-4 py-2 rounded-lg hover:bg-admin-accent-hover transition-colors"
          >
            <FileText size={16} />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  {stat.change !== 0 && (
                    <div className={`flex items-center mt-2 text-sm ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span className="ml-1">{Math.abs(stat.change)}%</span>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-admin-accent/10 rounded-lg">
                  <Icon size={24} className="text-admin-accent" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Articles & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Articles</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentArticles.length > 0 ? (
                recentArticles.slice(0, 5).map((article: any) => (
                  <div key={article.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{article.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                        {article.status}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {article.views?.toLocaleString() || '0'} views
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No articles yet</p>
                  <p className="text-sm">Create your first article to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Categories</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topCategories.length > 0 ? (
                topCategories.slice(0, 5).map((category: any, index: number) => (
                  <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-admin-accent/10 rounded-lg flex items-center justify-center">
                        <span className="text-admin-accent font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{category.article_count} articles</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.total_views?.toLocaleString() || '0'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">views</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No category data yet</p>
                  <p className="text-sm">Categories will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Short Link Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Articles (Short Links) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Shared Articles</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <BarChart3 size={16} />
                <span>Last 30 days</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            {shortLinkLoading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent mx-auto mb-4"></div>
                <p>Loading short link analytics...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {shortLinkAnalytics?.topArticles && shortLinkAnalytics.topArticles.length > 0 ? (
                  shortLinkAnalytics.topArticles.map((article: any, index: number) => (
                    <div key={article.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-admin-accent/10 rounded-lg flex items-center justify-center">
                            <span className="text-admin-accent font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{article.slug}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{article.clicks?.toLocaleString() || '0'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">clicks</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No short link data yet</p>
                    <p className="text-sm">Share articles to see analytics</p>
                    <div className="mt-4">
                      <Link
                        to="/admin/articles"
                        className="inline-flex items-center space-x-2 text-admin-accent hover:text-admin-accent-hover text-sm font-medium"
                      >
                        <FileText size={16} />
                        <span>Go to Articles</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Referrers</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <TrendingUp size={16} />
                <span>Last 30 days</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            {shortLinkLoading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent mx-auto mb-4"></div>
                <p>Loading referrer data...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {shortLinkAnalytics?.topReferrers && shortLinkAnalytics.topReferrers.length > 0 ? (
                  shortLinkAnalytics.topReferrers.map((referrer: any, index: number) => (
                    <div key={referrer.referrer} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-admin-accent/10 rounded-lg flex items-center justify-center">
                            <span className="text-admin-accent font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                              {referrer.referrer}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{referrer.unique_visitors} unique visitors</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{referrer.clicks?.toLocaleString() || '0'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">clicks</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No referrer data yet</p>
                    <p className="text-sm">Traffic will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Short Link Summary Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Short Link Performance</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <BarChart3 size={16} />
            <span>Last 30 days</span>
          </div>
        </div>
        {shortLinkLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-16 mx-auto rounded mb-2"></div>
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-20 mx-auto rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-admin-accent">
                {shortLinkAnalytics?.totalClicks?.total_clicks?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-admin-accent">
                {shortLinkAnalytics?.totalClicks?.unique_visitors?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Unique Visitors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-admin-accent">
                {shortLinkAnalytics?.totalClicks?.articles_with_clicks?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Articles Shared</div>
            </div>
          </div>
        )}
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Geographic Distribution</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin size={16} />
              <span>Last 30 days</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          {shortLinkLoading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent mx-auto mb-4"></div>
              <p>Loading geographic data...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {shortLinkAnalytics?.geoData && shortLinkAnalytics.geoData.length > 0 ? (
                shortLinkAnalytics.geoData.map((location: any, index: number) => (
                  <div key={`${location.country}-${location.city}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-admin-accent/10 rounded-lg flex items-center justify-center">
                        <span className="text-admin-accent font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-gray-400" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {location.city ? `${location.city}, ${location.country}` : location.country}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{location.unique_visitors} unique visitors</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{location.clicks?.toLocaleString() || '0'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">clicks</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No geographic data yet</p>
                  <p className="text-sm">Location data will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Click Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Click Analytics</h2>
            <button
              onClick={() => setShowDetailedClicks(!showDetailedClicks)}
              className="flex items-center space-x-2 text-admin-accent hover:text-admin-accent-hover transition-colors"
            >
              <span className="text-sm font-medium">
                {showDetailedClicks ? 'Hide Details' : 'Show Details'}
              </span>
              {showDetailedClicks ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
        {showDetailedClicks && (
          <div className="p-6">
            {detailedClicksLoading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent mx-auto mb-4"></div>
                <p>Loading detailed click data...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {detailedClicks?.clicks && detailedClicks.clicks.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {detailedClicks.clicks.map((click: any) => (
                        <div key={click.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Article</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{click.article_title}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Location</h4>
                              <div className="flex items-center space-x-1">
                                <MapPin size={12} className="text-gray-400" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {click.city ? `${click.city}, ${click.country}` : click.country || 'Unknown'}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Referrer</h4>
                              <div className="flex items-center space-x-1">
                                <Globe size={12} className="text-gray-400" />
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                  {click.referrer || 'Direct'}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">Time</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(click.clicked_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {click.utm_source && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                {click.utm_source && <span>Source: {click.utm_source}</span>}
                                {click.utm_medium && <span>Medium: {click.utm_medium}</span>}
                                {click.utm_campaign && <span>Campaign: {click.utm_campaign}</span>}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    {detailedClicks.pagination && detailedClicks.pagination.pages > 1 && (
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, detailedClicks.pagination.total)} of {detailedClicks.pagination.total} clicks
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                            Page {currentPage} of {detailedClicks.pagination.pages}
                          </span>
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(detailedClicks.pagination.pages, prev + 1))}
                            disabled={currentPage === detailedClicks.pagination.pages}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Globe size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No detailed click data yet</p>
                    <p className="text-sm">Click details will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/admin/articles/new"
            className="flex items-center space-x-3 p-4 bg-admin-accent/10 rounded-lg hover:bg-admin-accent/20 transition-colors"
          >
            <FileText size={20} className="text-admin-accent" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">New Article</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create content</p>
            </div>
          </Link>
          
          <Link
            to="/admin/categories"
            className="flex items-center space-x-3 p-4 bg-admin-accent/10 rounded-lg hover:bg-admin-accent/20 transition-colors"
          >
            <BarChart3 size={20} className="text-admin-accent" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Categories</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Organize content</p>
            </div>
          </Link>
          
          <Link
            to="/admin/users"
            className="flex items-center space-x-3 p-4 bg-admin-accent/10 rounded-lg hover:bg-admin-accent/20 transition-colors"
          >
            <Users size={20} className="text-admin-accent" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">User Management</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage team</p>
            </div>
          </Link>
          
          <Link
            to="/admin/settings"
            className="flex items-center space-x-3 p-4 bg-admin-accent/10 rounded-lg hover:bg-admin-accent/20 transition-colors"
          >
            <Settings size={20} className="text-admin-accent" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Settings</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure platform</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}