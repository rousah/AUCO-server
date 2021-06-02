// models/NotificationSchema.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    incident: {
        type: Boolean,
        required: true
    },
    details: {
        type: String,
        required: true
    }
});

module.exports = Notification = NotificationSchema;