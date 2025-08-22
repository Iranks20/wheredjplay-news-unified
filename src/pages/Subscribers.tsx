'use client'

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Users, 
  UserCheck, 
  UserX, 
  Calendar,
  Send,
  Plus
} from 'lucide-react';
import { SubscribersService } from '../lib/api';
import { useApiWithPagination } from '../hooks/useApi';
import { toast } from 'sonner';
import NewsletterCampaignModal from '../components/NewsletterCampaignModal';

export default function Subscribers() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: '',
    search: ''
  });

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const { data: subscribers, loading, error, execute } = useApiWithPagination();
  const { data: campaigns, loading: campaignsLoading, execute: executeCampaigns } = useApiWithPagination();

  useEffect(() => {
    loadSubscribers();
    loadStats();
  }, [filters, execute]);

  const loadSubscribers = () => {
    console.log('Loading subscribers with filters:', filters);
    execute(() => SubscribersService.getSubscribers(filters));
  };

  // Debug logging
  useEffect(() => {
    console.log('Subscribers data:', subscribers);
    console.log('Subscribers loading:', loading);
    console.log('Subscribers error:', error);
    console.log('Subscribers length:', subscribers?.length);
    console.log('Subscribers type:', typeof subscribers);
    console.log('Subscribers is array:', Array.isArray(subscribers));
  }, [subscribers, loading, error]);

  const loadStats = async () => {
    try {
      const response = await SubscribersService.getSubscriberStats();
      if (!response.error) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadCampaigns = () => {
    executeCampaigns(() => SubscribersService.getNewsletterCampaigns({ page: 1, limit: 10 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDelete = async (subscriberId: number) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      const response = await SubscribersService.deleteSubscriber(subscriberId);
      if (!response.error) {
        toast.success('Subscriber deleted successfully');
        loadSubscribers();
        loadStats();
      } else {
        toast.error(response.message || 'Failed to delete subscriber');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete subscriber');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'unsubscribed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter Subscribers</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your newsletter subscribers and campaigns</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCampaignModal(true)}
            className="flex items-center space-x-2 bg-admin-accent text-white px-4 py-2 rounded-lg hover:bg-admin-accent-hover transition-colors"
          >
            <Send size={16} />
            <span>Send Newsletter</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total_subscribers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <UserCheck size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.active_subscribers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <UserX size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unsubscribed</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.unsubscribed_subscribers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">New This Week</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.new_this_week}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">New This Month</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.new_this_month}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-admin-accent focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>
        </div>
      </div>



      {/* Subscribers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Subscriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Subscribed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Emails Sent
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading subscribers...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                    Failed to load subscribers: {error}
                  </td>
                </tr>
              ) : subscribers?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                subscribers?.map((subscriber: any) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {subscriber.email}
                        </div>
                        {subscriber.name && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {subscriber.name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscriber.status)}`}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(subscriber.subscribed_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {subscriber.last_email_sent ? formatDate(subscriber.last_email_sent) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {subscriber.email_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(subscriber.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {subscribers?.pagination && subscribers.pagination.pages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === subscribers.pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{' '}
                    <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(filters.page * filters.limit, subscribers.pagination.total)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{subscribers.pagination.total}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: subscribers.pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === filters.page
                            ? 'z-10 bg-admin-accent border-admin-accent text-white'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Newsletter Campaign Modal */}
      <NewsletterCampaignModal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        onSuccess={() => {
          setShowCampaignModal(false);
          loadCampaigns();
          toast.success('Newsletter campaign sent successfully!');
        }}
      />
    </div>
  );
}
