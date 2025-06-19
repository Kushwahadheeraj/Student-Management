const cronService = require('../services/cronService');
const emailService = require('../services/emailService');

// Get cron job status and schedules
const getCronStatus = async (req, res) => {
  try {
    const status = cronService.getJobStatus();
    const schedules = cronService.getSchedules();
    const emailStats = await emailService.getEmailStatistics();

    res.json({
      success: true,
      data: {
        status,
        schedules,
        emailStats
      }
    });
  } catch (error) {
    console.error('Error getting cron status:', error);
    res.status(500).json({ success: false, message: 'Error fetching cron status' });
  }
};

// Update Codeforces sync schedule
const updateSyncSchedule = async (req, res) => {
  try {
    const { schedule } = req.body;

    if (!schedule) {
      return res.status(400).json({ success: false, message: 'Schedule is required' });
    }

    // Validate cron pattern
    const validation = cronService.validateCronPattern(schedule);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const result = cronService.updateSyncSchedule(schedule);

    res.json({
      success: true,
      message: 'Sync schedule updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating sync schedule:', error);
    res.status(500).json({ success: false, message: 'Error updating sync schedule' });
  }
};

// Update inactivity check schedule
const updateInactivitySchedule = async (req, res) => {
  try {
    const { schedule } = req.body;

    if (!schedule) {
      return res.status(400).json({ success: false, message: 'Schedule is required' });
    }

    // Validate cron pattern
    const validation = cronService.validateCronPattern(schedule);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const result = cronService.updateInactivitySchedule(schedule);

    res.json({
      success: true,
      message: 'Inactivity check schedule updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating inactivity schedule:', error);
    res.status(500).json({ success: false, message: 'Error updating inactivity schedule' });
  }
};

// Manually trigger Codeforces sync for all students
const triggerManualSync = async (req, res) => {
  try {
    console.log('Manual sync triggered via API');
    const result = await cronService.syncAllStudentsData();

    res.json({
      success: true,
      message: 'Manual sync completed',
      data: result
    });
  } catch (error) {
    console.error('Error during manual sync:', error);
    res.status(500).json({ success: false, message: 'Error during manual sync' });
  }
};

// Manually trigger inactivity check
const triggerInactivityCheck = async (req, res) => {
  try {
    console.log('Manual inactivity check triggered via API');
    const result = await cronService.checkInactiveStudents();

    res.json({
      success: true,
      message: 'Manual inactivity check completed',
      data: result
    });
  } catch (error) {
    console.error('Error during manual inactivity check:', error);
    res.status(500).json({ success: false, message: 'Error during manual inactivity check' });
  }
};

// Test cron pattern
const testCronPattern = async (req, res) => {
  try {
    const { pattern } = req.query;

    if (!pattern) {
      return res.status(400).json({ success: false, message: 'Pattern is required' });
    }

    const validation = cronService.validateCronPattern(pattern);
    const nextRuns = validation.valid ? cronService.getNextRunTimes(pattern) : null;

    res.json({
      success: true,
      data: {
        pattern,
        validation,
        nextRuns
      }
    });
  } catch (error) {
    console.error('Error testing cron pattern:', error);
    res.status(500).json({ success: false, message: 'Error testing cron pattern' });
  }
};

// Get email statistics
const getEmailStats = async (req, res) => {
  try {
    const stats = await emailService.getEmailStatistics();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting email statistics:', error);
    res.status(500).json({ success: false, message: 'Error fetching email statistics' });
  }
};

// Test email configuration
const testEmailConfig = async (req, res) => {
  try {
    const result = await emailService.testEmailConfiguration();

    res.json({
      success: true,
      message: 'Email configuration test completed',
      data: result
    });
  } catch (error) {
    console.error('Error testing email configuration:', error);
    res.status(500).json({ success: false, message: 'Error testing email configuration' });
  }
};

// Start all cron jobs
const startCronJobs = async (req, res) => {
  try {
    cronService.startAllJobs();

    res.json({
      success: true,
      message: 'All cron jobs started successfully'
    });
  } catch (error) {
    console.error('Error starting cron jobs:', error);
    res.status(500).json({ success: false, message: 'Error starting cron jobs' });
  }
};

// Stop all cron jobs
const stopCronJobs = async (req, res) => {
  try {
    cronService.stopAllJobs();

    res.json({
      success: true,
      message: 'All cron jobs stopped successfully'
    });
  } catch (error) {
    console.error('Error stopping cron jobs:', error);
    res.status(500).json({ success: false, message: 'Error stopping cron jobs' });
  }
};

module.exports = {
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
}; 