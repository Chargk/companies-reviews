const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Company = require('./models/Company');
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : '*',
}));
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Review routes
app.use('/api/reviews', reviewRoutes);
// MongoDB connection
// Seed data
const seedCompanies = require('./seedData');

// Run seed after MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    if (process.env.SEED_DB === 'true') {
      console.log('🌱 Seeding companies...');
      await seedCompanies();
    }
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date() });
});

// Get all companies
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json({ data: companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get company by ID
app.get('/api/companies/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ data: company });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Create company (for testing)
app.post('/api/companies', async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json({ data: company });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(400).json({ error: 'Failed to create company' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` Companies: http://localhost:${PORT}/api/companies`);
});
