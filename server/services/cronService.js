const cron = require('node-cron');
const Student = require('../model/Student');
const codeforcesService = require('./codeforcesService');
const emailService = require('./emailService');

class CronService {
  constructor() {
    this.syncJob = null;
    this.inactivityJob = null;
    this.syncSchedule = process.env.CODEFORCES_SYNC_SCHEDULE || '0 2 * * *'; // Default: 2 AM daily
    this.inactivitySchedule = process.env.INACTIVITY_CHECK_SCHEDULE || '0 3 * * *'; // Default: 3 AM daily
  }

  // Initialize cron jobs (called on server startup)
  async initializeCronJobs() {
    try {
      console.log('Initializing cron jobs...');
      this.startAllJobs();
      console.log('Cron jobs initialized successfully');
    } catch (error) {
      console.error('Error initializing cron jobs:', error);
      throw error;
    }
  }

  // Start all cron jobs
  startAllJobs() {
    this.startCodeforcesSyncJob();
    this.startInactivityCheckJob();
    console.log('All cron jobs started successfully');
  }

  // Stop all cron jobs
  stopAllJobs() {
    if (this.syncJob) {
      this.syncJob.stop();
      this.syncJob = null;
    }
    if (this.inactivityJob) {
      this.inactivityJob.stop();
      this.inactivityJob = null;
    }
    console.log('All cron jobs stopped');
  }

  // Start Codeforces data sync job
  startCodeforcesSyncJob() {
    if (this.syncJob) {
      this.syncJob.stop();
    }

    this.syncJob = cron.schedule(this.syncSchedule, async () => {
      console.log('Starting scheduled Codeforces data sync...');
      try {
        await this.syncAllStudentsData();
        console.log('Scheduled Codeforces data sync completed successfully');
      } catch (error) {
        console.error('Error during scheduled Codeforces data sync:', error);
      }
    }, {
      scheduled: true,
      timezone: process.env.TIMEZONE || 'UTC'
    });

    console.log(`Codeforces sync job scheduled with pattern: ${this.syncSchedule}`);
  }

  // Start inactivity check job
  startInactivityCheckJob() {
    if (this.inactivityJob) {
      this.inactivityJob.stop();
    }

    this.inactivityJob = cron.schedule(this.inactivitySchedule, async () => {
      console.log('Starting scheduled inactivity check...');
      try {
        await this.checkInactiveStudents();
        console.log('Scheduled inactivity check completed successfully');
      } catch (error) {
        console.error('Error during scheduled inactivity check:', error);
      }
    }, {
      scheduled: true,
      timezone: process.env.TIMEZONE || 'UTC'
    });

    console.log(`Inactivity check job scheduled with pattern: ${this.inactivitySchedule}`);
  }

  // Update sync schedule
  updateSyncSchedule(newSchedule) {
    this.syncSchedule = newSchedule;
    this.startCodeforcesSyncJob();
    return { success: true, message: 'Sync schedule updated successfully', schedule: newSchedule };
  }

  // Update inactivity check schedule
  updateInactivitySchedule(newSchedule) {
    this.inactivitySchedule = newSchedule;
    this.startInactivityCheckJob();
    return { success: true, message: 'Inactivity check schedule updated successfully', schedule: newSchedule };
  }

  // Get current schedules
  getSchedules() {
    return {
      codeforcesSync: this.syncSchedule,
      inactivityCheck: this.inactivitySchedule,
      timezone: process.env.TIMEZONE || 'UTC'
    };
  }

