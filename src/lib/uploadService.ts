// Simple, reliable image upload service

const API_BASE_URL = 'http://localhost:3001';

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
      
      const response = await fetch(`${API_BASE_URL}/api/v1/upload/image`, {
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
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a base64 data URL, return as is
    if (imagePath.startsWith('data:')) {
      return imagePath;
    }
    
    // If it's a relative path starting with /uploads, construct the full URL
    if (imagePath.startsWith('/uploads/')) {
      return `${API_BASE_URL}${imagePath}`;
    }
    
    // If it's a relative path starting with /images, construct the full URL
    if (imagePath.startsWith('/images/')) {
      return `${API_BASE_URL}${imagePath}`;
    }
    
    // If it doesn't start with /, add it
    return `${API_BASE_URL}/${imagePath}`;
  }

  /**
   * Get image URL with fallback placeholder
   */
  static getImageUrlWithFallback(imagePath: string | null | undefined): string {
    const imageUrl = this.getImageUrl(imagePath);
    return imageUrl || 'https://via.placeholder.com/800x400/e5e7eb/6b7280?text=No+Image';
  }
}
