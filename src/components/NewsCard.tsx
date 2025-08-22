'use client'

import { Clock, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ImageUploadService } from '../lib/uploadService'
import { generateEmbedHtml, extractSpotifyTrackId, extractYouTubeVideoId, extractSoundCloudTrackPath, extractBeatportTrackId } from '../utils/mediaUtils'

interface NewsCardProps {
  id: string
  title: string
  excerpt: string
  image: string
  embeddedMedia?: string
  mediaType?: 'image' | 'spotify' | 'youtube' | 'soundcloud' | 'beatport'
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
  embeddedMedia,
  mediaType = 'image',
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

  // Function to render media content with priority for embedded media
  const renderMedia = () => {
    // Priority: embedded media over image
    if (embeddedMedia && mediaType !== 'image') {
      switch (mediaType) {
        case 'spotify': {
          const trackId = extractSpotifyTrackId(embeddedMedia);
          if (!trackId) return null;
          return (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <iframe 
                style={{borderRadius: '12px'}} 
                src={`https://open.spotify.com/embed/track/${trackId}`}
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                className="w-full h-full"
              />
            </div>
          );
        }
        
        case 'youtube': {
          const videoId = extractYouTubeVideoId(embeddedMedia);
          if (!videoId) return null;
          return (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <iframe 
                width="100%" 
                height="200" 
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          );
        }
        
        case 'soundcloud': {
          const trackPath = extractSoundCloudTrackPath(embeddedMedia);
          console.log('🔍 NewsCard SoundCloud - embeddedMedia:', embeddedMedia, 'trackPath:', trackPath);
          if (!trackPath) return null;
          const iframeSrc = `https://w.soundcloud.com/player/?url=https://${trackPath}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&buying=false&liking=false&download=false&sharing=false&show_artwork=true&show_playcount=true&show_user=true&hide_related=false&visual=true&start_track=0`;
          console.log('🔍 NewsCard SoundCloud - iframeSrc:', iframeSrc);
          return (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <iframe 
                width="100%" 
                height="166" 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay" 
                src={iframeSrc}
                className="w-full h-full"
                onError={(e) => {
                  console.error('SoundCloud iframe failed to load:', iframeSrc);
                  console.error('Error event:', e);
                }}
                onLoad={() => {
                  console.log('SoundCloud iframe loaded successfully:', iframeSrc);
                }}
              />
            </div>
          );
        }
        
        case 'beatport': {
          const trackId = extractBeatportTrackId(embeddedMedia);
          console.log('🔍 NewsCard Beatport - embeddedMedia:', embeddedMedia, 'trackId:', trackId);
          if (!trackId) return null;
          const iframeSrc = `https://embed.beatport.com/track/${trackId}?color=ff5500&bgcolor=000000&autoplay=false&show_artwork=true&show_playcount=true&show_user=true&hide_related=false&visual=true&start_track=0`;
          console.log('🔍 NewsCard Beatport - iframeSrc:', iframeSrc);
          return (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <iframe 
                width="100%" 
                height="166" 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay" 
                src={iframeSrc}
                className="w-full h-full"
                onError={(e) => {
                  console.error('Beatport iframe failed to load:', iframeSrc);
                  console.error('Error event:', e);
                }}
                onLoad={() => {
                  console.log('Beatport iframe loaded successfully:', iframeSrc);
                }}
              />
            </div>
          );
        }
        
        default:
          return null;
      }
    }

    // Fallback to image if no embedded media
    if (mediaType === 'image' && image) {
      return (
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
      );
    }

    // Fallback to placeholder if no media
    return (
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🎵</div>
          <p className="text-sm">Media Preview</p>
        </div>
      </div>
    );
  };

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
            {renderMedia()}
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
          {renderMedia()}
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