const Questionnaire = require('../models/Questionnaire');

const getQuestionnaires = async () => {

    let questionnaires;
    // Getting questionnaire
    try {
        questionnaires = await Questionnaire.find();
    }
    catch (err) {
        console.log(err);
        return false;
    }
    if (questionnaires.length > 0) {
        console.log("Found questionnaires");
        return questionnaires;
    }
    else {
        console.log("No questionnaires found");
        return false;
    }
}

module.exports.getQuestionnaires = getQuestionnaires;