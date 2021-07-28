const Questionnaire = require('../models/Questionnaire');

const getQuestionnaire = async (questionnaireId) => {

    let thisQuestionnaire;
    // Getting questionnaire
    try {
        thisQuestionnaire = await Questionnaire.find({ _id: questionnaireId });
    }
    catch (err) {
        console.log(err);
        return false;
    }
    if (thisQuestionnaire.length > 0) {
        console.log("Found questionnaire for " + questionnaireId);
        return thisQuestionnaire[0];
    }
    else {
        console.log("No questionnaire found");
        return false;
    }
}

module.exports.getQuestionnaire = getQuestionnaire;