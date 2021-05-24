// models/Class.js
const mongoose = require('mongoose');
const GamificationInfo = require('./GamificationInfoSchema');
const QuestionnaireSettings = require('./QuestionnaireSettingsSchema');
const Notification = require('./NotificationSchema');

const ClassSchema = new mongoose.Schema({
    id_teacher: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    students: {
        type: [GamificationInfo],
        required: true
    },
    questionnaires: {
        type: [QuestionnaireSettings],
        required: true
    },
    notifications: {
        type: [Notification],
        required: true
    }
});

module.exports = Class = mongoose.model('class', ClassSchema);