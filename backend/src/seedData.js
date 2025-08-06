const Company = require('./models/Company');

const seedCompanies = async () => {
  try {
    const existingCompanies = await Company.countDocuments();
    if (existingCompanies > 0) {
      console.log('Companies already exist, skipping seed');
      return;
    }

    const companies = [
      {
        name: 'TechCorp',
        industry: 'Technology',
        location: 'San Francisco, CA',
        description: 'Leading technology company specializing in software development, cloud solutions, and digital transformation.',
        website: 'https://techcorp.com',
        founded: '2010',
        employees: '500-1000',
        revenue: '$100M+',
        averageRating: 4.8,
        reviewCount: 124
      },
      {
        name: 'InnovateSoft',
        industry: 'Software Development',
        location: 'New York, NY',
        description: 'Innovative software solutions for modern businesses. We help companies digitize and optimize their operations.',
        website: 'https://innovatesoft.com',
        founded: '2015',
        employees: '200-500',
        revenue: '$50M+',
        averageRating: 4.6,
        reviewCount: 89
      },
      {
        name: 'DataFlow',
        industry: 'Data Analytics',
        location: 'Austin, TX',
        description: 'Advanced data analytics and business intelligence solutions. We turn data into actionable insights.',
        website: 'https://dataflow.com',
        founded: '2012',
        employees: '100-250',
        revenue: '$25M+',
        averageRating: 4.5,
        reviewCount: 67
      },
      {
        name: 'CloudTech',
        industry: 'Cloud Services',
        location: 'Seattle, WA',
        description: 'Cloud infrastructure and platform services. We help businesses scale with reliable cloud solutions.',
        website: 'https://cloudtech.com',
        founded: '2018',
        employees: '300-600',
        revenue: '$75M+',
        averageRating: 4.7,
        reviewCount: 156
      },
      {
        name: 'MobileFirst',
        industry: 'Mobile Development',
        location: 'Boston, MA',
        description: 'Mobile app development and consulting services. We create engaging mobile experiences.',
        website: 'https://mobilefirst.com',
        founded: '2016',
        employees: '150-300',
        revenue: '$30M+',
        averageRating: 4.4,
        reviewCount: 78
      },
      {
        name: 'SecureNet',
        industry: 'Cybersecurity',
        location: 'Washington, DC',
        description: 'Enterprise cybersecurity and network protection. We keep your business safe in the digital world.',
        website: 'https://securenet.com',
        founded: '2013',
        employees: '400-800',
        revenue: '$90M+',
        averageRating: 4.9,
        reviewCount: 203
      }
    ];

    await Company.insertMany(companies);
    console.log('✅ Test companies created successfully!');
  } catch (error) {
    console.error('Error seeding companies:', error);
  }
};

module.exports = seedCompanies;
