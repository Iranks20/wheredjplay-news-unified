'use client'

import React, { useState } from 'react'
import { X, ExternalLink, Star, Users, Music } from 'lucide-react'
import { getAssetPath } from '../lib/utils'

interface DJLinkAdProps {
  format?: 'sidebar' | 'banner' | 'inline'
  className?: string
}

export default function DJLinkAd({ format = 'sidebar', className = '' }: DJLinkAdProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleClose = () => setIsVisible(false)

  if (format === 'banner') {
    return (
      <div className={`bg-wdp-accent text-wdp-background p-4 relative ${className}`}>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-wdp-background/80 hover:text-wdp-background transition-colors"
          aria-label="Close ad"
        >
          <X size={16} />
        </button>
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center space-x-4">
            <img 
              src={getAssetPath('images/ads/djlinkme_advert_banner.png')} 
              alt="DJLink.me" 
              className="h-12 w-auto"
            />
            <div>
              <h3 className="font-bold text-lg">🎧 Create Your DJ Profile</h3>
              <p className="text-wdp-background/90">Join thousands of DJs on DJLink.me</p>
            </div>
          </div>
          <a
            href="https://djlink.me"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-wdp-background text-wdp-accent px-6 py-2 rounded-lg font-semibold hover:bg-wdp-background/90 transition-colors flex items-center space-x-2"
          >
            <span>Get Started</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    )
  }

  if (format === 'inline') {
    return (
      <div className={`bg-gray-50 dark:bg-wdp-surface border border-gray-200 dark:border-wdp-muted rounded-xl p-6 relative ${className}`}>
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 dark:text-wdp-text/60 hover:text-gray-600 dark:hover:text-wdp-text transition-colors"
          aria-label="Close ad"
        >
          <X size={16} />
        </button>
        <div className="text-center">
          <div className="w-16 h-16 bg-wdp-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Music size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-wdp-text mb-2">
            Are you a DJ?
          </h3>
          <p className="text-gray-600 dark:text-wdp-text/80 mb-4">
            Create your professional DJ profile and connect with venues, promoters, and fans worldwide.
          </p>
          <div className="flex items-center justify-center space-x-6 mb-4 text-sm text-gray-500 dark:text-wdp-text/60">
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span>50K+ DJs</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star size={16} />
              <span>4.9/5 Rating</span>
            </div>
          </div>
          <a
            href="https://djlink.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-wdp-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-wdp-accent-hover transition-all duration-200"
          >
            <span>Create Profile</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    )
  }

  // Default sidebar format
  return (
    <div className={`bg-white dark:bg-wdp-surface border border-gray-200 dark:border-wdp-muted rounded-xl p-6 sticky top-24 ${className}`}>
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 text-gray-400 dark:text-wdp-text/60 hover:text-gray-600 dark:hover:text-wdp-text transition-colors"
        aria-label="Close ad"
      >
        <X size={16} />
      </button>
      
      <div className="text-center">
        <div className="w-12 h-12 bg-wdp-accent rounded-lg flex items-center justify-center mx-auto mb-4">
          <Music size={20} className="text-white" />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-wdp-text mb-2">
          DJLink.me
        </h3>
        
        <p className="text-gray-600 dark:text-wdp-text/80 text-sm mb-4">
          Find out more about DJLink.me a new platform helping Djs to get Booked.
        </p>
        
        <div className="space-y-2 mb-4 text-xs text-gray-500 dark:text-wdp-text/60">
          <div className="flex items-center justify-center space-x-1">
            <Users size={12} />
            <span>50,000+ Active DJs</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <Star size={12} />
            <span>Trusted by Industry Pros</span>
          </div>
        </div>
        
        <a
          href="https://djlink.me"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-wdp-accent text-white py-2 px-4 rounded-lg font-semibold hover:bg-wdp-accent-hover transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
        >
          <span>Join Now</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  )
}