'use client'

import React, { useState, useEffect } from 'react'
import { Copy, Link as LinkIcon, Check, ExternalLink, Share2, X, Globe, BarChart3 } from 'lucide-react'
import { ShortLinksService } from '../lib/api'
import { toast } from 'sonner'

interface ShortLinkProps {
  articleId?: number
  articleSlug: string | null | undefined
  articleTitle: string
  className?: string
  variant?: 'inline' | 'modal'
}

export default function ShortLink({ 
  articleId, 
  articleSlug, 
  articleTitle, 
  className = '',
  variant = 'inline'
}: ShortLinkProps) {
  const [shortLinkCopied, setShortLinkCopied] = useState(false)
  const [fullLinkCopied, setFullLinkCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [shortLinkData, setShortLinkData] = useState<{
    short_link: string
    short_slug: string
    full_url: string
    click_count: number
    created_at: string
  } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAutoGenerating, setIsAutoGenerating] = useState(false)
  const [utmParams, setUtmParams] = useState({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: ''
  })

  // Don't render if no slug is provided
  if (!articleSlug) {
    return null
  }

  // Generate short link based on slug (fallback)
  const generateShortLink = (slug: string) => {
    const baseUrl = window.location.origin
    return `${baseUrl}/s/${slug}`
  }

  const fallbackShortLink = generateShortLink(articleSlug)
  
  // Generate full link with UTM parameters for tracking
  const generateFullLinkWithUTM = () => {
    const baseUrl = `${window.location.origin}/wdjpnews/article/${articleSlug}`
    const urlParams = new URLSearchParams()
    
    // Add UTM parameters if they exist
    if (utmParams.utm_source) urlParams.append('utm_source', utmParams.utm_source)
    if (utmParams.utm_medium) urlParams.append('utm_medium', utmParams.utm_medium)
    if (utmParams.utm_campaign) urlParams.append('utm_campaign', utmParams.utm_campaign)
    if (utmParams.utm_term) urlParams.append('utm_term', utmParams.utm_term)
    if (utmParams.utm_content) urlParams.append('utm_content', utmParams.utm_content)
    
    // Add default UTM parameters if none are set
    if (!utmParams.utm_source) urlParams.append('utm_source', 'direct_share')
    if (!utmParams.utm_medium) urlParams.append('utm_medium', 'copy_link')
    if (!utmParams.utm_campaign) urlParams.append('utm_campaign', 'article_sharing')
    
    return urlParams.toString() ? `${baseUrl}?${urlParams.toString()}` : baseUrl
  }
  
  const fullLink = generateFullLinkWithUTM()

  // Generate canonical short link from backend
  const generateCanonicalShortLink = async () => {
    if (!articleId) return

    setIsGenerating(true)
    try {
      const response = await ShortLinksService.generateShortLink(articleId, utmParams)
      if (!response.error) {
        setShortLinkData(response.data)
        toast.success('Short link generated successfully!')
      } else {
        throw new Error(response.message || 'Failed to generate short link')
      }
    } catch (error: any) {
      console.error('Failed to generate short link:', error)
      toast.error(error.message || 'Failed to generate short link')
    } finally {
      setIsGenerating(false)
    }
  }

  // Copy to clipboard with fallback
  const copyToClipboard = async (text: string, setCopied: (value: boolean) => void) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
      toast.error('Failed to copy link')
    }
  }

  const handleCopyShortLink = () => {
    const linkToCopy = shortLinkData?.short_link || fallbackShortLink
    copyToClipboard(linkToCopy, setShortLinkCopied)
  }

  const handleCopyFullLink = () => {
    copyToClipboard(fullLink, setFullLinkCopied)
  }

  const handleOpenLink = () => {
    const linkToOpen = shortLinkData?.short_link || fallbackShortLink
    window.open(linkToOpen, '_blank', 'noopener,noreferrer')
  }

  const handleUtmChange = (field: string, value: string) => {
    setUtmParams(prev => ({ ...prev, [field]: value }))
  }

  // Fetch existing short links when component mounts (if articleId is available)
  useEffect(() => {
    if (articleId && !shortLinkData && !isAutoGenerating) {
      fetchExistingShortLinks()
    }
  }, [articleId])

  const fetchExistingShortLinks = async () => {
    if (!articleId) return

    setIsAutoGenerating(true)
    try {
      const response = await ShortLinksService.getArticleShortLinks(articleId)
      if (!response.error && response.data && response.data.length > 0) {
        // Use the most recent short link
        setShortLinkData(response.data[0])
      } else {
        // No existing short links, generate one automatically
        await autoGenerateShortLink()
      }
    } catch (error: any) {
      console.error('Failed to fetch existing short links:', error)
      // Fallback to auto-generate
      await autoGenerateShortLink()
    } finally {
      setIsAutoGenerating(false)
    }
  }

  const autoGenerateShortLink = async () => {
    if (!articleId) return

    try {
      const response = await ShortLinksService.generateShortLink(articleId, {
        utm_source: 'automatic',
        utm_medium: 'share',
        utm_campaign: 'auto_tracking'
      })
      if (!response.error) {
        setShortLinkData(response.data)
      }
    } catch (error: any) {
      console.error('Failed to auto-generate short link:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          text: `Check out this article: ${articleTitle}`,
          url: shortLinkData?.short_link || fallbackShortLink
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    } else {
      setIsModalOpen(true)
    }
  }

  if (!isVisible) return null

  const currentShortLink = shortLinkData?.short_link || fallbackShortLink

  if (variant === 'modal') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`inline-flex items-center space-x-2 px-4 py-2 bg-wdp-accent text-white rounded-lg hover:bg-wdp-accent-hover transition-colors ${className}`}
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>

        {/* Share Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl transform transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-wdp-accent rounded-full flex items-center justify-center">
                      <Share2 size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Share Article
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {articleTitle}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* UTM Parameters */}
                  {articleId && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                        <BarChart3 size={16} />
                        <span>UTM Parameters (Optional)</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Source
                          </label>
                          <input
                            type="text"
                            value={utmParams.utm_source}
                            onChange={(e) => handleUtmChange('utm_source', e.target.value)}
                            placeholder="e.g., facebook, twitter"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Medium
                          </label>
                          <input
                            type="text"
                            value={utmParams.utm_medium}
                            onChange={(e) => handleUtmChange('utm_medium', e.target.value)}
                            placeholder="e.g., social, email"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Campaign
                          </label>
                          <input
                            type="text"
                            value={utmParams.utm_campaign}
                            onChange={(e) => handleUtmChange('utm_campaign', e.target.value)}
                            placeholder="e.g., spring_sale"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Term
                          </label>
                          <input
                            type="text"
                            value={utmParams.utm_term}
                            onChange={(e) => handleUtmChange('utm_term', e.target.value)}
                            placeholder="e.g., electronic_music"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                          />
                        </div>
                      </div>
                      {articleId && (
                        <button
                          onClick={generateCanonicalShortLink}
                          disabled={isGenerating}
                          className="mt-3 px-4 py-2 bg-wdp-accent text-white rounded-lg hover:bg-wdp-accent-hover transition-colors disabled:opacity-50 text-sm"
                        >
                          {isGenerating ? 'Generating...' : 'Generate Tracked Link'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Short Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-wdp-text mb-2">
                      Short Link
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={currentShortLink}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-wdp-muted border border-gray-200 dark:border-wdp-muted rounded-lg text-gray-900 dark:text-wdp-text"
                      />
                      <button
                        onClick={handleCopyShortLink}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          shortLinkCopied
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-wdp-accent text-white hover:bg-wdp-accent-hover'
                        }`}
                      >
                        {shortLinkCopied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                      <button
                        onClick={handleOpenLink}
                        className="px-3 py-2 bg-gray-100 dark:bg-wdp-muted text-gray-700 dark:text-wdp-text rounded-lg hover:bg-gray-200 dark:hover:bg-wdp-muted/80 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                    {shortLinkData && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {shortLinkData.click_count} clicks • Created {new Date(shortLinkData.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Full Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-wdp-text mb-2">
                      Full Link
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={fullLink}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-wdp-muted border border-gray-200 dark:border-wdp-muted rounded-lg text-gray-900 dark:text-wdp-text"
                      />
                      <button
                        onClick={handleCopyFullLink}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          fullLinkCopied
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-wdp-accent text-white hover:bg-wdp-accent-hover'
                        }`}
                      >
                        {fullLinkCopied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleShare}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-wdp-accent text-white rounded-lg hover:bg-wdp-accent-hover transition-colors"
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Inline variant
  return (
    <div className={`bg-white dark:bg-wdp-surface rounded-xl border border-gray-200 dark:border-wdp-muted p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <LinkIcon size={16} className="text-wdp-accent" />
          <span className="text-sm font-medium text-gray-900 dark:text-wdp-text">Short Link</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-wdp-text transition-colors"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        {/* Short Link */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-wdp-text/70 mb-1">
            Short Link
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentShortLink}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-wdp-muted border border-gray-200 dark:border-wdp-muted rounded-lg text-gray-900 dark:text-wdp-text"
            />
            <button
              onClick={handleCopyShortLink}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                shortLinkCopied
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-wdp-accent text-white hover:bg-wdp-accent-hover'
              }`}
            >
              {shortLinkCopied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <button
              onClick={handleOpenLink}
              className="px-3 py-2 bg-gray-100 dark:bg-wdp-muted text-gray-700 dark:text-wdp-text rounded-lg hover:bg-gray-200 dark:hover:bg-wdp-muted/80 transition-colors"
            >
              <ExternalLink size={14} />
            </button>
          </div>
          {shortLinkData && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {shortLinkData.click_count} clicks • Created {new Date(shortLinkData.created_at).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Full Link */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-wdp-text/70 mb-1">
            Full Link
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={fullLink}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-wdp-muted border border-gray-200 dark:border-wdp-muted rounded-lg text-gray-900 dark:text-wdp-text"
            />
            <button
              onClick={handleCopyFullLink}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                fullLinkCopied
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-wdp-accent text-white hover:bg-wdp-accent-hover'
              }`}
            >
              {fullLinkCopied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Generate Tracked Link Button */}
        {articleId && (
          <div className="pt-2 border-t border-gray-200 dark:border-wdp-muted">
            <button
              onClick={generateCanonicalShortLink}
              disabled={isGenerating}
              className="w-full px-4 py-2 bg-wdp-accent text-white rounded-lg hover:bg-wdp-accent-hover transition-colors disabled:opacity-50 text-sm"
            >
              {isGenerating ? 'Generating...' : 'Generate Tracked Link'}
            </button>
          </div>
        )}

        {/* Article Info */}
        <div className="pt-2 border-t border-gray-200 dark:border-wdp-muted">
          <p className="text-xs text-gray-500 dark:text-wdp-text/60 line-clamp-2">
            {articleTitle}
          </p>
        </div>
      </div>
    </div>
  )
}
