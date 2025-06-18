const Student = require('../model/Student');
const CodeforcesData = require('../model/CodeforcesData');
const codeforcesService = require('../services/codeforcesService');

// Get contest list
const getContestList = async (req, res) => {
  try {
    const contests = await codeforcesService.fetchContestList();
    
    res.json({
      success: true,
      data: contests
    });
  } catch (error) {
    console.error('Error fetching contest list:', error);
    res.status(500).json({ success: false, message: 'Error fetching contest list' });
  }
};

// Get user info
const getUserInfo = async (req, res) => {
  try {
    const { handle } = req.params;
    const { userInfo } = await codeforcesService.fetchUserInfo(handle);
    
    res.json({
      success: true,
      data: userInfo
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ success: false, message: 'Error fetching user info' });
  }
};

// Get user submissions
const getUserSubmissions = async (req, res) => {
  try {
    const { handle } = req.params;
    const count = parseInt(req.query.count) || 1000;
    const submissions = await codeforcesService.fetchUserSubmissions(handle, count);
    
    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({ success: false, message: 'Error fetching user submissions' });
  }
};

// Get user rating history
const getUserRatingHistory = async (req, res) => {
  try {
    const { handle } = req.params;
    const { ratingHistory } = await codeforcesService.fetchUserInfo(handle);
    
    res.json({
      success: true,
      data: ratingHistory
    });
  } catch (error) {
    console.error('Error fetching user rating history:', error);
    res.status(500).json({ success: false, message: 'Error fetching user rating history' });
  }
};

// Sync all students' Codeforces data
const syncAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true });
    const results = [];
    const errors = [];

    console.log(`Starting sync for ${students.length} students`);

    for (const student of students) {
      try {
        const result = await codeforcesService.syncStudentData(student._id, student.codeforcesHandle);
        results.push({
          studentId: student._id,
          handle: student.codeforcesHandle,
          success: true,
          data: result.data
        });
      } catch (error) {
        console.error(`Error syncing student ${student.codeforcesHandle}:`, error.message);
        errors.push({
          studentId: student._id,
          handle: student.codeforcesHandle,
          error: error.message
        });
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    res.json({
      success: true,
      message: `Sync completed. ${results.length} successful, ${errors.length} failed.`,
      data: {
        successful: results.length,
        failed: errors.length,
        results,
        errors
      }
    });
  } catch (error) {
    console.error('Error syncing all students:', error);
    res.status(500).json({ success: false, message: 'Error syncing all students' });
  }
};

// Get overall Codeforces statistics
const getOverallStats = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true });
    const codeforcesData = await CodeforcesData.find({});

    // Calculate overall statistics
    const totalStudents = students.length;
    const activeStudents = students.filter(s => !s.isInactive).length;
    const inactiveStudents = totalStudents - activeStudents;

    const totalProblemsSolved = codeforcesData.reduce((sum, data) => sum + data.totalProblemsSolved, 0);
    const totalSubmissions = codeforcesData.reduce((sum, data) => sum + data.totalSubmissions, 0);

    const averageRating = students.length > 0 
      ? students.reduce((sum, s) => sum + s.currentRating, 0) / students.length 
      : 0;

    const maxRating = students.length > 0 
      ? Math.max(...students.map(s => s.maxRating))
      : 0;

    // Rating distribution
    const ratingDistribution = {};
    students.forEach(student => {
      const rating = student.currentRating;
      const bucket = Math.floor(rating / 100) * 100;
      const bucketKey = `${bucket}-${bucket + 99}`;
      ratingDistribution[bucketKey] = (ratingDistribution[bucketKey] || 0) + 1;
    });

    // Rank distribution
    const rankDistribution = {};
    students.forEach(student => {
      const rank = student.rank;
      rankDistribution[rank] = (rankDistribution[rank] || 0) + 1;
    });

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActivity = students.filter(s => 
      s.lastSubmissionDate && s.lastSubmissionDate >= sevenDaysAgo
    ).length;

    res.json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        inactiveStudents,
        totalProblemsSolved,
        totalSubmissions,
        averageRating: Math.round(averageRating),
        maxRating,
        recentActivity,
        ratingDistribution,
        rankDistribution
      }
    });
  } catch (error) {
    console.error('Error getting overall stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching overall statistics' });
  }
};

module.exports = {
  getContestList,
  getUserInfo,
  getUserSubmissions,
  getUserRatingHistory,
  syncAllStudents,
  getOverallStats
}; 