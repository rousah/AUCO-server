// models/Class.js
const mongoose = require('mongoose');

const Student = new mongoose.Schema({ name: String, surname: String });

const ClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    teacherid: {
        type: String,
        required: true
    },
    students: {
        type: [Student],
        required: true
    }
});

module.exports = Class = mongoose.model('class', ClassSchema);