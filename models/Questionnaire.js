const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create empty questionnaire schema and model
const QuestionnaireSchema = new Schema({}, { strict: false });
module.exports = Questionnaire = mongoose.model('questionnaire', QuestionnaireSchema, 'questionnaires');