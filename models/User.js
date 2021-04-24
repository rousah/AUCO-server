// models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  user: {
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

module.exports = User = mongoose.model('user', UserSchema);