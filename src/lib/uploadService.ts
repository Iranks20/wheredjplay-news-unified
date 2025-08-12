// Simple, reliable image upload service

// Use the same API configuration as the main API
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://13.60.95.22:3001',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Helper function to construct API URL (same as main API)
const getApiUrl = (endpoint: string) => {
  const baseUrl = API_CONFIG.BASE_URL;
  // If the base URL already includes /api/v1, don't add it again
  if (baseUrl.includes('/api/v1')) {
    return `${baseUrl}${endpoint}`;
  }
  // Otherwise, add the /api/v1 prefix
  return `${baseUrl}/api/v1${endpoint}`;
};

// Helper function to get the base URL for images (without /api/v1)
const getImageBaseUrl = () => {
  const baseUrl = API_CONFIG.BASE_URL;
  // Remove /api/v1 from the base URL for images
  return baseUrl.replace('/api/v1', '');
};

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
    fullUrl: string;
  };
}

export class ImageUploadService {
  
  /**
   * Upload an image file
   */
  static async uploadImage(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('auth-token');
      
      const response = await fetch(getApiUrl('/upload/image'), {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      });

      const result = await response.json();
      
      console.log('Upload response:', result);
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Get full image URL from relative path
   */
  static getImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null;
    
    console.log('getImageUrl - Input:', imagePath);
    console.log('getImageUrl - API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
    console.log('getImageUrl - Image base URL:', getImageBaseUrl());
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('getImageUrl - Full URL detected, returning as is:', imagePath);
      return imagePath;
    }
    
    // If it's a base64 data URL, return as is
    if (imagePath.startsWith('data:')) {
      console.log('getImageUrl - Base64 URL detected, returning as is:', imagePath);
      return imagePath;
    }
    
    // If it's a relative path starting with /uploads, construct the full URL
    if (imagePath.startsWith('/uploads/')) {
      const fullUrl = `${getImageBaseUrl()}${imagePath}`;
      console.log('getImageUrl - /uploads path, constructed URL:', fullUrl);
      return fullUrl;
    }
    
    // If it's a relative path starting with /images, construct the full URL
    if (imagePath.startsWith('/images/')) {
      const fullUrl = `${getImageBaseUrl()}${imagePath}`;
      console.log('getImageUrl - /images path, constructed URL:', fullUrl);
      return fullUrl;
    }
    
    // If it doesn't start with /, add it
    const fullUrl = `${getImageBaseUrl()}/${imagePath}`;
    console.log('getImageUrl - Other path, constructed URL:', fullUrl);
    return fullUrl;
  }

  /**
   * Test if an image URL is accessible
   */
  static async testImageUrl(imageUrl: string): Promise<boolean> {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Image URL test failed:', imageUrl, error);
      return false;
    }
  }

  /**
   * Get image URL with fallback placeholder - Enhanced version
   */
  static getImageUrlWithFallback(imagePath: string | null | undefined): string {
    if (!imagePath) {
      console.log('getImageUrlWithFallback - No image path provided, using placeholder');
      return 'https://via.placeholder.com/800x400/e5e7eb/6b7280?text=No+Image';
    }
    
    console.log('=== IMAGE URL DEBUGGING ===');
    console.log('getImageUrlWithFallback - Input:', imagePath);
    console.log('getImageUrlWithFallback - API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
    console.log('getImageUrlWithFallback - Image base URL:', getImageBaseUrl());
    console.log('getImageUrlWithFallback - Environment:', import.meta.env.MODE);
    
    // If it's already a full URL, check if it's from the same origin
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('getImageUrlWithFallback - Full URL detected:', imagePath);
      
      try {
        // If the URL is from the same origin as our API, it should work
        const url = new URL(imagePath);
        const apiUrl = new URL(getImageBaseUrl());
        
        console.log('getImageUrlWithFallback - URL origin:', url.origin);
        console.log('getImageUrlWithFallback - API origin:', apiUrl.origin);
        
        if (url.origin === apiUrl.origin) {
          console.log('getImageUrlWithFallback - Same origin, returning as is:', imagePath);
          return imagePath;
        } else {
          console.log('getImageUrlWithFallback - Different origin, this might cause CORS issues');
          // For different origins, we might need to proxy or handle differently
          return imagePath;
        }
      } catch (error) {
        console.error('getImageUrlWithFallback - Error parsing URL:', error);
        return imagePath;
      }
    }
    
    // If it's a base64 data URL, return as is
    if (imagePath.startsWith('data:')) {
      console.log('getImageUrlWithFallback - Base64 URL detected, returning as is:', imagePath);
      return imagePath;
    }
    
    // If it's a relative path starting with /uploads, construct the full URL
    if (imagePath.startsWith('/uploads/')) {
      const fullUrl = `${getImageBaseUrl()}${imagePath}`;
      console.log('getImageUrlWithFallback - /uploads path, constructed URL:', fullUrl);
      return fullUrl;
    }
    
    // If it's a relative path starting with /images, construct the full URL
    if (imagePath.startsWith('/images/')) {
      const fullUrl = `${getImageBaseUrl()}${imagePath}`;
      console.log('getImageUrlWithFallback - /images path, constructed URL:', fullUrl);
      return fullUrl;
    }
    
    // If it doesn't start with /, add it
    const fullUrl = `${getImageBaseUrl()}/${imagePath}`;
    console.log('getImageUrlWithFallback - Other path, constructed URL:', fullUrl);
    console.log('=== END IMAGE URL DEBUGGING ===');
    return fullUrl;
  }
}
