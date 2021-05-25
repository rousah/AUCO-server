const router = require('express').Router();
const { readXlsx } = require('../middleware/readXlsx');
const formidable = require('formidable');
const Class = require('../models/Class');
const { createStudent } = require('../middleware/createStudent');
const { createGamificationInfo } = require('../middleware/createGamificationInfo');
var ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create class
router.post('/create', async (req, res) => {

    console.log("/api/class/create");

    // To read from form data
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        let students = null;
        // For when we don't have a file
        if (fields['withFile'] == 'false') {
            students = JSON.parse(fields['students']);
        }
        // For when we do have a file
        else {
            students = await readXlsx(files['selectedFile']);
        }

        // Create empty questionnaire schema and model
        const QuestionnaireSchema = new Schema({}, { strict: false });
        const Questionnaire = mongoose.model('Questionnaire', QuestionnaireSchema, 'questionnaires');

        // Obtain questionnaires from database
        let questionnaires;
        try {
            questionnaires = await Questionnaire.find();
            console.log("Successfully obtained questionnaires");
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }

        let questionnaireSettings = [];
        // Set default questionnaire settings
        questionnaires.forEach(questionnaire => {
            questionnaireSettings.push(
                {
                    id_questionnaire: questionnaire._id,
                    active: true,
                    automatic: true,
                    options: "weekly"
                }
            );
        });

        // Create class without gamification info
        let newClass = new Class({
            id_teacher: fields['userId'],
            name: fields['classname'],
            year: fields['year'],
            questionnaires: questionnaireSettings
        });

        // Save the class in the database
        let savedClass;
        try {
            savedClass = await newClass.save();
            console.log("Successfully saved class");
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }

        // Access the newly created class id
        let classId = savedClass._id;

        // Create student user for every student with class id
        let gamification = [];
        for (let i = 0; i < students.length; i++) {
            students[i] = await createStudent(students[i], classId);

            // Create gamificationinfo for all students
            gamification[i] = createGamificationInfo(students[i]._id);
        }

        // Add gamificationinfo of all students to class in database
        try {
            savedClass = await Class.updateOne({ "_id": ObjectID(classId) }, { $set: { students: gamification } });
            console.log("Successfully saved gamification info");
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }

        console.log("Successfully created class and students!");
        res.status(200).send({ newClass: classId });
    });
});

// Get classes
router.get('/classes/:id', async (req, res) => {
    console.log("/api/class/classes");

    // Getting id info of the user
    userId = req.params.id;

    // Getting classes
    const aClass = await Class.find({ id_teacher: userId });
    if (aClass) {
        console.log("Found classes for " + userId);
        return res.status(200).send(aClass);
    }
    else {
        console.log("No classes found");
        return res.status(400).send("No classes for this userid");
    }
});

// Get class
router.get('/:id', async (req, res) => {
    console.log("/api/class/:id");

    // Getting id info of the class
    classId = req.params.id;
    console.log(classId)

    // Getting class
    const aClass = await Class.find({ _id: classId });
    if (aClass) {
        console.log("Found class for " + classId);
        return res.status(200).send(aClass[0]);
    }
    else {
        console.log("No classes found");
        return res.status(400).send("No classes for this classid");
    }
});

module.exports = router;