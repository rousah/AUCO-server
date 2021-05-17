// models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  openPassword: {
    type: String,
    required: false
  },
  score: {
    type: Number,
    required: false
  },
  level: {
    type: Number,
    required: false
  } 
});

module.exports = StudentSchema;