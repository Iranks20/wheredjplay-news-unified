'use client'

import React, { useState, useEffect } from 'react'
import { X, Mail, Star } from 'lucide-react'
import { SubscribersService } from '../lib/api'

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError('')

    try {
      const response = await SubscribersService.subscribe(email, name || undefined)
      
      if (!response.error) {
        setIsSubmitted(true)
        setTimeout(() => {
          onClose()
          setIsSubmitted(false)
          setEmail('')
          setName('')
        }, 3000)
      } else {
        setError(response.message || 'Failed to subscribe. Please try again.')
      }
    } catch (error: any) {
      console.error('Newsletter subscription error:', error)
      setError(error.message || 'Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-wdp-surface rounded-2xl max-w-md w-full shadow-2xl transform transition-all duration-300 border border-gray-200 dark:border-wdp-muted">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 dark:text-wdp-text/60 hover:text-gray-600 dark:hover:text-wdp-text transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {!isSubmitted ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-wdp-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-wdp-text mb-2">
                  Stay in the Loop
                </h2>
                <p className="text-gray-600 dark:text-wdp-text/80">
                  Get the hottest electronic music news, exclusive interviews, and industry insights delivered to your inbox every week.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-wdp-text/70">
                  <Star size={16} className="text-wdp-accent" />
                  <span>Exclusive artist interviews</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-wdp-text/70">
                  <Star size={16} className="text-wdp-accent" />
                  <span>Festival & event previews</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-wdp-text/70">
                  <Star size={16} className="text-wdp-accent" />
                  <span>New gear & tech reviews</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-wdp-text/70">
                  <Star size={16} className="text-wdp-accent" />
                  <span>Industry insider tips</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-wdp-muted rounded-lg focus:ring-2 focus:ring-wdp-accent focus:border-transparent dark:bg-wdp-muted dark:text-wdp-text transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-wdp-muted rounded-lg focus:ring-2 focus:ring-wdp-accent focus:border-transparent dark:bg-wdp-muted dark:text-wdp-text transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                {error && (
                  <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-wdp-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-wdp-accent-hover transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe Now'}
                </button>
              </form>

              <p className="text-xs text-gray-500 dark:text-wdp-text/50 text-center mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-wdp-text mb-2">
                Welcome to the Family!
              </h2>
              <p className="text-gray-600 dark:text-wdp-text/80">
                You're now subscribed to our newsletter. Check your inbox for the latest updates!
              </p>
              <p className="text-sm text-gray-500 dark:text-wdp-text/60 mt-2">
                We'll send you the hottest electronic music news and exclusive content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}