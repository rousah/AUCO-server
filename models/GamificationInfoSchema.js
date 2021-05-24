// models/GamificationInfoSchema.js
const mongoose = require('mongoose');
const Badge = require('./BadgeSchema');
const Response = require('./ResponseSchema');

const GamificationInfoSchema = new mongoose.Schema({
    id_student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    score: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    responses: {
        type: [Response]
    },
    badges: {
        type: [Badge]
    }
});

module.exports = GamificationInfo = GamificationInfoSchema;