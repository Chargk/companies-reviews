import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Users, Globe, Filter } from 'lucide-react';
import { useCompany } from '../hooks/useCompanies';
import { useAuth } from '../contexts/AuthContext';
import { reviewService } from '../api/services';
import { Review, ReviewStats } from '../types';
import { StarDisplay } from '../components/StarRating';
import { ReviewCard } from '../components/ReviewCard';
import { ReviewForm } from '../components/ReviewForm';

export const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: companyData, isLoading, error } = useCompany(id!);
  const { isAuthenticated } = useAuth();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating-desc' | 'rating-asc' | 'helpful'>('newest');

  // Load reviews
  useEffect(() => {
    const loadData = async () => {
      if (id) {
        await loadReviews();
        await loadReviewStats();
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentPage, sortBy]);

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await reviewService.getCompanyReviews(id!, {
        page: currentPage,
        limit: 10,
        sort: sortBy
      });
      setReviews(response.data);
      setTotalPages(response.pagination.total);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadReviewStats = async () => {
    try {
      const response = await reviewService.getCompanyReviewStats(id!);
      setReviewStats(response.data);
    } catch (error) {
      console.error('Error loading review stats:', error);
    }
  };

  const handleVoteUpdate = (reviewId: string, newVotes: { helpful: number; unhelpful: number; userVote: string | null }) => {
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === reviewId 
          ? { ...review, helpfulVotes: newVotes.helpful, unhelpfulVotes: newVotes.unhelpful }
          : review
      )
    );
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setCurrentPage(1); // Reset to first page to show new review
    // Reload reviews and stats
    loadReviews();
    loadReviewStats();
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error loading company</div>;
  if (!companyData?.data) return <div className="text-center py-8">Company not found</div>;

  const company = companyData.data;

  return (
    <div className="space-y-8">
      {/* Company Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{company.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>{company.employees} employees</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center mb-2">
              <StarDisplay rating={company.averageRating} size="md" showValue={false} />
              <span className="ml-2 text-2xl font-bold">{company.averageRating.toFixed(1)}</span>
            </div>
            <p className="text-gray-600">{company.reviewCount} reviews</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{company.description}</p>
        
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Industry:</span>
            <p className="text-gray-600">{company.industry}</p>
          </div>
          <div>
            <span className="font-medium">Founded:</span>
            <p className="text-gray-600">{company.founded}</p>
          </div>
          <div>
            <span className="font-medium">Revenue:</span>
            <p className="text-gray-600">{company.revenue}</p>
          </div>
        </div>

        {company.website && (
          <div className="mt-4">
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <Globe className="h-4 w-4 mr-2" />
              Visit Website
            </a>
          </div>
        )}
      </div>

      {/* Review Statistics */}
      {reviewStats && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Review Statistics</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Rating breakdown */}
            <div>
              <h4 className="font-medium mb-3">Rating Distribution</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center">
                    <span className="w-4 text-sm">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current mx-2" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ 
                          width: `${reviewStats.totalReviews > 0 ? (reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution] / reviewStats.totalReviews) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Summary stats */}
            <div>
              <h4 className="font-medium mb-3">Overall Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Average Rating:</span>
                  <span className="font-medium">{reviewStats.averageRating.toFixed(1)}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Reviews:</span>
                  <span className="font-medium">{reviewStats.totalReviews}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recommend:</span>
                  <span className="font-medium text-green-600">{reviewStats.recommendationRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
          {isAuthenticated ? (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          ) : (
            <p className="text-gray-500">Log in to write a review</p>
          )}
        </div>

        {showReviewForm && (
          <div className="mb-6">
            <ReviewForm
              companyId={company.id}
              companyName={company.name}
              onSuccess={handleReviewSuccess}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}

        {/* Sort controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="rating-desc">Highest Rating</option>
              <option value="rating-asc">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Reviews list */}
        {reviewsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map(review => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                onVoteUpdate={handleVoteUpdate}
              />
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews for this company yet</p>
            {isAuthenticated && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Be the first to leave a review!
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
