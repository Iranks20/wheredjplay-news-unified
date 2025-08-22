'use client'

import React, { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { SubscribersService } from '../lib/api';
import { toast } from 'sonner';

interface NewsletterSubscriptionProps {
  variant?: 'inline' | 'modal' | 'sidebar';
  className?: string;
  onSuccess?: () => void;
}

export default function NewsletterSubscription({ 
  variant = 'inline', 
  className = '',
  onSuccess 
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await SubscribersService.subscribe(email, name);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to subscribe');
      }

      toast.success(response.message || 'Successfully subscribed to newsletter!');
      setIsSubmitted(true);
      setEmail('');
      setName('');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to subscribe to newsletter');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'modal') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl ${className}`}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-wdp-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Stay in the Loop
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Get the latest electronic music news delivered to your inbox
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-wdp-accent focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-wdp-accent focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-wdp-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-wdp-accent-hover transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <Mail size={16} />
                  <span>Subscribe Now</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to the Family!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You're now subscribed to our newsletter. Check your inbox for the latest updates!
            </p>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 ${className}`}>
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-wdp-accent rounded-lg flex items-center justify-center mx-auto mb-3">
            <Mail size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Newsletter
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Get weekly updates delivered to your inbox
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-wdp-accent focus:border-transparent"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-wdp-accent text-white py-2 px-4 rounded-lg font-medium hover:bg-wdp-accent-hover transition-colors disabled:opacity-50 text-sm"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Check size={16} className="text-white" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Successfully subscribed!
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-6 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-wdp-accent rounded-lg flex items-center justify-center flex-shrink-0">
          <Mail size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            Get the latest electronic music news and updates delivered to your inbox
          </p>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-wdp-accent focus:border-transparent"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-wdp-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-wdp-accent-hover transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          ) : (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <Check size={16} />
              <span className="text-sm font-medium">Successfully subscribed!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
