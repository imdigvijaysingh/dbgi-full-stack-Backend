const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const markSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true,
    default: 100
  },
  obtainedMarks: {
    type: Number,
    required: true,
    default: 0
  }
});

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true // e.g., "B.Tech CSE - 3rd Year"
  },
  semester: {
    type: String,
    required: true // e.g., "5th Sem"
  },
  marks: [markSchema]
});

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true, // Roll Number / ID
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false // Don't return password by default
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  photo: {
    type: String // URL or path to photo
  },
  currentClass: classSchema, // Currently enrolled class/semester details and marks
  semesters: [classSchema], // Past semesters report cards
  admitCardUrl: {
    type: String // URL or path to admit card PDF
  },
  feeDetails: {
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    lastPaymentDate: { type: Date },
    lastPaymentAmount: { type: Number, default: 0 }
  },
  attendance: {
    type: Number,
    default: 0 // Percentage
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
