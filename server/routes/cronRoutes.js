const express = require('express');
const router = express.Router();
const cronController = require('../controllers/cronController');

// GET /api/cron/status - Get cron job status
router.get('/status', cronController.getCronStatus);

// GET /api/cron/jobs - Get available job types
router.get('/jobs', cronController.getAvailableJobs);

// POST /api/cron/sync-codeforces - Manually trigger Codeforces sync
router.post('/sync-codeforces', cronController.triggerCodeforcesSync);

// POST /api/cron/send-reminders - Manually trigger inactivity reminders
router.post('/send-reminders', cronController.triggerInactivityReminders);

// PUT /api/cron/schedule/:jobType - Update cron schedule
router.put('/schedule/:jobType', cronController.updateCronSchedule);

// POST /api/cron/stop/:jobType - Stop specific cron job
router.post('/stop/:jobType', cronController.stopCronJob);

// POST /api/cron/start/:jobType - Start specific cron job
router.post('/start/:jobType', cronController.startCronJob);

// POST /api/cron/stop-all - Stop all cron jobs
router.post('/stop-all', cronController.stopAllCronJobs);

// POST /api/cron/start-all - Start all cron jobs
router.post('/start-all', cronController.startAllCronJobs);

// POST /api/cron/validate - Validate cron expression
router.post('/validate', cronController.validateCronExpression);

module.exports = router; 