const router = require('express').Router();
// Create empty questionnaire schema and model
const Questionnaire = require('../models/Questionnaire');

fs = require('fs');
path = require('path');
const { getQuestionnaire } = require('../middleware/getQuestionnaire');
const { getQuestionnaires } = require('../middleware/getQuestionnaires');
const { getGamificationInfoOfStudent } = require('../middleware/getGamificationInfoOfStudent');


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

// Get questionnaire (not tested), might have some error because changed recently
router.get('/:id', async (req, res) => {
    console.log("/api/questionnaire/:id");

    // Getting id info of the questionnaire
    questionnaireId = req.params.id;

    // Getting questionnaire
    let thisQuestionnaire = await getQuestionnaire(questionnaireId);
    if (!thisQuestionnaire) {
        console.log("No questionnaire found");
        return res.status(404).json({ message: "No questionnaire for this questionnaireid" }).send();
    }
    console.log("Found questionnaire for " + questionnaireId);
    return res.status(200).send(thisQuestionnaire);
});

// Get random questionnaire questions (not tested)
router.get('/:id/random/:ids', async (req, res) => {
    console.log("/api/questionnaire/:id/random/:ids");

    // Getting id of student and id of questionnaire
    const idq = req.params.id;
    const ids = req.params.ids;

    console.log(idq);
    console.log(ids);

    // Get all questionnaire questions
    let thisQuestionnaire = await getQuestionnaire(idq);
    if (!thisQuestionnaire) {
        console.log("No questionnaire found");
        return res.status(404).json({ message: "No questionnaire for this questionnaireid" }).send();
    }

    // Again, the same JSON 'undefined' error bullshit.......
    let thisQuestionnaireStr = JSON.stringify(thisQuestionnaire);
    thisQuestionnaire = JSON.parse(thisQuestionnaireStr);

    const questions = thisQuestionnaire.questions;

    // Check if questionnaire is partitionable or we should send all questions
    if (thisQuestionnaire.partitionable) {

        // Getting responses of student
        try {
            const student = await getGamificationInfoOfStudent(ids);

            // Checking if response exists
            let response = student.responses.filter(response => response.id_questionnaire == idq);


            // Again, the same JSON 'undefined' error bullshit.......
            let responseStr = JSON.stringify(response);
            response = JSON.parse(responseStr);

            let selectedQuestions = [];
            const questionLength = questions.length;

            // If it exists
            if (response[0] != undefined) {
                // Get 5 random non answered questions
                const answers = response[0];

                let numbers = [];
                // Get numbers of unanswered questions
                for (let i = 1; i <= questionLength; i++) {
                    // INSTEAD OF CHECKING IF NULL, CHECK IF NUMBER EXISTS
                    if (answers[i.toString()] == undefined) numbers.push(i);
                }

                // Get random index value
                function getRandomInt(max) {
                    return Math.floor(Math.random() * max);
                }

                if (numbers.length > 5) {
                    for (let i = 0; i < 5; i++) {
                        // Get random index to use in array
                        const randomIndex = getRandomInt(numbers.length);

                        // Get random question number from array of numbers of questions
                        const random = numbers[randomIndex];

                        // Set question number to random item
                        questions[random - 1].questionNumber = random;

                        // Add random item to selected
                        selectedQuestions.push(questions[random - 1]);

                        // Delete chosen number from list of numbers
                        numbers = numbers.filter(number => number != random);
                    }
                }
                else {
                    for (let i = 0; i < numbers.length; i++) {
                        const index = numbers[i];
                        // Set question number to random item
                        questions[index - 1].questionNumber = index;

                        // Add random item to selected
                        selectedQuestions.push(questions[index - 1]);
                    }
                }
            }
            // If it doesn't exist
            else {
                // Get 5 random questions
                // Get random index value
                for (let i = 0; i < 5; i++) {
                    const randomIndex = Math.floor(Math.random() * questionLength);

                    // Set question number to random item
                    questions[randomIndex - 1].questionNumber = randomIndex;

                    // Get random item
                    selectedQuestions.push(questions[randomIndex - 1]);
                }
            }

            // Add id's to selected questions
            thisQuestionnaire.questions = selectedQuestions;
            thisQuestionnaire.totalQuestions = questionLength;

            console.log("Found questionnaire for " + idq);
            return res.status(200).send(thisQuestionnaire);
        }
        catch (err) {
            console.log(err);
            return res.status(400).send("No student gamification for this studentId");
        }
    }

    // If not partitionable
    else {

        // Add question number to questions
        for (let i = 0; i < questions.length; i++) {

            // Set question number to random item
            questions[i].questionNumber = i + 1;
        }

        // Replace questions with q number
        thisQuestionnaire.questions = questions;

        console.log("Found questionnaire for " + idq);
        return res.status(200).send(thisQuestionnaire);
    }
});


// Get one random questionnaire question (not tested)
router.get('/get/random-question', async (req, res) => {
    console.log("/api/questionnaire/get/random-question");

    // Get all questionnaire questions
    let questionnaires = await getQuestionnaires();
    if (!questionnaires) {
        console.log("No questionnaire found");
        return res.status(404).json({ message: "No questionnaires" }).send();
    }

    // Again, the same JSON 'undefined' error bullshit.......
    let questionnairestring = JSON.stringify(questionnaires);
    questionnaires = JSON.parse(questionnairestring);

    questionnaires.forEach((questionnaire, index) => {

        // Get rid of non partitionable questionnaires
        if (!questionnaire.partitionable) {
            delete questionnaires[index]
        }

        // Get random index value
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }

        let randomQuestionnaire = questionnaires[getRandomInt(questionnaires.length - 1)];

        console.log(randomQuestionnaire);

        // Assign questionnaire length
        // Again, the same JSON 'undefined' error bullshit.......
        randomQuestionnaire = JSON.parse(JSON.stringify(randomQuestionnaire));
        const questionLength = randomQuestionnaire.questions.length;
        randomQuestionnaire.totalQuestions = questionLength;

        // Get and assign random question from randomly selected questionnaire
        const randomQuestion = randomQuestionnaire.questions[getRandomInt(questionLength)];
        console.log(randomQuestion);

        randomQuestionnaire.questions = [randomQuestion]

        console.log("Found random question of random questionnaire");
        return res.status(200).send(randomQuestionnaire);

    });
});

module.exports = router;