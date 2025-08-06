import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Users, Calendar, Globe } from 'lucide-react';
import { useCompany } from '../hooks/useCompanies';

export const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: companyData, isLoading, error } = useCompany(id!);
  const [showReviewForm, setShowReviewForm] = useState(false);

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
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-xl font-bold">{company.averageRating}</span>
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

      {/* Reviews Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {showReviewForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <p className="text-gray-600">Review form will be implemented later</p>
          </div>
        )}

        <div className="text-center py-8">
          <p className="text-gray-500">Reviews will be implemented later</p>
        </div>
      </div>
    </div>
  );
};