  // Sync all students' Codeforces data
  async syncAllStudentsData() {
    try {
      const students = await Student.find({ isActive: true });
      console.log(`Starting sync for ${students.length} students`);

      const results = {
        successful: [],
        failed: [],
        total: students.length
      };

      for (const student of students) {
        try {
          console.log(`Syncing data for student: ${student.name} (${student.codeforcesHandle})`);
          
          const result = await codeforcesService.syncStudentData(student._id, student.codeforcesHandle);
          
          results.successful.push({
            studentId: student._id,
            name: student.name,
            handle: student.codeforcesHandle,
            data: result.data
          });

          // Add delay to avoid overwhelming the Codeforces API
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to sync data for ${student.name}:`, error.message);
          results.failed.push({
            studentId: student._id,
            name: student.name,
            handle: student.codeforcesHandle,
            error: error.message
          });
        }
      }

      console.log(`Sync completed. ${results.successful.length} successful, ${results.failed.length} failed.`);
      return results;
    } catch (error) {
      console.error('Error in syncAllStudentsData:', error);
      throw error;
    }
  }

  // Check for inactive students and send reminders
  async checkInactiveStudents() {
    try {
      const inactiveStudents = await Student.findInactiveStudents();
      console.log(`Found ${inactiveStudents.length} inactive students`);

      if (inactiveStudents.length === 0) {
        return { message: 'No inactive students found', sent: 0 };
      }

      const emailResults = await emailService.sendBulkInactivityReminders();
      
      console.log(`Inactivity check completed. ${emailResults.successful.length} emails sent successfully, ${emailResults.failed.length} failed.`);
      
      return {
        message: 'Inactivity check completed',
        totalInactive: inactiveStudents.length,
        emailsSent: emailResults.successful.length,
        emailsFailed: emailResults.failed.length,
        details: emailResults
      };
    } catch (error) {
      console.error('Error in checkInactiveStudents:', error);
      throw error;
    }
  }

  // Manual sync for a specific student (for real-time updates)
  async syncStudentData(studentId, handle) {
    try {
      console.log(`Manual sync for student ${studentId} with handle ${handle}`);
      const result = await codeforcesService.syncStudentData(studentId, handle);
      return result;
    } catch (error) {
      console.error(`Error in manual sync for student ${studentId}:`, error);
      throw error;
    }
  }

  // Get cron job status
  getJobStatus() {
    return {
      syncJob: {
        active: this.syncJob ? this.syncJob.running : false,
        schedule: this.syncSchedule,
        nextRun: this.syncJob ? this.syncJob.nextDate().toISOString() : null
      },
      inactivityJob: {
        active: this.inactivityJob ? this.inactivityJob.running : false,
        schedule: this.inactivitySchedule,
        nextRun: this.inactivityJob ? this.inactivityJob.nextDate().toISOString() : null
      }
    };
  }

  // Test cron patterns
  validateCronPattern(pattern) {
    try {
      cron.validate(pattern);
      return { valid: true, message: 'Valid cron pattern' };
    } catch (error) {
      return { valid: false, message: error.message };
    }
  }

  // Get next run times for a pattern
  getNextRunTimes(pattern, count = 5) {
    try {
      const times = [];
      const schedule = cron.schedule(pattern, () => {}, { scheduled: false });
      
      for (let i = 0; i < count; i++) {
        times.push(schedule.nextDate().toISOString());
      }
      
      return { valid: true, times };
    } catch (error) {
      return { valid: false, message: error.message };
    }
  }
}

const cronServiceInstance = new CronService();

module.exports = {
  initializeCronJobs: cronServiceInstance.initializeCronJobs.bind(cronServiceInstance),
  startAllJobs: cronServiceInstance.startAllJobs.bind(cronServiceInstance),
  stopAllJobs: cronServiceInstance.stopAllJobs.bind(cronServiceInstance),
  startCodeforcesSyncJob: cronServiceInstance.startCodeforcesSyncJob.bind(cronServiceInstance),
  startInactivityCheckJob: cronServiceInstance.startInactivityCheckJob.bind(cronServiceInstance),
  updateSyncSchedule: cronServiceInstance.updateSyncSchedule.bind(cronServiceInstance),
  updateInactivitySchedule: cronServiceInstance.updateInactivitySchedule.bind(cronServiceInstance),
  getSchedules: cronServiceInstance.getSchedules.bind(cronServiceInstance),
  syncAllStudentsData: cronServiceInstance.syncAllStudentsData.bind(cronServiceInstance),
  checkInactiveStudents: cronServiceInstance.checkInactiveStudents.bind(cronServiceInstance),
  syncStudentData: cronServiceInstance.syncStudentData.bind(cronServiceInstance),
  getJobStatus: cronServiceInstance.getJobStatus.bind(cronServiceInstance),
  validateCronPattern: cronServiceInstance.validateCronPattern.bind(cronServiceInstance),
  getNextRunTimes: cronServiceInstance.getNextRunTimes.bind(cronServiceInstance)
}; 