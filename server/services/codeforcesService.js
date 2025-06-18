const axios = require('axios');
const Student = require('../model/Student');
const CodeforcesData = require('../model/CodeforcesData');

class CodeforcesService {
  constructor() {
    this.baseURL = process.env.CODEFORCES_API_BASE_URL || 'https://codeforces.com/api';
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'User-Agent': 'Student-Management-System/1.0'
      }
    });
  }

  // Fetch user info and rating history
  async fetchUserInfo(handle) {
    try {
      console.log(`Fetching user info for handle: ${handle}`);
      
      // Fetch user info
      const userInfoResponse = await this.axiosInstance.get('/user.info', {
        params: { handles: handle }
      });

      if (userInfoResponse.data.status !== 'OK') {
        throw new Error(`Codeforces API error: ${userInfoResponse.data.comment}`);
      }

      const userInfo = userInfoResponse.data.result[0];

      // Fetch rating history
      const ratingHistoryResponse = await this.axiosInstance.get('/user.rating', {
        params: { handle: handle }
      });

      if (ratingHistoryResponse.data.status !== 'OK') {
        throw new Error(`Codeforces API error: ${ratingHistoryResponse.data.comment}`);
      }

      const ratingHistory = ratingHistoryResponse.data.result;

      return {
        userInfo,
        ratingHistory
      };
    } catch (error) {
      console.error(`Error fetching user info for ${handle}:`, error.message);
      throw error;
    }
  }

  // Fetch user submissions
  async fetchUserSubmissions(handle, count = 1000) {
    try {
      console.log(`Fetching submissions for handle: ${handle}`);
      
      const response = await this.axiosInstance.get('/user.status', {
        params: { 
          handle: handle,
          count: count
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Codeforces API error: ${response.data.comment}`);
      }

      return response.data.result;
    } catch (error) {
      console.error(`Error fetching submissions for ${handle}:`, error.message);
      throw error;
    }
  }

  // Fetch contest list
  async fetchContestList() {
    try {
      console.log('Fetching contest list');
      
      const response = await this.axiosInstance.get('/contest.list');
      
      if (response.data.status !== 'OK') {
        throw new Error(`Codeforces API error: ${response.data.comment}`);
      }

      return response.data.result;
    } catch (error) {
      console.error('Error fetching contest list:', error.message);
      throw error;
    }
  }

  // Fetch contest standings for a specific user
  async fetchContestStandings(contestId, handle) {
    try {
      console.log(`Fetching contest standings for contest ${contestId}, handle: ${handle}`);
      
      const response = await this.axiosInstance.get('/contest.standings', {
        params: {
          contestId: contestId,
          handles: handle,
          showUnofficial: false
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Codeforces API error: ${response.data.comment}`);
      }

      return response.data.result;
    } catch (error) {
      console.error(`Error fetching contest standings for ${handle} in contest ${contestId}:`, error.message);
      throw error;
    }
  }

  // Fetch problems for a contest
  async fetchContestProblems(contestId) {
    try {
      console.log(`Fetching problems for contest ${contestId}`);
      
      const response = await this.axiosInstance.get('/contest.standings', {
        params: {
          contestId: contestId,
          from: 1,
          count: 1
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Codeforces API error: ${response.data.comment}`);
      }

      return response.data.result.problems;
    } catch (error) {
      console.error(`Error fetching problems for contest ${contestId}:`, error.message);
      throw error;
    }
  }

  // Process submissions and extract contest participation
  processSubmissionsForContests(submissions, ratingHistory) {
    const contestParticipation = new Map();
    const dailyStats = new Map();

    // Process each submission
    submissions.forEach(submission => {
      const contestId = submission.contestId;
      const submissionDate = new Date(submission.creationTimeSeconds * 1000);
      const dateKey = submissionDate.toDateString();

      // Initialize contest participation if not exists
      if (!contestParticipation.has(contestId)) {
        contestParticipation.set(contestId, {
          contestId: contestId,
          contestName: submission.problem.contestId ? `Contest ${contestId}` : 'Practice',
          contestType: submission.problem.contestId ? 'CONTEST' : 'PRACTICE',
          startTime: submissionDate,
          duration: 0,
          ratingChange: 0,
          oldRating: 0,
          newRating: 0,
          rank: 0,
          problemsSolved: new Set(),
          totalProblems: 0,
          submissions: []
        });
      }

      const contest = contestParticipation.get(contestId);
      contest.submissions.push({
        id: submission.id,
        contestId: submission.contestId,
        problem: {
          index: submission.problem.index,
          name: submission.problem.name,
          rating: submission.problem.rating,
          tags: submission.problem.tags || []
        },
        verdict: submission.verdict,
        programmingLanguage: submission.programmingLanguage,
        submissionTime: submissionDate,
        timeConsumedMillis: submission.timeConsumedMillis,
        memoryConsumedBytes: submission.memoryConsumedBytes
      });

      // Track solved problems
      if (submission.verdict === 'OK') {
        contest.problemsSolved.add(submission.problem.index);
      }

      // Initialize daily stats if not exists
      if (!dailyStats.has(dateKey)) {
        dailyStats.set(dateKey, {
          date: new Date(submissionDate.getFullYear(), submissionDate.getMonth(), submissionDate.getDate()),
          problemsSolved: new Set(),
          totalRating: 0,
          solvedCount: 0,
          hardestProblemSolved: { rating: 0 },
          submissions: []
        });
      }

      const dailyStat = dailyStats.get(dateKey);
      dailyStat.submissions.push({
        id: submission.id,
        contestId: submission.contestId,
        problem: {
          index: submission.problem.index,
          name: submission.problem.name,
          rating: submission.problem.rating,
          tags: submission.problem.tags || []
        },
        verdict: submission.verdict,
        programmingLanguage: submission.programmingLanguage,
        submissionTime: submissionDate,
        timeConsumedMillis: submission.timeConsumedMillis,
        memoryConsumedBytes: submission.memoryConsumedBytes
      });

      // Track solved problems for daily stats
      if (submission.verdict === 'OK') {
        dailyStat.problemsSolved.add(`${submission.contestId}-${submission.problem.index}`);
        dailyStat.solvedCount++;
        dailyStat.totalRating += submission.problem.rating || 0;
        
        if (submission.problem.rating > dailyStat.hardestProblemSolved.rating) {
          dailyStat.hardestProblemSolved = {
            rating: submission.problem.rating,
            problemName: submission.problem.name,
            contestId: submission.contestId,
            problemIndex: submission.problem.index
          };
        }
      }
    });

    // Process rating history to update contest participation
    ratingHistory.forEach(ratingChange => {
      const contest = contestParticipation.get(ratingChange.contestId);
      if (contest) {
        contest.ratingChange = ratingChange.newRating - ratingChange.oldRating;
        contest.oldRating = ratingChange.oldRating;
        contest.newRating = ratingChange.newRating;
        contest.rank = ratingChange.rank;
        contest.startTime = new Date(ratingChange.ratingUpdateTimeSeconds * 1000);
      }
    });

    // Convert maps to arrays and process data
    const contestArray = Array.from(contestParticipation.values()).map(contest => ({
      ...contest,
      problemsSolved: contest.problemsSolved.size,
      problemsSolvedList: Array.from(contest.problemsSolved)
    }));

    const dailyStatsArray = Array.from(dailyStats.values()).map(stat => ({
      date: stat.date,
      problemsSolved: stat.solvedCount,
      averageRating: stat.solvedCount > 0 ? Math.round(stat.totalRating / stat.solvedCount) : 0,
      hardestProblemSolved: stat.hardestProblemSolved,
      submissions: stat.submissions
    }));

    return {
      contestHistory: contestArray,
      dailyStats: dailyStatsArray
    };
  }

  // Calculate rating distribution
  calculateRatingDistribution(submissions) {
    const distribution = new Map();
    
    submissions.forEach(submission => {
      if (submission.verdict === 'OK' && submission.problem.rating) {
        const rating = submission.problem.rating;
        const bucket = Math.floor(rating / 100) * 100;
        const bucketKey = `${bucket}-${bucket + 99}`;
        
        distribution.set(bucketKey, (distribution.get(bucketKey) || 0) + 1);
      }
    });

    return distribution;
  }

  // Complete data sync for a student
  async syncStudentData(studentId, handle) {
    try {
      console.log(`Starting complete data sync for student ${studentId}, handle: ${handle}`);
      
      // Fetch all user data
      const { userInfo, ratingHistory } = await this.fetchUserInfo(handle);
      const submissions = await this.fetchUserSubmissions(handle, 10000);
      
      // Process the data
      const { contestHistory, dailyStats } = this.processSubmissionsForContests(submissions, ratingHistory);
      const ratingDistribution = this.calculateRatingDistribution(submissions);
      
      // Calculate aggregated stats
      const solvedSubmissions = submissions.filter(s => s.verdict === 'OK');
      const totalProblemsSolved = new Set(solvedSubmissions.map(s => `${s.contestId}-${s.problem.index}`)).size;
      const totalRating = solvedSubmissions.reduce((sum, s) => sum + (s.problem.rating || 0), 0);
      const averageRating = solvedSubmissions.length > 0 ? Math.round(totalRating / solvedSubmissions.length) : 0;
      
      const hardestProblem = solvedSubmissions.reduce((hardest, s) => {
        return (s.problem.rating || 0) > hardest.rating ? {
          rating: s.problem.rating,
          problemName: s.problem.name,
          contestId: s.contestId,
          problemIndex: s.problem.index
        } : hardest;
      }, { rating: 0 });

      // Update or create CodeforcesData
      let codeforcesData = await CodeforcesData.findOne({ studentId });
      
      if (!codeforcesData) {
        codeforcesData = new CodeforcesData({
          studentId,
          handle: handle.toLowerCase()
        });
      }

      // Update the data
      codeforcesData.contestHistory = contestHistory;
      codeforcesData.dailyStats = dailyStats;
      codeforcesData.totalProblemsSolved = totalProblemsSolved;
      codeforcesData.totalSubmissions = submissions.length;
      codeforcesData.averageRating = averageRating;
      codeforcesData.hardestProblemSolved = hardestProblem;
      codeforcesData.ratingDistribution = ratingDistribution;
      codeforcesData.lastUpdated = new Date();

      await codeforcesData.save();

      // Update student's rating data
      const student = await Student.findById(studentId);
      if (student) {
        const currentRating = userInfo.rating || 0;
        const maxRating = userInfo.maxRating || 0;
        const rank = userInfo.rank || 'unrated';
        const maxRank = userInfo.maxRank || 'unrated';
        
        await student.updateRatingData(currentRating, rank);
        
        // Update max rating if needed
        if (maxRating > student.maxRating) {
          student.maxRating = maxRating;
          student.maxRank = maxRank;
          await student.save();
        }

        // Update last submission date
        if (submissions.length > 0) {
          const lastSubmission = submissions[0];
          const lastSubmissionDate = new Date(lastSubmission.creationTimeSeconds * 1000);
          await student.updateSubmissionData(lastSubmissionDate);
        }

        // Update last data sync
        student.lastDataSync = new Date();
        await student.save();
      }

      console.log(`Completed data sync for student ${studentId}`);
      return {
        success: true,
        message: 'Data synced successfully',
        data: {
          currentRating: userInfo.rating || 0,
          maxRating: userInfo.maxRating || 0,
          totalProblemsSolved,
          totalSubmissions: submissions.length,
          lastSubmissionDate: submissions.length > 0 ? new Date(submissions[0].creationTimeSeconds * 1000) : null
        }
      };

    } catch (error) {
      console.error(`Error syncing data for student ${studentId}:`, error);
      throw error;
    }
  }

  // Get contest history for a specific time period
  async getContestHistory(studentId, days) {
    try {
      const codeforcesData = await CodeforcesData.findOne({ studentId });
      if (!codeforcesData) {
        throw new Error('No Codeforces data found for this student');
      }

      return codeforcesData.getContestHistory(days);
    } catch (error) {
      console.error(`Error getting contest history for student ${studentId}:`, error);
      throw error;
    }
  }

  // Get problem solving stats for a specific time period
  async getProblemSolvingStats(studentId, days) {
    try {
      const codeforcesData = await CodeforcesData.findOne({ studentId });
      if (!codeforcesData) {
        throw new Error('No Codeforces data found for this student');
      }

      return codeforcesData.getProblemSolvingStats(days);
    } catch (error) {
      console.error(`Error getting problem solving stats for student ${studentId}:`, error);
      throw error;
    }
  }

  // Get submission heatmap data
  async getSubmissionHeatmap(studentId, days = 365) {
    try {
      const codeforcesData = await CodeforcesData.findOne({ studentId });
      if (!codeforcesData) {
        throw new Error('No Codeforces data found for this student');
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const heatmapData = {};
      
      codeforcesData.contestHistory.forEach(contest => {
        contest.submissions.forEach(submission => {
          if (submission.submissionTime >= startDate) {
            const dateKey = submission.submissionTime.toISOString().split('T')[0];
            heatmapData[dateKey] = (heatmapData[dateKey] || 0) + 1;
          }
        });
      });

      return heatmapData;
    } catch (error) {
      console.error(`Error getting submission heatmap for student ${studentId}:`, error);
      throw error;
    }
  }
}

module.exports = new CodeforcesService(); 