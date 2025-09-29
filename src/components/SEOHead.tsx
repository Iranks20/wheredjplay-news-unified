import { useEffect } from 'react'
import { getAssetPath } from '../lib/utils'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  noindex?: boolean
  canonical?: string
}

export default function SEOHead({
  title = 'WhereDJsPlay - Electronic Music News',
  description = 'Latest electronic music news, artist interviews, and industry updates',
  keywords = 'electronic music, DJ, techno, house, EDM, music news',
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  canonical
}: SEOHeadProps) {
  useEffect(() => {
    const baseUrl = 'https://wheredjsplay.com'
    const fullUrl = url ? `${baseUrl}${url}` : baseUrl
    const fullImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}/images/og-image.jpg`
    const canonicalUrl = canonical ? (canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`) : fullUrl

    // Update document title
    document.title = title

    // Helper function to update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement
      
      if (!meta) {
        meta = document.createElement('meta')
        if (isProperty) {
          meta.setAttribute('property', property)
        } else {
          meta.setAttribute('name', property)
        }
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Basic meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('author', author || 'WhereDJsPlay')
    updateMetaTag('robots', noindex ? 'noindex,nofollow' : 'index,follow')

    // Open Graph tags
    updateMetaTag('og:type', type, true)
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:url', fullUrl, true)
    updateMetaTag('og:image', fullImage, true)
    updateMetaTag('og:image:width', '1200', true)
    updateMetaTag('og:image:height', '630', true)
    updateMetaTag('og:site_name', 'WhereDJsPlay', true)
    updateMetaTag('og:locale', 'en_US', true)

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', fullImage)
    updateMetaTag('twitter:site', '@wheredjsplay')
    updateMetaTag('twitter:creator', '@wheredjsplay')

    // Article-specific meta tags
    if (type === 'article') {
      if (author) updateMetaTag('article:author', author, true)
      if (publishedTime) updateMetaTag('article:published_time', publishedTime, true)
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, true)
      if (section) updateMetaTag('article:section', section, true)
      tags.forEach(tag => {
        const meta = document.createElement('meta')
        meta.setAttribute('property', 'article:tag')
        meta.setAttribute('content', tag)
        document.head.appendChild(meta)
      })
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', canonicalUrl)

    // Structured data for articles
    if (type === 'article' && author && publishedTime) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: fullImage,
        author: {
          '@type': 'Person',
          name: author
        },
        publisher: {
          '@type': 'Organization',
          name: 'WhereDJsPlay',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/images/logos/wheredjsplay_logo.PNG`
          }
        },
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': fullUrl
        }
      }

      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]')
      if (existingScript) {
        existingScript.remove()
      }

      // Add new structured data
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }

    // Cleanup function
    return () => {
      // Remove article tags that were added dynamically
      const articleTags = document.querySelectorAll('meta[property="article:tag"]')
      articleTags.forEach(tag => tag.remove())
    }
  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime, section, tags, noindex, canonical])

  return null
}
