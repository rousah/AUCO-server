// models/BadgeSchema.js
const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    }
});

module.exports = Badge = BadgeSchema;