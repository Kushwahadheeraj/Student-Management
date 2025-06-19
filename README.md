# Student Management System with Codeforces Integration

A comprehensive student management system that tracks students' Codeforces progress, automatically syncs data, and sends inactivity reminders.

## Features

### 🎯 Core Features
- **Student Management**: Add, edit, delete, and view student information
- **Codeforces Integration**: Real-time data sync from Codeforces API
- **Progress Tracking**: Monitor rating changes, contest participation, and problem solving
- **Inactivity Detection**: Automatic email reminders for inactive students
- **Data Export**: Download student data as CSV
- **Responsive UI**: Modern, mobile-friendly interface

### 📊 Student Profile Features
- **Contest History**: View rating progression and contest performance
- **Problem Solving Stats**: Track problems solved, average rating, and difficulty distribution
- **Submission Heatmap**: Visual representation of daily activity
- **Filtering Options**: Filter data by time periods (7, 30, 90, 365 days)

### ⚙️ System Management
- **Cron Jobs**: Automated data synchronization and inactivity checks
- **Email System**: Configurable email reminders with statistics
- **Schedule Management**: Customize when automated tasks run
- **Real-time Updates**: Manual data refresh for immediate updates

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Node-cron** for scheduled tasks
- **Nodemailer** for email functionality
- **Axios** for API requests

### Frontend
- **React.js** with Vite
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Codeforces API access

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Student-Management/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the server directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/student-management
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Codeforces API
   CODEFORCES_API_BASE_URL=https://codeforces.com/api
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Cron Schedules
   CODEFORCES_SYNC_SCHEDULE=0 2 * * *
   INACTIVITY_CHECK_SCHEDULE=0 3 * * *
   TIMEZONE=UTC
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd ../client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Students
- `GET /api/students` - Get all students with pagination
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/:id/profile` - Get student profile with Codeforces data
- `POST /api/students/:id/sync` - Manually sync Codeforces data
- `PUT /api/students/:id/email-preferences` - Update email preferences
- `GET /api/students/export-csv` - Export students as CSV
- `GET /api/students/inactive` - Get inactive students

### Codeforces Data
- `GET /api/students/:id/contest-history` - Get contest history
- `GET /api/students/:id/problem-stats` - Get problem solving statistics
- `GET /api/students/:id/submission-heatmap` - Get submission heatmap

### Cron Management
- `GET /api/cron/status` - Get cron job status
- `PUT /api/cron/schedule/sync` - Update sync schedule
- `PUT /api/cron/schedule/inactivity` - Update inactivity check schedule
- `POST /api/cron/trigger/sync` - Manually trigger sync
- `POST /api/cron/trigger/inactivity` - Manually trigger inactivity check
- `GET /api/cron/test/pattern` - Test cron pattern
- `GET /api/cron/test/email` - Test email configuration
- `GET /api/cron/email/stats` - Get email statistics
- `POST /api/cron/jobs/start` - Start all cron jobs
- `POST /api/cron/jobs/stop` - Stop all cron jobs

## Database Schema

### Student Model
```javascript
{
  name: String,
  email: String (unique),
  phoneNumber: String,
  codeforcesHandle: String (unique),
  currentRating: Number,
  maxRating: Number,
  rank: String,
  maxRank: String,
  emailPreferences: {
    inactivityReminders: Boolean,
    lastReminderSent: Date,
    reminderCount: Number
  },
  lastSubmissionDate: Date,
  lastDataSync: Date,
  isActive: Boolean,
  timestamps: true
}
```

### Codeforces Data Model
```javascript
{
  studentId: ObjectId (ref: Student),
  handle: String,
  contestHistory: [{
    contestId: Number,
    contestName: String,
    startTime: Date,
    ratingChange: Number,
    rank: Number,
    problemsSolved: Number,
    submissions: [SubmissionSchema]
  }],
  dailyStats: [{
    date: Date,
    problemsSolved: Number,
    averageRating: Number,
    hardestProblemSolved: Object
  }],
  totalProblemsSolved: Number,
  averageRating: Number,
  ratingDistribution: Map,
  lastUpdated: Date
}
```

## Cron Jobs

### Codeforces Data Sync
- **Schedule**: Daily at 2 AM (configurable)
- **Purpose**: Fetch updated data for all students
- **Features**: Rate limiting, error handling, progress tracking

### Inactivity Check
- **Schedule**: Daily at 3 AM (configurable)
- **Purpose**: Identify and email inactive students
- **Features**: Email templates, reminder counting, opt-out support

## Email System

### Inactivity Reminders
- **Trigger**: Students inactive for 7+ days
- **Content**: Personalized with student stats and motivation
- **Features**: HTML templates, tracking, configurable frequency

### Email Statistics
- Total students with reminders enabled/disabled
- Reminder count per student
- Average reminders sent

## Usage Guide

### Adding a Student
1. Navigate to "Add Student" page
2. Fill in required information
3. Enter Codeforces handle (will be verified automatically)
4. Submit form
5. System will fetch initial Codeforces data

### Viewing Student Progress
1. Go to "All Students" page
2. Click "View" button on any student row
3. Explore contest history and problem solving tabs
4. Use filters to view different time periods

### Managing System Settings
1. Navigate to "Settings" page
2. Monitor cron job status
3. Update schedules as needed
4. Test email configuration
5. View email statistics

### Data Export
1. Go to "All Students" page
2. Click "Export CSV" button
3. Download will start automatically
4. File includes all student data and statistics

## Configuration

### Cron Schedules
Use standard cron syntax:
- `0 2 * * *` - Daily at 2 AM
- `0 */6 * * *` - Every 6 hours
- `0 9 * * 1` - Every Monday at 9 AM

### Email Configuration
- **Gmail**: Use App Password for 2FA accounts
- **SMTP**: Configure host, port, and credentials
- **Templates**: Customize email content in `emailService.js`

### Rate Limiting
- **Window**: 15 minutes (configurable)
- **Limit**: 100 requests per window (configurable)
- **Purpose**: Prevent API abuse

## Troubleshooting

### Common Issues

1. **Codeforces API Errors**
   - Check internet connection
   - Verify API endpoints are accessible
   - Check rate limiting

2. **Email Not Sending**
   - Verify SMTP credentials
   - Check firewall settings
   - Test email configuration in settings

3. **Cron Jobs Not Running**
   - Check server timezone
   - Verify cron patterns
   - Check server logs

4. **Database Connection Issues**
   - Verify MongoDB is running
   - Check connection string
   - Ensure network access

### Logs
- Server logs: Check console output
- Cron logs: Monitor scheduled task execution
- Email logs: Track delivery status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ for the competitive programming community** 