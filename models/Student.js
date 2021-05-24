// models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  id_class: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
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
  }
});

module.exports = StudentSchema;