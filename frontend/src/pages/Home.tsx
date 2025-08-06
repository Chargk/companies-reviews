import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, MessageSquare } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find the best companies to work for
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Learn about companies from first-hand experience. Read reviews from real employees and make informed decisions.
        </p>
        <Link 
          to="/companies" 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors"
        >
          View Companies
        </Link>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Honest reviews</h3>
          <p className="text-gray-600">Real reviews from real employees</p>
        </div>
        <div className="text-center">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Large community</h3>
          <p className="text-gray-600">Thousands of users sharing experience</p>
        </div>
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Detailed information</h3>
          <p className="text-gray-600">Pros and cons of each company</p>
        </div>
      </section>

      {/* Top Companies */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">Top Companies</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">TechCorp</h3>
            <div className="flex items-center mb-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm">4.8 (124 reviews)</span>
            </div>
            <p className="text-gray-600 text-sm">Technology company</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">InnovateSoft</h3>
            <div className="flex items-center mb-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm">4.6 (89 reviews)</span>
            </div>
            <p className="text-gray-600 text-sm">Software development</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">DataFlow</h3>
            <div className="flex items-center mb-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm">4.5 (67 reviews)</span>
            </div>
            <p className="text-gray-600 text-sm">Data analytics</p>
          </div>
        </div>
      </section>
    </div>
  );
};
