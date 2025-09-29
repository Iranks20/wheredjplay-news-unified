'use client'

import React, { useState, useEffect } from 'react'
import { Share2, Facebook, Twitter, Instagram, Linkedin, Link as LinkIcon, Copy, X } from 'lucide-react'
import { ShortLinksService } from '../lib/api'

interface SocialShareProps {
  url?: string
  title?: string
  description?: string
  image?: string
  className?: string
  articleId?: number
  articleSlug?: string
}

export default function SocialShare({ 
  url, 
  title = 'Check out this article on WhereDJsPlay',
  description = 'The latest in electronic music news and DJ culture',
  image,
  className = '',
  articleId,
  articleSlug
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [trackedUrl, setTrackedUrl] = useState<string | null>(null)
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)

  // Generate or fetch tracked short link
  useEffect(() => {
    const generateTrackedUrl = async () => {
      if (!articleId) {
        // Fallback to provided URL or current page URL
        setTrackedUrl(url || window.location.href)
        return
      }

      setIsLoadingUrl(true)
      try {
        // First try to get existing short links
        const existingResponse = await ShortLinksService.getArticleShortLinks(articleId)
        if (!existingResponse.error && existingResponse.data && existingResponse.data.length > 0) {
          setTrackedUrl(existingResponse.data[0].short_link)
        } else {
          // Generate new short link with social sharing UTM parameters
          const generateResponse = await ShortLinksService.generateShortLink(articleId, {
            utm_source: 'social_share',
            utm_medium: 'social',
            utm_campaign: 'article_sharing'
          })
          if (!generateResponse.error) {
            setTrackedUrl(generateResponse.data.short_link)
          } else {
            // Fallback to provided URL or current page URL
            setTrackedUrl(url || window.location.href)
          }
        }
      } catch (error) {
        console.error('Failed to get tracked URL:', error)
        // Fallback to provided URL or current page URL
        setTrackedUrl(url || window.location.href)
      } finally {
        setIsLoadingUrl(false)
      }
    }

    generateTrackedUrl()
  }, [articleId, url])

  const currentUrl = trackedUrl || url || window.location.href

  const shareData = {
    url: encodeURIComponent(currentUrl),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description)
  }

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}&quote=${shareData.title}`
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-blue-400',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
      url: `https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.title}&hashtags=WhereDJsPlay,ElectronicMusic,DJ`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}`
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'hover:bg-pink-50 dark:hover:bg-pink-900/20',
      url: '#',
      note: 'Copy link to share on Instagram'
    }
  ]

  const handleShare = (platform: any) => {
    if (platform.name === 'Instagram') {
      handleCopyLink()
      return
    }
    
    window.open(platform.url, '_blank', 'width=600,height=400')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: currentUrl
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      setIsOpen(true)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleNativeShare}
        className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Share"
      >
        <Share2 size={16} />
        <span className="text-sm font-medium">Share</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-[calc(100vw-2rem)] sm:w-72 md:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] overflow-y-auto right-[-1rem] sm:right-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share this article</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Social Platforms */}
            <div className="space-y-2 mb-4">
              {socialPlatforms.map((platform) => {
                const IconComponent = platform.icon
                return (
                  <button
                    key={platform.name}
                    onClick={() => handleShare(platform)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${platform.bgColor}`}
                  >
                    <IconComponent size={20} className={platform.color} />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        Share on {platform.name}
                      </div>
                      {platform.note && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {platform.note}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Copy Link */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={isLoadingUrl ? 'Loading tracked link...' : currentUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    copied
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Social Media Feed Integration */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Follow WhereDJsPlay</h4>
              <div className="flex items-center space-x-3">
                <a
                  href="https://facebook.com/wheredjsplay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://twitter.com/wheredjsplay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="https://instagram.com/wheredjsplay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://linkedin.com/company/wheredjsplay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}