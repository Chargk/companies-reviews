import React, { useState } from 'react';
import { CreateReviewData } from '../types';
import { StarRating } from './StarRating';
import { reviewService } from '../api/services';

interface ReviewFormProps {
  companyId: string;
  companyName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ 
  companyId, 
  companyName, 
  onSuccess, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<CreateReviewData>({
    company: companyId,
    rating: 0,
    title: '',
    comment: '',
    pros: '',
    cons: '',
    workEnvironment: undefined,
    workLifeBalance: undefined,
    salary: undefined,
    isRecommended: true,
    position: '',
    employmentType: undefined,
    experienceLength: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue === '' ? undefined : finalValue
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleRecommendationChange = (isRecommended: boolean) => {
    setFormData(prev => ({ ...prev, isRecommended }));
  };

  const validateForm = (): string | null => {
    if (formData.rating === 0) return 'Please select a rating';
    if (!formData.title.trim()) return 'Please enter a review title';
    if (!formData.comment.trim()) return 'Please enter review text';
    if (formData.title.length > 100) return 'Title cannot be longer than 100 characters';
    if (formData.comment.length > 1000) return 'Comment cannot be longer than 1000 characters';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.createReview(formData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Review creation error:', err);
      setError(err.response?.data?.error || 'Error creating review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Write a Review for {companyName}</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
            Overall Rating *
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={handleRatingChange}
            size="lg"
            showValue={true}
          />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
            Review Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-100"
            placeholder="Brief summary of your experience"
          />
          <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">{formData.title.length}/100 characters</p>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
            Detailed Review *
          </label>
          <textarea
            id="comment"
            name="comment"
            required
            value={formData.comment}
            onChange={handleInputChange}
            maxLength={1000}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-100"
            placeholder="Tell us about your experience working at this company..."
          />
          <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">{formData.comment.length}/1000 characters</p>
        </div>

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pros" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
              Pros
            </label>
            <textarea
              id="pros"
              name="pros"
              value={formData.pros}
              onChange={handleInputChange}
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-100"
              placeholder="What you liked..."
            />
          </div>
          <div>
            <label htmlFor="cons" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
              Cons
            </label>
            <textarea
              id="cons"
              name="cons"
              value={formData.cons}
              onChange={handleInputChange}
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-100"
              placeholder="What could be improved..."
            />
          </div>
        </div>

        {/* Work details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
              Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-100"
              placeholder="e.g. Senior Developer"
            />
          </div>
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
              Employment Type
            </label>
            <select
              id="employmentType"
              name="employmentType"
              value={formData.employmentType || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            >
              <option value="">Select type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div>

        {/* Experience length */}
        <div>
          <label htmlFor="experienceLength" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
            How long did you work at the company?
          </label>
          <select
            id="experienceLength"
            name="experienceLength"
            value={formData.experienceLength || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          >
            <option value="">Select period</option>
            <option value="less-than-1-year">Less than 1 year</option>
            <option value="1-2-years">1-2 years</option>
            <option value="3-5-years">3-5 years</option>
            <option value="5-10-years">5-10 years</option>
            <option value="more-than-10-years">More than 10 years</option>
          </select>
        </div>

        {/* Work aspects */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-100">Rate Work Aspects</h4>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Work Environment */}
            <div>
              <label htmlFor="workEnvironment" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
                Work Environment
              </label>
              <select
                id="workEnvironment"
                name="workEnvironment"
                value={formData.workEnvironment || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="">Don't rate</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            {/* Work-Life Balance */}
            <div>
              <label htmlFor="workLifeBalance" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
                Work-Life Balance
              </label>
              <select
                id="workLifeBalance"
                name="workLifeBalance"
                value={formData.workLifeBalance || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="">Don't rate</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            {/* Salary */}
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
                Salary
              </label>
              <select
                id="salary"
                name="salary"
                value={formData.salary || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="">Don't rate</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-200">
            Would you recommend this company to others? *
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleRecommendationChange(true)}
              className={`px-6 py-2 rounded-md border font-medium transition-colors ${
                formData.isRecommended
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              ✅ Yes, I recommend
            </button>
            <button
              type="button"
              onClick={() => handleRecommendationChange(false)}
              className={`px-6 py-2 rounded-md border font-medium transition-colors ${
                !formData.isRecommended
                  ? 'bg-red-100 border-red-500 text-red-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              ❌ No, I don't recommend
            </button>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Publishing review...
              </div>
            ) : (
              'Publish Review'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};