const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  codeforcesHandle: {
    type: String,
    required: [true, 'Codeforces handle is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  currentRating: {
    type: Number,
    default: 0
  },
  maxRating: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    default: 'unrated'
  },
  maxRank: {
    type: String,
    default: 'unrated'
  },
  // Email preferences
  emailPreferences: {
    inactivityReminders: {
      type: Boolean,
      default: true
    },
    lastReminderSent: {
      type: Date,
      default: null
    },
    reminderCount: {
      type: Number,
      default: 0
    }
  },
  // Data tracking
  lastSubmissionDate: {
    type: Date,
    default: null
  },
  lastDataSync: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
studentSchema.index({ email: 1 });
studentSchema.index({ codeforcesHandle: 1 });
studentSchema.index({ currentRating: -1 });
studentSchema.index({ lastSubmissionDate: -1 });
studentSchema.index({ lastDataSync: -1 });

// Virtual for checking if student is inactive (no submissions in last 7 days)
studentSchema.virtual('isInactive').get(function() {
  if (!this.lastSubmissionDate) return true;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.lastSubmissionDate < sevenDaysAgo;
});

// Virtual for days since last submission
studentSchema.virtual('daysSinceLastSubmission').get(function() {
  if (!this.lastSubmissionDate) return null;
  const now = new Date();
  const diffTime = Math.abs(now - this.lastSubmissionDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update lastDataSync when codeforcesHandle changes
studentSchema.pre('save', function(next) {
  if (this.isModified('codeforcesHandle')) {
    this.lastDataSync = null; // Reset sync time to force new data fetch
  }
  next();
});

// Static method to find inactive students
studentSchema.statics.findInactiveStudents = function() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return this.find({
    'emailPreferences.inactivityReminders': true,
    $or: [
      { lastSubmissionDate: { $lt: sevenDaysAgo } },
      { lastSubmissionDate: null }
    ]
  });
};

// Instance method to update rating data
studentSchema.methods.updateRatingData = function(rating, rank) {
  this.currentRating = rating;
  this.rank = rank;
  
  if (rating > this.maxRating) {
    this.maxRating = rating;
    this.maxRank = rank;
  }
  
  return this.save();
};

// Instance method to update submission data
studentSchema.methods.updateSubmissionData = function(submissionDate) {
  this.lastSubmissionDate = submissionDate;
  return this.save();
};

// Instance method to increment reminder count
studentSchema.methods.incrementReminderCount = function() {
  this.emailPreferences.reminderCount += 1;
  this.emailPreferences.lastReminderSent = new Date();
  return this.save();
};

module.exports = mongoose.model('Student', studentSchema); 