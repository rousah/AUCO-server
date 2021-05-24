// models/ResponseSchema.js
const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
    id_student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    id_questionnaire: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    answer1: {
        type: String,
        required: true
    }
});

module.exports = Response = ResponseSchema;