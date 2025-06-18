const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  contestId: {
    type: Number,
    required: true
  },
  problem: {
    index: String,
    name: String,
    rating: Number,
    tags: [String]
  },
  verdict: {
    type: String,
    required: true
  },
  programmingLanguage: String,
  submissionTime: {
    type: Date,
    required: true
  },
  timeConsumedMillis: Number,
  memoryConsumedBytes: Number
});

const contestParticipationSchema = new mongoose.Schema({
  contestId: {
    type: Number,
    required: true
  },
  contestName: {
    type: String,
    required: true
  },
  contestType: String,
  startTime: {
    type: Date,
    required: true
  },
  duration: Number, // in seconds
  ratingChange: {
    type: Number,
    default: 0
  },
  oldRating: {
    type: Number,
    default: 0
  },
  newRating: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  problemsSolved: {
    type: Number,
    default: 0
  },
  totalProblems: {
    type: Number,
    default: 0
  },
  submissions: [submissionSchema]
});

const problemSolvingStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  problemsSolved: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  hardestProblemSolved: {
    rating: {
      type: Number,
      default: 0
    },
    problemName: String,
    contestId: Number,
    problemIndex: String
  },
  submissions: [submissionSchema]
});

const codeforcesDataSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true
  },
  handle: {
    type: String,
    required: true,
    lowercase: true
  },
  // Contest history
  contestHistory: [contestParticipationSchema],
  
  // Problem solving statistics by date
  dailyStats: [problemSolvingStatsSchema],
  
  // Aggregated statistics
  totalProblemsSolved: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  hardestProblemSolved: {
    rating: {
      type: Number,
      default: 0
    },
    problemName: String,
    contestId: Number,
    problemIndex: String
  },
  
  // Rating distribution
  ratingDistribution: {
    type: Map,
    of: Number,
    default: new Map()
  },
  
  // Last update
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
codeforcesDataSchema.index({ studentId: 1 });
codeforcesDataSchema.index({ handle: 1 });
codeforcesDataSchema.index({ 'contestHistory.startTime': -1 });
codeforcesDataSchema.index({ 'dailyStats.date': -1 });

// Virtual for getting recent contests (last 30 days)
codeforcesDataSchema.virtual('recentContests').get(function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return this.contestHistory.filter(contest => 
    contest.startTime >= thirtyDaysAgo
  ).sort((a, b) => b.startTime - a.startTime);
});

// Virtual for getting recent submissions (last 7 days)
codeforcesDataSchema.virtual('recentSubmissions').get(function() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentSubmissions = [];
  this.contestHistory.forEach(contest => {
    contest.submissions.forEach(submission => {
      if (submission.submissionTime >= sevenDaysAgo) {
        recentSubmissions.push({
          ...submission.toObject(),
          contestName: contest.contestName,
          contestId: contest.contestId
        });
      }
    });
  });
  
  return recentSubmissions.sort((a, b) => b.submissionTime - a.submissionTime);
});

// Method to get contest history for a specific time period
codeforcesDataSchema.methods.getContestHistory = function(days) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.contestHistory
    .filter(contest => contest.startTime >= startDate)
    .sort((a, b) => b.startTime - a.startTime);
};

// Method to get problem solving stats for a specific time period
codeforcesDataSchema.methods.getProblemSolvingStats = function(days) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const filteredStats = this.dailyStats
    .filter(stat => stat.date >= startDate)
    .sort((a, b) => a.date - b.date);
  
  // Calculate aggregated stats
  const totalProblems = filteredStats.reduce((sum, stat) => sum + stat.problemsSolved, 0);
  const totalRating = filteredStats.reduce((sum, stat) => sum + (stat.averageRating * stat.problemsSolved), 0);
  const averageRating = totalProblems > 0 ? totalRating / totalProblems : 0;
  
  const hardestProblem = filteredStats.reduce((hardest, stat) => {
    return stat.hardestProblemSolved.rating > hardest.rating ? stat.hardestProblemSolved : hardest;
  }, { rating: 0 });
  
  return {
    totalProblemsSolved: totalProblems,
    averageRating: Math.round(averageRating),
    hardestProblemSolved: hardestProblem,
    averageProblemsPerDay: days > 0 ? totalProblems / days : 0,
    dailyStats: filteredStats
  };
};

// Method to update contest history
codeforcesDataSchema.methods.updateContestHistory = function(newContests) {
  // Merge new contests with existing ones, avoiding duplicates
  const existingContestIds = new Set(this.contestHistory.map(c => c.contestId));
  
  newContests.forEach(contest => {
    if (!existingContestIds.has(contest.contestId)) {
      this.contestHistory.push(contest);
    }
  });
  
  // Sort by start time (newest first)
  this.contestHistory.sort((a, b) => b.startTime - a.startTime);
  
  return this.save();
};

// Method to update daily stats
codeforcesDataSchema.methods.updateDailyStats = function(newStats) {
  // Merge new stats with existing ones
  newStats.forEach(newStat => {
    const existingStatIndex = this.dailyStats.findIndex(
      stat => stat.date.toDateString() === newStat.date.toDateString()
    );
    
    if (existingStatIndex >= 0) {
      // Update existing stat
      this.dailyStats[existingStatIndex] = newStat;
    } else {
      // Add new stat
      this.dailyStats.push(newStat);
    }
  });
  
  // Sort by date
  this.dailyStats.sort((a, b) => a.date - b.date);
  
  return this.save();
};

module.exports = mongoose.model('CodeforcesData', codeforcesDataSchema); 