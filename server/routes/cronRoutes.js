const express = require('express');
const router = express.Router();
const {
  getCronStatus,
  updateSyncSchedule,
  updateInactivitySchedule,
  triggerManualSync,
  triggerInactivityCheck,
  testCronPattern,
  getEmailStats,
  testEmailConfig,
  startCronJobs,
  stopCronJobs
} = require('../controllers/cronController');

// Get cron job status and schedules
router.get('/status', getCronStatus);

// Update schedules
router.put('/schedule/sync', updateSyncSchedule);
router.put('/schedule/inactivity', updateInactivitySchedule);

// Manual triggers
router.post('/trigger/sync', triggerManualSync);
router.post('/trigger/inactivity', triggerInactivityCheck);

// Test endpoints
router.get('/test/pattern', testCronPattern);
router.get('/test/email', testEmailConfig);

// Email statistics
router.get('/email/stats', getEmailStats);

// Job control
router.post('/jobs/start', startCronJobs);
router.post('/jobs/stop', stopCronJobs);

module.exports = router; 