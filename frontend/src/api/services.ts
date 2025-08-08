import api from './client';
import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  User,
  Review,
  CreateReviewData,
  ReviewStats,
  ReviewsResponse,
  VoteResponse 
} from '../types';

export const companyService = {
  getCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  getCompany: async (id: string) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

export const reviewService = {
  // Get reviews for a company
  getCompanyReviews: async (
    companyId: string, 
    params?: {
      page?: number;
      limit?: number;
      sort?: 'newest' | 'oldest' | 'rating-desc' | 'rating-asc' | 'helpful';
    }
  ): Promise<ReviewsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sort) searchParams.append('sort', params.sort);
    
    const response = await api.get(`/reviews/company/${companyId}?${searchParams}`);
    return response.data;
  },

  // Get reviews by user
  getUserReviews: async (
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ReviewsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const response = await api.get(`/reviews/user/${userId}?${searchParams}`);
    return response.data;
  },

  // Create a new review
  createReview: async (reviewData: CreateReviewData): Promise<{ message: string; data: Review }> => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId: string, reviewData: Partial<CreateReviewData>): Promise<{ message: string; data: Review }> => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // Vote on review helpfulness
  voteOnReview: async (reviewId: string, vote: 'helpful' | 'unhelpful'): Promise<VoteResponse> => {
    const response = await api.post(`/reviews/${reviewId}/vote`, { vote });
    return response.data;
  },

  // Get review statistics for a company
  getCompanyReviewStats: async (companyId: string): Promise<{ data: ReviewStats }> => {
    const response = await api.get(`/reviews/company/${companyId}/stats`);
    return response.data;
  },
};