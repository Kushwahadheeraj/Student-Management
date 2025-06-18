const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// GET /api/students - Get all students with pagination and filtering
router.get('/', studentController.getAllStudents);

// GET /api/students/:id - Get student by ID
router.get('/:id', studentController.getStudentById);

// POST /api/students - Create new student
router.post('/', studentController.createStudent);

// PUT /api/students/:id - Update student
router.put('/:id', studentController.updateStudent);

// DELETE /api/students/:id - Delete student
router.delete('/:id', studentController.deleteStudent);

// GET /api/students/:id/profile - Get student profile with Codeforces data
router.get('/:id/profile', studentController.getStudentProfile);

// GET /api/students/:id/contest-history - Get contest history
router.get('/:id/contest-history', studentController.getContestHistory);

// GET /api/students/:id/problem-stats - Get problem solving statistics
router.get('/:id/problem-stats', studentController.getProblemStats);

// GET /api/students/:id/heatmap - Get submission heatmap
router.get('/:id/heatmap', studentController.getSubmissionHeatmap);

// POST /api/students/:id/sync-codeforces - Manually sync Codeforces data
router.post('/:id/sync-codeforces', studentController.syncCodeforcesData);

// PUT /api/students/:id/email-preferences - Update email preferences
router.put('/:id/email-preferences', studentController.updateEmailPreferences);

// GET /api/students/export/csv - Export all students as CSV
router.get('/export/csv', studentController.exportStudentsCSV);

// GET /api/students/inactive/list - Get list of inactive students
router.get('/inactive/list', studentController.getInactiveStudents);

module.exports = router; 