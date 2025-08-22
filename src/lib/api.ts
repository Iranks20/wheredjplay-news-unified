// API Configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Helper function to construct API URL
const getApiUrl = (endpoint: string) => {
  const baseUrl = API_CONFIG.BASE_URL;
  // If the base URL already includes /api/v1, don't add it again
  if (baseUrl.includes('/api/v1')) {
    return `${baseUrl}${endpoint}`;
  }
  // Otherwise, add the /api/v1 prefix
  return `${baseUrl}/api/v1${endpoint}`;
};

// API Response Types
export interface ApiResponse<T = any> {
  error: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API Error Class
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// HTTP Client
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = getApiUrl(endpoint);
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || `HTTP ${response.status}`,
          errorData
        );
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }
      
      throw new ApiError(500, 'Network error');
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth-token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Generic HTTP methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          searchParams.append(key, params[key].toString());
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = getApiUrl(endpoint);
    const token = localStorage.getItem('auth-token');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || `HTTP ${response.status}`,
        errorData
      );
    }

    return response.json();
  }
}

// API Client Instance
const apiClient = new ApiClient();

// API Service Classes
export class AuthService {
  static async login(email: string, password: string) {
    return apiClient.post<{ user: any; token: string }>('/auth/login', {
      email,
      password,
    });
  }

  static async register(userData: { name: string; email: string; password: string; role?: string }) {
    return apiClient.post<{ user: any; token: string }>('/auth/register', userData);
  }

  static async getCurrentUser() {
    return apiClient.get<any>('/auth/me');
  }

  static async logout() {
    return apiClient.post('/auth/logout');
  }

  static async refreshToken() {
    return apiClient.post<{ token: string }>('/auth/refresh');
  }

  static async changePassword(currentPassword: string, newPassword: string) {
    return apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }
}

export class ArticlesService {
  static async getArticles(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    featured?: boolean;
    author_id?: number;
    sort?: string;
    order?: string;
  }) {
    return apiClient.get<PaginatedResponse<any>>('/articles', params);
  }

  static async getArticle(id: string | number) {
    return apiClient.get<any>(`/articles/${id}`);
  }

  static async createArticle(articleData: any) {
    return apiClient.post<any>('/articles', articleData);
  }

  static async updateArticle(id: string | number, articleData: any) {
    return apiClient.put<any>(`/articles/${id}`, articleData);
  }

  static async deleteArticle(id: string | number) {
    return apiClient.delete(`/articles/${id}`);
  }

  static async publishArticle(id: string | number) {
    return apiClient.post(`/articles/${id}/publish`);
  }

  static async unpublishArticle(id: string | number) {
    return apiClient.post(`/articles/${id}/unpublish`);
  }

  static async scheduleArticle(id: string | number, publishDate: string) {
    return apiClient.post(`/articles/${id}/schedule`, { publish_date: publishDate });
  }

  static async toggleFeatured(id: string | number) {
    return apiClient.post(`/articles/${id}/feature`);
  }

  static async toggleBreakingNews(id: string | number) {
    return apiClient.post(`/articles/${id}/breaking-news`);
  }

  static async toggleLatestHeadline(id: string | number) {
    return apiClient.post(`/articles/${id}/latest-headline`);
  }

  static async getFeaturedArticles(limit?: number) {
    return apiClient.get<any[]>('/articles/featured', { limit });
  }

  static async getBreakingNews(limit?: number) {
    return apiClient.get<any[]>('/articles/breaking-news', { limit });
  }

  static async getLatestHeadlines(limit?: number) {
    return apiClient.get<any[]>('/articles/latest-headlines', { limit });
  }
}

export class CategoriesService {
  static async getCategories() {
    return apiClient.get<any[]>('/categories');
  }

  static async getCategory(id: string | number) {
    return apiClient.get<any>(`/categories/${id}`);
  }

  static async createCategory(categoryData: any) {
    return apiClient.post<any>('/categories', categoryData);
  }

