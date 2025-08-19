import React from 'react';
import { generateEmbedHtml, validateMediaUrl, detectMediaType } from '../utils/mediaUtils';

export default function MediaTest() {
  const testUrls = [
    'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://soundcloud.com/artist/track-name',
    'https://example.com/image.jpg'
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Media Test Component</h2>
      
      {testUrls.map((url, index) => {
        const mediaType = detectMediaType(url);
        const validation = validateMediaUrl(url, mediaType || 'image');
        const embedHtml = generateEmbedHtml(url, mediaType || 'image');
        
        return (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">Test URL {index + 1}</h3>
            <p className="text-sm text-gray-600">{url}</p>
            <p className="text-sm">
              <strong>Detected Type:</strong> {mediaType || 'unknown'}
            </p>
            <p className="text-sm">
              <strong>Valid:</strong> {validation.isValid ? '✅ Yes' : '❌ No'}
              {validation.error && <span className="text-red-500 ml-2">({validation.error})</span>}
            </p>
            {embedHtml && (
              <div className="mt-4">
                <strong>Generated HTML:</strong>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                  {embedHtml}
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
