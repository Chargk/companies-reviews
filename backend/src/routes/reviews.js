const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Company = require('../models/Company');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all reviews for a company with pagination
router.get('/company/:companyId', optionalAuth, async (req, res) => {
  try {
    const { companyId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || '-createdAt'; // Default: newest first

    const skip = (page - 1) * limit;

    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Build sort object
    let sortOptions = {};
    switch (sort) {
      case 'rating-desc':
        sortOptions = { rating: -1, createdAt: -1 };
        break;
      case 'rating-asc':
        sortOptions = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        sortOptions = { helpfulVotes: -1, createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      default: // 'newest'
        sortOptions = { createdAt: -1 };
    }

    const reviews = await Review.find({ company: companyId })
      .populate('user', 'firstName lastName username')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ company: companyId });
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: reviews,
      pagination: {
        current: page,
        total: totalPages,
        limit,
        totalReviews: total
      }
    });

  } catch (error) {
    console.error('Error fetching company reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get all reviews by a user
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: userId })
      .populate('company', 'name industry location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ user: userId });
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: reviews,
      pagination: {
        current: page,
        total: totalPages,
        limit,
        totalReviews: total
      }
    });

  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

// Create a new review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      company,
      rating,
      title,
      comment,
      pros,
      cons,
      workEnvironment,
      workLifeBalance,
      salary,
      isRecommended,
      position,
      employmentType,
      experienceLength
    } = req.body;

    // Check if company exists
    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Check if user already reviewed this company
    const existingReview = await Review.findOne({
      user: req.user._id,
      company: company
    });

    if (existingReview) {
      return res.status(400).json({ 
        error: 'You have already reviewed this company. You can edit your existing review instead.' 
      });
    }

    // Create new review
    const review = new Review({
      user: req.user._id,
      company,
      rating,
      title,
      comment,
      pros,
      cons,
      workEnvironment,
      workLifeBalance,
      salary,
      isRecommended,
      position,
      employmentType,
      experienceLength
    });

    await review.save();

    // Populate user and company data for response
    await review.populate('user', 'firstName lastName username');
    await review.populate('company', 'name');

    res.status(201).json({
      message: 'Review created successfully',
      data: review
    });

  } catch (error) {
    console.error('Error creating review:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'You have already reviewed this company' 
      });
    }

    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Update a review (only by author)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rating,
      title,
      comment,
      pros,
      cons,
      workEnvironment,
      workLifeBalance,
      salary,
      isRecommended,
      position,
      employmentType,
      experienceLength
    } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user is the author
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only edit your own reviews' });
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        rating,
        title,
        comment,
        pros,
        cons,
        workEnvironment,
        workLifeBalance,
        salary,
        isRecommended,
        position,
        employmentType,
        experienceLength
      },
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName username')
     .populate('company', 'name');

    res.json({
      message: 'Review updated successfully',
      data: updatedReview
    });

  } catch (error) {
    console.error('Error updating review:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }

    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete a review (only by author or admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user is the author or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }

    await Review.findByIdAndDelete(id);

    res.json({ message: 'Review deleted successfully' });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Vote on review helpfulness
router.post('/:id/vote', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body; // 'helpful' or 'unhelpful'

    if (!['helpful', 'unhelpful'].includes(vote)) {
      return res.status(400).json({ error: 'Vote must be either "helpful" or "unhelpful"' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user is trying to vote on their own review
    if (review.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot vote on your own review' });
    }

    // Check if user has already voted
    const existingVoteIndex = review.votedUsers.findIndex(
      v => v.user.toString() === req.user._id.toString()
    );

    if (existingVoteIndex !== -1) {
      const existingVote = review.votedUsers[existingVoteIndex].vote;
      
      // If same vote, remove it (toggle)
      if (existingVote === vote) {
        review.votedUsers.splice(existingVoteIndex, 1);
        if (vote === 'helpful') {
          review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
        } else {
          review.unhelpfulVotes = Math.max(0, review.unhelpfulVotes - 1);
        }
      } else {
        // Change vote
        review.votedUsers[existingVoteIndex].vote = vote;
        if (vote === 'helpful') {
          review.helpfulVotes += 1;
          review.unhelpfulVotes = Math.max(0, review.unhelpfulVotes - 1);
        } else {
          review.unhelpfulVotes += 1;
          review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
        }
      }
    } else {
      // New vote
      review.votedUsers.push({
        user: req.user._id,
        vote: vote
      });
      
      if (vote === 'helpful') {
        review.helpfulVotes += 1;
      } else {
        review.unhelpfulVotes += 1;
      }
    }

    await review.save();

    res.json({
      message: 'Vote recorded successfully',
      data: {
        helpfulVotes: review.helpfulVotes,
        unhelpfulVotes: review.unhelpfulVotes,
        userVote: review.votedUsers.find(v => v.user.toString() === req.user._id.toString())?.vote || null
      }
    });

  } catch (error) {
    console.error('Error voting on review:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// Get review statistics for a company
router.get('/company/:companyId/stats', async (req, res) => {
  try {
    const { companyId } = req.params;

    const stats = await Review.aggregate([
      { $match: { company: new mongoose.Types.ObjectId(companyId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          },
          recommendationRate: {
            $avg: { $cond: ['$isRecommended', 1, 0] }
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        data: {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          recommendationRate: 0
        }
      });
    }

    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratingDistribution.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });

    res.json({
      data: {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        totalReviews: stats[0].totalReviews,
        ratingDistribution: distribution,
        recommendationRate: Math.round(stats[0].recommendationRate * 100)
      }
    });

  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ error: 'Failed to fetch review statistics' });
  }
});

module.exports = router;