const Student = require('../model/Student');
const CodeforcesData = require('../model/CodeforcesData');
const codeforcesService = require('../services/codeforcesService');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

// Get all students with pagination and filtering
const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { codeforcesHandle: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = sortOrder;

    const students = await Student.find(searchQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Student.countDocuments(searchQuery);

    res.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting students:', error);
    res.status(500).json({ success: false, message: 'Error fetching students' });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-__v');
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Error getting student:', error);
    res.status(500).json({ success: false, message: 'Error fetching student' });
  }
};

// Create new student
const createStudent = async (req, res) => {
  try {
    const { name, email, phoneNumber, codeforcesHandle } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { codeforcesHandle }]
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or Codeforces handle already exists'
      });
    }

    const student = new Student({
      name,
      email,
      phoneNumber,
      codeforcesHandle
    });

    await student.save();

    // Fetch initial Codeforces data
    try {
      await codeforcesService.syncStudentData(student._id, codeforcesHandle);
    } catch (cfError) {
      console.error('Error fetching initial Codeforces data:', cfError);
      // Don't fail the student creation if Codeforces sync fails
    }

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ success: false, message: 'Error creating student' });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { name, email, phoneNumber, codeforcesHandle } = req.body;
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Check if email or handle is being changed and if it conflicts
    if (email !== student.email || codeforcesHandle !== student.codeforcesHandle) {
      const existingStudent = await Student.findOne({
        _id: { $ne: studentId },
        $or: [{ email }, { codeforcesHandle }]
      });

      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Student with this email or Codeforces handle already exists'
        });
      }
    }

    // Update student data
    student.name = name || student.name;
    student.email = email || student.email;
    student.phoneNumber = phoneNumber || student.phoneNumber;
    
    const handleChanged = codeforcesHandle && codeforcesHandle !== student.codeforcesHandle;
    student.codeforcesHandle = codeforcesHandle || student.codeforcesHandle;

    await student.save();

    // If handle changed, sync Codeforces data immediately
    if (handleChanged) {
      try {
        await codeforcesService.syncStudentData(student._id, codeforcesHandle);
      } catch (cfError) {
        console.error('Error syncing Codeforces data after handle change:', cfError);
        // Don't fail the update if Codeforces sync fails
      }
    }

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, message: 'Error updating student' });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Also delete associated Codeforces data
    await CodeforcesData.findOneAndDelete({ studentId: req.params.id });

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ success: false, message: 'Error deleting student' });
  }
};

// Get student profile with Codeforces data
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const codeforcesData = await CodeforcesData.findOne({ studentId: req.params.id });

    res.json({
      success: true,
      data: {
        student,
        codeforcesData: codeforcesData || null
      }
    });
  } catch (error) {
    console.error('Error getting student profile:', error);
    res.status(500).json({ success: false, message: 'Error fetching student profile' });
  }
};

// Get contest history
const getContestHistory = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const contestHistory = await codeforcesService.getContestHistory(req.params.id, days);

    res.json({
      success: true,
      data: contestHistory
    });
  } catch (error) {
    console.error('Error getting contest history:', error);
    res.status(500).json({ success: false, message: 'Error fetching contest history' });
  }
};

// Get problem solving statistics
const getProblemStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const stats = await codeforcesService.getProblemSolvingStats(req.params.id, days);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting problem stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching problem statistics' });
  }
};

// Get submission heatmap
const getSubmissionHeatmap = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 365;
    const heatmap = await codeforcesService.getSubmissionHeatmap(req.params.id, days);

    res.json({
      success: true,
      data: heatmap
    });
  } catch (error) {
    console.error('Error getting submission heatmap:', error);
    res.status(500).json({ success: false, message: 'Error fetching submission heatmap' });
  }
};

// Manually sync Codeforces data
const syncCodeforcesData = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const result = await codeforcesService.syncStudentData(student._id, student.codeforcesHandle);

    res.json({
      success: true,
      message: 'Codeforces data synced successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Error syncing Codeforces data:', error);
    res.status(500).json({ success: false, message: 'Error syncing Codeforces data' });
  }
};

// Update email preferences
const updateEmailPreferences = async (req, res) => {
  try {
    const { inactivityReminders } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    student.emailPreferences.inactivityReminders = inactivityReminders;
    await student.save();

    res.json({
      success: true,
      message: 'Email preferences updated successfully',
      data: student.emailPreferences
    });
  } catch (error) {
    console.error('Error updating email preferences:', error);
    res.status(500).json({ success: false, message: 'Error updating email preferences' });
  }
};

// Export students as CSV
const exportStudentsCSV = async (req, res) => {
  try {
    const students = await Student.find({}).select('-__v -__v');

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'No students found' });
    }

    const csvWriter = createCsvWriter({
      path: 'students_export.csv',
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'phoneNumber', title: 'Phone Number' },
        { id: 'codeforcesHandle', title: 'Codeforces Handle' },
        { id: 'currentRating', title: 'Current Rating' },
        { id: 'maxRating', title: 'Max Rating' },
        { id: 'rank', title: 'Current Rank' },
        { id: 'maxRank', title: 'Max Rank' },
        { id: 'lastSubmissionDate', title: 'Last Submission Date' },
        { id: 'lastDataSync', title: 'Last Data Sync' },
        { id: 'reminderCount', title: 'Reminder Count' },
        { id: 'createdAt', title: 'Created At' }
      ]
    });

    const records = students.map(student => ({
      name: student.name,
      email: student.email,
      phoneNumber: student.phoneNumber,
      codeforcesHandle: student.codeforcesHandle,
      currentRating: student.currentRating,
      maxRating: student.maxRating,
      rank: student.rank,
      maxRank: student.maxRank,
      lastSubmissionDate: student.lastSubmissionDate ? student.lastSubmissionDate.toISOString() : 'Never',
      lastDataSync: student.lastDataSync ? student.lastDataSync.toISOString() : 'Never',
      reminderCount: student.emailPreferences.reminderCount,
      createdAt: student.createdAt.toISOString()
    }));

    await csvWriter.writeRecords(records);

    res.download('students_export.csv', 'students_export.csv', (err) => {
      if (err) {
        console.error('Error downloading CSV:', err);
      }
      // Clean up the file after download
      fs.unlink('students_export.csv', (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting CSV file:', unlinkErr);
      });
    });
  } catch (error) {
    console.error('Error exporting students:', error);
    res.status(500).json({ success: false, message: 'Error exporting students' });
  }
};

// Get inactive students
const getInactiveStudents = async (req, res) => {
  try {
    const inactiveStudents = await Student.findInactiveStudents().select('-__v');

    res.json({
      success: true,
      data: inactiveStudents,
      count: inactiveStudents.length
    });
  } catch (error) {
    console.error('Error getting inactive students:', error);
    res.status(500).json({ success: false, message: 'Error fetching inactive students' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  getContestHistory,
  getProblemStats,
  getSubmissionHeatmap,
  syncCodeforcesData,
  updateEmailPreferences,
  exportStudentsCSV,
  getInactiveStudents
}; 