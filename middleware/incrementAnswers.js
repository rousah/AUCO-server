const Class = require('../models/Class');

const incrementAnswers = async (questionnaireId, studentId) => {

    // Query for questionnaire
    const query = { "students.id_student": studentId, "questionnaires.id_questionnaire": questionnaireId };

    // Increment answered number for this questionnaire
    const incr = await Class.findOneAndUpdate(query, { $inc: { "questionnaires.$.answered": 1 } }, { useFindAndModify: false, new: true, upsert: true }, (err, result) => {
        if (err) {
            console.error(`Failed to increment answered: ${err}`);
            return false;
        }
        console.log("Successfully incremented answered");
    });

    return incr;
}

module.exports.incrementAnswers = incrementAnswers;