  static async updateCategory(id: string | number, categoryData: any) {
    return apiClient.put<any>(`/categories/${id}`, categoryData);
  }

  static async deleteCategory(id: string | number) {
    return apiClient.delete(`/categories/${id}`);
  }

  static async getCategoryArticles(id: string | number, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    return apiClient.get<PaginatedResponse<any>>(`/categories/${id}/articles`, params);
  }
}

export class UsersService {
  static async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
  }) {
    return apiClient.get<{ users: any[]; pagination: any }>('/users', params);
  }

  static async getAuthors() {
    return apiClient.get<{ users: any[] }>('/users/authors');
  }

  static async getUser(id: string | number) {
    return apiClient.get<any>(`/users/${id}`);
  }

  static async createUser(userData: any) {
    return apiClient.post<any>('/users', userData);
  }

  static async updateUser(id: string | number, userData: any) {
    return apiClient.put<any>(`/users/${id}`, userData);
  }

  static async deleteUser(id: string | number) {
    return apiClient.delete(`/users/${id}`);
  }

  static async updateUserStatus(id: string | number, status: 'active' | 'inactive') {
    return apiClient.put(`/users/${id}/status`, { status });
  }

  static async inviteUser(userData: { name: string; email: string; role?: string }) {
    return apiClient.post<any>('/users/invite', userData);
  }

  static async getUserArticles(id: string | number, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    return apiClient.get<PaginatedResponse<any>>(`/users/${id}/articles`, params);
  }
}

export class UploadService {
  static async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.upload<any>('/upload/image', formData);
  }

  static async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.upload<any>('/upload/avatar', formData);
  }

  static async deleteFile(filename: string) {
    return apiClient.delete(`/upload/${filename}`);
  }
}

export class AnalyticsService {
  static async getDashboard() {
    return apiClient.get<any>('/analytics/dashboard');
  }

  static async getArticleAnalytics(period?: number) {
    return apiClient.get<any>('/analytics/articles', { period });
  }

  static async getViewAnalytics(period?: number) {
    return apiClient.get<any>('/analytics/views', { period });
  }

  static async getPopularArticles(limit?: number, period?: number) {
    return apiClient.get<any[]>('/analytics/popular', { limit, period });
  }
}

export class SearchService {
  static async searchArticles(params: {
    q: string;
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<PaginatedResponse<any>>('/search/articles', params);
  }

  static async getSearchSuggestions(query: string) {
    return apiClient.get<any[]>('/search/suggestions', { q: query });
  }
}

export class NewsletterService {
  static async subscribe(email: string, name?: string) {
    return apiClient.post('/newsletter/subscribe', { email, name });
  }

  static async unsubscribe(email: string) {
    return apiClient.post('/newsletter/unsubscribe', { email });
  }
}

export class SubscribersService {
  static async subscribe(email: string, name?: string) {
    return apiClient.post<any>('/subscribers/subscribe', { email, name });
  }

  static async unsubscribe(email: string) {
    return apiClient.post<any>('/subscribers/unsubscribe', { email });
  }

  static async getSubscribers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    return apiClient.get<any>('/subscribers', params);
  }

  static async getSubscriberStats() {
    return apiClient.get<any>('/subscribers/stats');
  }

  static async deleteSubscriber(id: string | number) {
    return apiClient.delete<any>(`/subscribers/${id}`);
  }

  static async sendNewsletterCampaign(subject: string, content: string) {
    return apiClient.post<any>('/subscribers/send-campaign', { subject, content });
  }

  static async getNewsletterCampaigns(params?: {
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<any>('/subscribers/campaigns', params);
  }
}

export class SettingsService {
  static async getSettings() {
    return apiClient.get<any>('/settings');
  }

  static async updateSettings(settings: Record<string, any>) {
    return apiClient.put('/settings', settings);
  }
}



// Export API configuration for easy access
export const API_CONFIG_EXPORT = API_CONFIG;
