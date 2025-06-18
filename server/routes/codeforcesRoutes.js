const express = require('express');
const router = express.Router();
const codeforcesController = require('../controllers/codeforcesController');

// GET /api/codeforces/contests - Get contest list
router.get('/contests', codeforcesController.getContestList);

// GET /api/codeforces/user/:handle - Get user info
router.get('/user/:handle', codeforcesController.getUserInfo);

// GET /api/codeforces/user/:handle/submissions - Get user submissions
router.get('/user/:handle/submissions', codeforcesController.getUserSubmissions);

// GET /api/codeforces/user/:handle/rating - Get user rating history
router.get('/user/:handle/rating', codeforcesController.getUserRatingHistory);

// POST /api/codeforces/sync-all - Sync all students' Codeforces data
router.post('/sync-all', codeforcesController.syncAllStudents);

// GET /api/codeforces/stats - Get overall Codeforces statistics
router.get('/stats', codeforcesController.getOverallStats);

module.exports = router; 