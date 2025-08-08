const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: function(value) {
        return Number.isInteger(value) || (value % 0.5 === 0);
      },
      message: 'Rating must be a whole number or half-number between 1 and 5'
    }
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  pros: {
    type: String,
    trim: true,
    maxlength: 500
  },
  cons: {
    type: String,
    trim: true,
    maxlength: 500
  },
  workEnvironment: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    required: false
  },
  workLifeBalance: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    required: false
  },
  salary: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    required: false
  },
  isRecommended: {
    type: Boolean,
    required: true
  },
  position: {
    type: String,
    trim: true,
    maxlength: 100
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: false
  },
  experienceLength: {
    type: String,
    enum: ['less-than-1-year', '1-2-years', '3-5-years', '5-10-years', 'more-than-10-years'],
    required: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  unhelpfulVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  votedUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vote: {
      type: String,
      enum: ['helpful', 'unhelpful']
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure one review per user per company
reviewSchema.index({ user: 1, company: 1 }, { unique: true });

// Virtual for total votes
reviewSchema.virtual('totalVotes').get(function() {
  return this.helpfulVotes + this.unhelpfulVotes;
});

// Virtual for helpfulness ratio
reviewSchema.virtual('helpfulnessRatio').get(function() {
  const total = this.totalVotes;
  return total > 0 ? this.helpfulVotes / total : 0;
});

// Static method to calculate average rating for a company
reviewSchema.statics.calculateAverageRating = async function(companyId) {
  const stats = await this.aggregate([
    { $match: { company: new mongoose.Types.ObjectId(companyId) } },
    {
      $group: {
        _id: '$company',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    const Company = mongoose.model('Company');
    await Company.findByIdAndUpdate(companyId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal
      reviewCount: stats[0].reviewCount
    });
  } else {
    const Company = mongoose.model('Company');
    await Company.findByIdAndUpdate(companyId, {
      averageRating: 0,
      reviewCount: 0
    });
  }
};

// Middleware to update company statistics after save
reviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.company);
});

// Middleware to update company statistics after remove
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.company);
  }
});

// Ensure virtual id field is included and _id is excluded in JSON
reviewSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Review', reviewSchema);