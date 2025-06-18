const nodemailer = require('nodemailer');
const Student = require('../model/Student');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Send inactivity reminder email
  async sendInactivityReminder(student) {
    try {
      const daysSinceLastSubmission = student.daysSinceLastSubmission || 'unknown';
      
      const mailOptions = {
        from: `"Student Management System" <${process.env.EMAIL_USER}>`,
        to: student.email,
        subject: 'Keep Up Your Problem Solving Streak! 💪',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Hello ${student.name}! 👋</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your Codeforces journey is waiting for you!</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-top: 0;">Time to Get Back to Problem Solving! 🚀</h2>
              
              <p style="color: #666; line-height: 1.6;">
                We noticed that you haven't made any submissions on Codeforces for the past ${daysSinceLastSubmission} days. 
                Don't let your problem-solving skills get rusty!
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 10px 0; color: #333;">Your Current Stats:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #666;">
                  <li><strong>Current Rating:</strong> ${student.currentRating}</li>
                  <li><strong>Max Rating:</strong> ${student.maxRating}</li>
                  <li><strong>Rank:</strong> ${student.rank}</li>
                  <li><strong>Codeforces Handle:</strong> ${student.codeforcesHandle}</li>
                </ul>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                <strong>Why should you practice regularly?</strong>
              </p>
              <ul style="color: #666; line-height: 1.6;">
                <li>Maintain and improve your problem-solving skills</li>
                <li>Keep your rating from dropping</li>
                <li>Stay competitive in programming contests</li>
                <li>Build a strong portfolio for your career</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://codeforces.com/problemset" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Start Solving Problems Now! 🎯
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; font-size: 14px;">
                <em>This is an automated reminder from your Student Management System. 
                You can disable these reminders in your profile settings if you prefer.</em>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>Student Management System</p>
              <p>Keep coding, keep growing! 💻</p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      // Update student's reminder count
      await student.incrementReminderCount();
      
      console.log(`Inactivity reminder sent to ${student.email}: ${result.messageId}`);
      
      return {
        success: true,
        messageId: result.messageId,
        email: student.email
      };
    } catch (error) {
      console.error(`Error sending inactivity reminder to ${student.email}:`, error);
      throw error;
    }
  }

  // Send bulk inactivity reminders
  async sendBulkInactivityReminders() {
    try {
      const inactiveStudents = await Student.findInactiveStudents();
      const results = {
        successful: [],
        failed: []
      };

      console.log(`Sending inactivity reminders to ${inactiveStudents.length} students`);

      for (const student of inactiveStudents) {
        try {
          const result = await this.sendInactivityReminder(student);
          results.successful.push(result);
          
          // Add delay to avoid overwhelming the email server
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Failed to send reminder to ${student.email}:`, error.message);
          results.failed.push({
            email: student.email,
            error: error.message
          });
        }
      }

      console.log(`Bulk reminder sending completed. ${results.successful.length} successful, ${results.failed.length} failed.`);
      
      return results;
    } catch (error) {
      console.error('Error sending bulk inactivity reminders:', error);
      throw error;
    }
  }

  // Test email configuration
  async testEmailConfiguration() {
    try {
      const testMailOptions = {
        from: `"Student Management System" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to self for testing
        subject: 'Email Configuration Test',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Email Configuration Test</h2>
            <p>If you're receiving this email, your email configuration is working correctly!</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(testMailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Email configuration test successful'
      };
    } catch (error) {
      console.error('Email configuration test failed:', error);
      throw error;
    }
  }

  // Get email statistics
  async getEmailStatistics() {
    try {
      const students = await Student.find({});
      
      const stats = {
        totalStudents: students.length,
        studentsWithRemindersEnabled: students.filter(s => s.emailPreferences.inactivityReminders).length,
        studentsWithRemindersDisabled: students.filter(s => !s.emailPreferences.inactivityReminders).length,
        totalRemindersSent: students.reduce((sum, s) => sum + s.emailPreferences.reminderCount, 0),
        averageRemindersPerStudent: students.length > 0 
          ? (students.reduce((sum, s) => sum + s.emailPreferences.reminderCount, 0) / students.length).toFixed(2)
          : 0
      };

      return stats;
    } catch (error) {
      console.error('Error getting email statistics:', error);
      throw error;
    }
  }
}

module.exports = new EmailService(); 