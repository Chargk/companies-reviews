import React, { useState } from 'react';
import { Review } from '../types';
import { StarDisplay } from './StarRating';
import { useAuth } from '../contexts/AuthContext';
import { reviewService } from '../api/services';

interface ReviewCardProps {
  review: Review;
  onVoteUpdate?: (reviewId: string, newVotes: { helpful: number; unhelpful: number; userVote: string | null }) => void;
  showCompany?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ 
  review, 
  onVoteUpdate,
  showCompany = false 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState<'helpful' | 'unhelpful' | null>(null);
  const [votes, setVotes] = useState({
    helpful: review.helpfulVotes,
    unhelpful: review.unhelpfulVotes
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatExperienceLength = (length?: string) => {
    const map: Record<string, string> = {
      'less-than-1-year': 'Less than 1 year',
      '1-2-years': '1-2 years',
      '3-5-years': '3-5 years',
      '5-10-years': '5-10 years',
      'more-than-10-years': 'More than 10 years'
    };
    return length ? map[length] : '';
  };

  const formatEmploymentType = (type?: string) => {
    const map: Record<string, string> = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'contract': 'Contract',
      'internship': 'Internship',
      'freelance': 'Freelance'
    };
    return type ? map[type] : '';
  };

  const formatWorkAspect = (aspect?: string) => {
    const map: Record<string, { text: string; color: string }> = {
      'excellent': { text: 'Excellent', color: 'text-green-600 bg-green-100' },
      'good': { text: 'Good', color: 'text-blue-600 bg-blue-100' },
      'fair': { text: 'Fair', color: 'text-yellow-600 bg-yellow-100' },
      'poor': { text: 'Poor', color: 'text-red-600 bg-red-100' }
    };
    return aspect ? map[aspect] : null;
  };

  const handleVote = async (voteType: 'helpful' | 'unhelpful') => {
    if (!isAuthenticated || !user) {
      alert('Please log in to vote on reviews');
      return;
    }

    if (review.user.id === user.id) {
      alert('You cannot vote on your own review');
      return;
    }

    setIsVoting(true);
    try {
      const response = await reviewService.voteOnReview(review.id, voteType);
      
      setVotes({
        helpful: response.data.helpfulVotes,
        unhelpful: response.data.unhelpfulVotes
      });
      setUserVote(response.data.userVote);
      
      if (onVoteUpdate) {
        onVoteUpdate(review.id, {
          helpful: response.data.helpfulVotes,
          unhelpful: response.data.unhelpfulVotes,
          userVote: response.data.userVote
        });
      }
    } catch (error: any) {
      console.error('Voting error:', error);
      alert(error.response?.data?.error || 'Error while voting');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            {review.user.firstName[0]}{review.user.lastName[0]}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {review.user.firstName} {review.user.lastName}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{formatDate(review.createdAt)}</span>
              {review.position && (
                <>
                  <span>•</span>
                  <span>{review.position}</span>
                </>
              )}
              {review.experienceLength && (
                <>
                  <span>•</span>
                  <span>{formatExperienceLength(review.experienceLength)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <StarDisplay rating={review.rating} size="sm" showValue={false} />
          <span className="text-lg font-semibold text-gray-900">{review.rating}</span>
          {review.isVerified && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
              ✓ Verified
            </span>
          )}
        </div>
      </div>

      {/* Company name if needed */}
      {showCompany && (
        <div className="mb-3">
          <span className="text-sm font-medium text-blue-600">{review.company.name}</span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {review.title}
      </h3>

      {/* Main comment */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {review.comment}
      </p>

      {/* Pros and Cons */}
      {(review.pros || review.cons) && (
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {review.pros && (
            <div>
              <h5 className="font-medium text-green-700 mb-2 flex items-center">
                <span className="mr-1">👍</span> Pros
              </h5>
              <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-md">
                {review.pros}
              </p>
            </div>
          )}
          {review.cons && (
            <div>
              <h5 className="font-medium text-red-700 mb-2 flex items-center">
                <span className="mr-1">👎</span> Cons
              </h5>
              <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-md">
                {review.cons}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Work aspects */}
      {(review.workEnvironment || review.workLifeBalance || review.salary) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.workEnvironment && (
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600">Work Environment:</span>
              <span className={`text-xs px-2 py-1 rounded-full ${formatWorkAspect(review.workEnvironment)?.color}`}>
                {formatWorkAspect(review.workEnvironment)?.text}
              </span>
            </div>
          )}
          {review.workLifeBalance && (
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600">Work-life balance:</span>
              <span className={`text-xs px-2 py-1 rounded-full ${formatWorkAspect(review.workLifeBalance)?.color}`}>
                {formatWorkAspect(review.workLifeBalance)?.text}
              </span>
            </div>
          )}
          {review.salary && (
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600">Salary:</span>
              <span className={`text-xs px-2 py-1 rounded-full ${formatWorkAspect(review.salary)?.color}`}>
                {formatWorkAspect(review.salary)?.text}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Employment details */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
        {review.employmentType && (
          <span>📋 {formatEmploymentType(review.employmentType)}</span>
        )}
                  <span className={`flex items-center ${review.isRecommended ? 'text-green-600' : 'text-red-600'}`}>
            {review.isRecommended ? '✅ Recommends' : '❌ Doesn\'t recommend'}
          </span>
      </div>

      {/* Voting */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleVote('helpful')}
            disabled={isVoting || !isAuthenticated || review.user.id === user?.id}
            className={`
              flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors
              ${userVote === 'helpful' 
                ? 'bg-green-100 text-green-700' 
                : 'text-gray-600 hover:bg-gray-100'
              }
              ${isVoting || !isAuthenticated || review.user.id === user?.id 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer'
              }
            `}
          >
            <span>👍</span>
            <span>Helpful</span>
            <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-xs">
              {votes.helpful}
            </span>
          </button>
          
          <button
            onClick={() => handleVote('unhelpful')}
            disabled={isVoting || !isAuthenticated || review.user.id === user?.id}
            className={`
              flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors
              ${userVote === 'unhelpful' 
                ? 'bg-red-100 text-red-700' 
                : 'text-gray-600 hover:bg-gray-100'
              }
              ${isVoting || !isAuthenticated || review.user.id === user?.id 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer'
              }
            `}
          >
            <span>👎</span>
            <span>Not helpful</span>
            <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-xs">
              {votes.unhelpful}
            </span>
          </button>
        </div>

        {!isAuthenticated && (
          <span className="text-xs text-gray-400">Log in to vote</span>
        )}
      </div>
    </div>
  );
};