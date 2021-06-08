const router = require('express').Router();
// Create empty questionnaire schema and model
const Questionnaire = require('../models/Questionnaire');

fs = require('fs');
path = require('path');

// Create questionnaire
router.post('/create', async (req, res) => {

    console.log("/api/questionnaire/create");

    try {
        const raw = fs.readFileSync('./resources/questionnaires.json');
        const questionnaires = JSON.parse(raw);
        console.log(questionnaires);

        questionnaires.forEach(async (questionnaire) => {
            try {
                let newQuestionnaire = new Questionnaire(questionnaire);
                savedQuestionnaire = await newQuestionnaire.save();
                console.log("Successfully saved new questionnaire");
            }
            catch (err) {
                return res.status(400).json({ message: err }).send();
            }
        });

        return res.status(200).send({ message: "Questionnaires created successfully" });
    }
    catch (err) {
        return res.status(400).json({ message: err }).send();
    }
});

// Get questionnaire (not tested)
router.get('/:id', async (req, res) => {
    console.log("/api/questionnaire/:id");

    // Getting id info of the questionnaire
    questionnaireId = req.params.id;

    let thisQuestionnaire;
    // Getting questionnaire
    try {
        thisQuestionnaire = await Questionnaire.find({ _id: questionnaireId });
    }
    catch (err) {
        console.log(err);
        return res.status(404).json({ message: "Error: " + err }).send();
    }
    if (thisQuestionnaire.length > 0) {
        console.log("Found questionnaire for " + questionnaireId);
        return res.status(200).send(thisQuestionnaire[0]);
    }
    else {
        console.log("No questionnaire found");
        return res.status(404).json({ message: "No questionnaire for this questionnaireid" }).send();
    }
});

module.exports = router;