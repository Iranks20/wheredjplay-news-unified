'use client'

import React, { useEffect } from 'react';
import { 
  Eye, 
  Users, 
  FileText, 
  Clock, 
  BarChart3,
  Settings,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { AnalyticsService } from '../lib/api';

export default function Dashboard() {
  const { data: analytics, loading, error, execute } = useApi();

  useEffect(() => {
    execute(() => AnalyticsService.getDashboard());
  }, [execute]);

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
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Error loading dashboard data
            </p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const stats = analytics?.overview ? [
    {
      name: 'Total Articles',
      value: analytics.overview.totalArticles?.toLocaleString() || '0',
      change: '+12%',
      changeType: 'positive',
      icon: FileText
    },
    {
      name: 'Total Views',
      value: analytics.overview.totalViews?.toLocaleString() || '0',
      change: '+8.1%',
      changeType: 'positive',
      icon: Eye
    },
    {
      name: 'Active Users',
      value: analytics.overview.totalUsers?.toLocaleString() || '0',
      change: '+5.2%',
      changeType: 'positive',
      icon: Users
    },
    {
      name: 'Recent Articles',
      value: analytics.overview.recentArticles?.toString() || '0',
      change: '+15.3%',
      changeType: 'positive',
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
                </div>
                <div className="w-12 h-12 bg-admin-accent/10 rounded-lg flex items-center justify-center">
                  <Icon size={24} className="text-admin-accent" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-admin-success' : 'text-admin-error'
                }`}>
                  {stat.change}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Articles</h2>
              <Link to="/admin/articles" className="text-admin-accent hover:text-admin-accent-hover text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentArticles.length > 0 ? (
                recentArticles.map((article: any) => (
                  <div key={article.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {article.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                          {article.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{article.category_name}</span>
                        <span>•</span>
                        <span>{article.author_name}</span>
                        <span>•</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{article.views?.toLocaleString() || '0'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">views</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No articles yet</p>
                  <p className="text-sm">Create your first article to see it here</p>
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
                topCategories.map((category: any, index: number) => (
                  <div key={category.name} className="flex items-center justify-between">
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
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{category.total_views?.toLocaleString() || '0'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">views</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No categories yet</p>
                  <p className="text-sm">Create categories to see analytics</p>
                </div>
              )}
            </div>
          </div>
        </div>
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
              <h3 className="font-medium text-gray-900 dark:text-white">Write Article</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create new content</p>
            </div>
          </Link>
          
          <Link
            to="/admin/categories"
            className="flex items-center space-x-3 p-4 bg-admin-accent/10 rounded-lg hover:bg-admin-accent/20 transition-colors"
          >
            <BarChart3 size={20} className="text-admin-accent" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Manage Categories</h3>
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