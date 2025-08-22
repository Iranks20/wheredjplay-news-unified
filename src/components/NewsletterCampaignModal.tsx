'use client'

import React, { useState } from 'react';
import { X, Send, Mail, Users, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { SubscribersService } from '../lib/api';
import { toast } from 'sonner';

interface NewsletterCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewsletterCampaignModal({ isOpen, onClose, onSuccess }: NewsletterCampaignModalProps) {
  const [formData, setFormData] = useState({
    subject: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  // Get subscriber count on modal open
  React.useEffect(() => {
    if (isOpen) {
      loadSubscriberCount();
    }
  }, [isOpen]);

  const loadSubscriberCount = async () => {
    try {
      const response = await SubscribersService.getSubscriberStats();
      if (!response.error) {
        setSubscriberCount(response.data.active_subscribers);
      }
    } catch (error) {
      console.error('Failed to load subscriber count:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!subscriberCount || subscriberCount === 0) {
      toast.error('No active subscribers found');
      return;
    }

    if (!confirm(`Are you sure you want to send this newsletter to ${subscriberCount} subscribers?`)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await SubscribersService.sendNewsletterCampaign(formData.subject, formData.content);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to send newsletter');
      }

      toast.success(response.message || 'Newsletter sent successfully!');
      setFormData({ subject: '', content: '' });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send newsletter');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ subject: '', content: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-7xl h-[95vh] shadow-2xl transform transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-admin-accent rounded-full flex items-center justify-center">
                <Send size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Send Newsletter Campaign
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create and send a newsletter to all active subscribers
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors disabled:opacity-50 p-2"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Subscriber Count Warning */}
          {subscriberCount !== null && (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  This newsletter will be sent to <strong>{subscriberCount}</strong> active subscribers.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col lg:flex-row">
            {/* Left Panel - Editor */}
            <div className="flex-1 flex flex-col min-h-0 lg:border-r lg:border-gray-200 lg:dark:border-gray-700">
              <div className="flex-shrink-0 p-4 sm:p-6 pb-0">
                {/* Subject Line */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject Line <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Enter newsletter subject"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-admin-accent focus:border-transparent text-sm"
                    required
                    disabled={isSubmitting}
                    maxLength={255}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.subject.length}/255 characters
                  </p>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Newsletter Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your newsletter content here... You can use HTML formatting for rich content."
                    className="w-full h-64 sm:h-80 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-admin-accent focus:border-transparent resize-none text-sm"
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    You can use HTML formatting for rich content
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 flex flex-col min-h-0 lg:max-w-md">
              <div className="flex-shrink-0 p-4 sm:p-6 pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Content Preview
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                  </button>
                </div>
              </div>
              
              {showPreview && (
                <div className="flex-1 min-h-0 p-4 sm:p-6 pt-0">
                  <div className="h-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 overflow-y-auto">
                    {formData.content ? (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div className="font-semibold mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                          {formData.subject || 'No subject'}
                        </div>
                        <div 
                          className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:dark:text-white prose-p:text-gray-600 prose-p:dark:text-gray-400"
                          dangerouslySetInnerHTML={{ __html: formData.content }}
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400 italic h-full flex items-center justify-center text-center">
                        Start typing to see a preview of your newsletter content...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-yellow-700 dark:text-yellow-300">
                Once sent, this newsletter cannot be recalled. Please review your content carefully before sending.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !subscriberCount || subscriberCount === 0}
              className="flex-1 px-4 py-2 bg-admin-accent text-white rounded-lg hover:bg-admin-accent-hover transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Newsletter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
