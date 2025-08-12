'use client'

import { Clock, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ImageUploadService } from '../lib/uploadService'

interface NewsCardProps {
  id: string
  title: string
  excerpt: string
  image: string
  category: string
  author: string
  publishedAt: string
  readTime: string
  featured?: boolean
  className?: string
}

export default function NewsCard({
  id,
  title,
  excerpt,
  image,
  category,
  author,
  publishedAt,
  readTime,
  featured = false,
  className = ''
}: NewsCardProps) {
  const categoryColors = {
    'Artist News': 'bg-wdp-accent/20 text-wdp-accent',
    'Event Reports': 'bg-wdp-accent/20 text-wdp-accent',
    'Gear & Tech': 'bg-wdp-accent/20 text-wdp-accent',
    'Trending Tracks': 'bg-wdp-accent/20 text-wdp-accent',
    'Industry News': 'bg-wdp-accent/20 text-wdp-accent',
    'Education News': 'bg-wdp-accent/20 text-wdp-accent'
  }

  const getCategoryColor = (cat: string) => {
    return categoryColors[cat as keyof typeof categoryColors] || 'bg-wdp-accent/20 text-wdp-accent'
  }

  // Get the proper image URL using the ImageUploadService
  const imageUrl = ImageUploadService.getImageUrlWithFallback(image);

  // Debug logging
  console.log('NewsCard - Original image:', image);
  console.log('NewsCard - Processed imageUrl:', imageUrl);

  // Test image accessibility (only in development)
  if (import.meta.env.DEV) {
    // Test the image URL manually
    fetch(imageUrl, { method: 'HEAD' })
      .then(response => {
        console.log('🔍 Image accessibility test:', imageUrl, 'Status:', response.status, 'OK:', response.ok);
        if (!response.ok) {
          console.error('❌ Image not accessible:', imageUrl, 'Status:', response.status);
        }
      })
      .catch(error => {
        console.error('❌ Image accessibility test failed:', imageUrl, error);
      });
  }

  if (featured) {
    return (
      <Link to={`/article/${id}`} className={`group block ${className}`}>
        <article className="bg-white dark:bg-wdp-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-wdp-muted">
          <div className="relative h-64 sm:h-80 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                console.error('Image failed to load:', image);
                console.error('Image URL:', imageUrl);
                console.error('Error event:', e);
                e.currentTarget.src = 'https://via.placeholder.com/800x400/e5e7eb/6b7280?text=Image+Not+Found';
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', imageUrl);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getCategoryColor(category)}`}>
                {category}
              </span>
              <h2 className="text-white text-2xl font-bold leading-tight mb-2 group-hover:text-wdp-accent transition-colors">
                {title}
              </h2>
              <p className="text-gray-200 text-sm line-clamp-2">
                {excerpt}
              </p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-wdp-text/60">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User size={14} />
                  <span>{author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{readTime}</span>
                </div>
              </div>
              <span>{publishedAt}</span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link to={`/article/${id}`} className={`group block ${className}`}>
      <article className="bg-white dark:bg-wdp-surface rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-wdp-muted">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error('Image failed to load:', image);
              console.error('Image URL:', imageUrl);
              console.error('Error event:', e);
              e.currentTarget.src = 'https://via.placeholder.com/800x400/e5e7eb/6b7280?text=Image+Not+Found';
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', imageUrl);
            }}
          />
          <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-wdp-text mb-2 line-clamp-2 group-hover:text-wdp-accent transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-wdp-text/80 text-sm mb-4 line-clamp-3">
            {excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-wdp-text/60">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <User size={12} />
                <span>{author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{readTime}</span>
              </div>
            </div>
            <span>{publishedAt}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}