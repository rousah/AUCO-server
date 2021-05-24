// models/Teacher.js

const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = Teacher = mongoose.model('teacher', TeacherSchema);