// models/QuestionnaireSettingsSchema.js
const mongoose = require('mongoose');

const QuestionnaireSettingsSchema = new mongoose.Schema({
    id_questionnaire: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    automatic: {
        type: Boolean,
        required: true
    },
    options: {
        type: String,
        required: true
    },
    answered: {
        type: Number
    }
});

module.exports = QuestionnaireSettingsSchema;