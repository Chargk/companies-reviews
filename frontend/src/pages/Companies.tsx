import React, { useState } from 'react';
import { Star, Search } from 'lucide-react';
import { useCompanies } from '../hooks/useCompanies';
import { Company } from '../types';
import { Link } from 'react-router-dom';

export const Companies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const { data: companiesData, isLoading, error } = useCompanies();

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error loading companies</div>;

  const companies = companiesData?.data || [];

  const filteredCompanies = companies.filter((company: Company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === '' || company.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const industries = Array.from(new Set(companies.map((company: Company) => company.industry))) as string[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Companies</h1>
        <p className="text-gray-600">Find a company that suits you</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Industries</option>
              {industries.map((industry: string) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company: Company) => (
          <div key={company.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium">{company.averageRating}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{company.description}</p>
            
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="font-medium">Industry:</span>
                <span className="ml-2">{company.industry}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Location:</span>
                <span className="ml-2">{company.location}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Reviews:</span>
                <span className="ml-2">{company.reviewCount} reviews</span>
              </div>
            </div>
            
            <Link 
              to={`/companies/${company.id}`}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors block text-center"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No companies found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
