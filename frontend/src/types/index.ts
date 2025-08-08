export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  averageRating: number;
  reviewCount: number;
  description: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'user' | 'admin' | 'moderator';
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface Review {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  company: {
    id: string;
    name: string;
  };
  rating: number;
  title: string;
  comment: string;
  pros?: string;
  cons?: string;
  workEnvironment?: 'excellent' | 'good' | 'fair' | 'poor';
  workLifeBalance?: 'excellent' | 'good' | 'fair' | 'poor';
  salary?: 'excellent' | 'good' | 'fair' | 'poor';
  isRecommended: boolean;
  position?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  experienceLength?: 'less-than-1-year' | '1-2-years' | '3-5-years' | '5-10-years' | 'more-than-10-years';
  isVerified: boolean;
  helpfulVotes: number;
  unhelpfulVotes: number;
  totalVotes: number;
  helpfulnessRatio: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  company: string;
  rating: number;
  title: string;
  comment: string;
  pros?: string;
  cons?: string;
  workEnvironment?: 'excellent' | 'good' | 'fair' | 'poor';
  workLifeBalance?: 'excellent' | 'good' | 'fair' | 'poor';
  salary?: 'excellent' | 'good' | 'fair' | 'poor';
  isRecommended: boolean;
  position?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  experienceLength?: 'less-than-1-year' | '1-2-years' | '3-5-years' | '5-10-years' | 'more-than-10-years';
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recommendationRate: number;
}

export interface ReviewsResponse {
  data: Review[];
  pagination: {
    current: number;
    total: number;
    limit: number;
    totalReviews: number;
  };
}

export interface VoteResponse {
  message: string;
  data: {
    helpfulVotes: number;
    unhelpfulVotes: number;
    userVote: 'helpful' | 'unhelpful' | null;
  };
}
