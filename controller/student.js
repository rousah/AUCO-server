const router = require('express').Router();
const Class = require('../models/Class');
const { getGamificationInfoOfStudent } = require('../middleware/getGamificationInfoOfStudent');
const { incrementAnswers } = require('../middleware/incrementAnswers');
const { getQuestionnaire } = require('../middleware/getQuestionnaire');
const StudentSchema = require('../models/StudentSchema');
const mongoose = require('mongoose');
const Student = mongoose.model('student', StudentSchema);

// Get student info
router.get('/:id', async (req, res) => {
    console.log("/api/student");

    // Getting id info of the student
    studentId = req.params.id;

    // Query for student
    const query = { "students._id": studentId };

    // Return only student with this studentid
    const projection = { _id: 0, "students": { $elemMatch: { "_id": studentId } } };

    // Gettings student
    const aStudent = await Class.find(query, projection);

    if (aStudent) {
        student = aStudent[0].students[0];
        console.log("Found student for " + studentId);
        return res.status(200).send(student);
    }
    else {
        console.log("No student found");
        return res.status(400).send("No student for this studentId");
    }
});

// Get student gamification info
router.get('/gamification/:id', async (req, res) => {
    console.log("/api/student/gamification/:id");

    // Getting id info of the student
    studentId = req.params.id;
    console.log(studentId)

    try {
        const student = await getGamificationInfoOfStudent(studentId);
        return res.status(200).send(student);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("No student gamification for this studentId");
    }
});

// Get students from class
router.get('/class/:id/', async (req, res) => {
    console.log("/api/student/class/:id/");

    // Getting id info of the class
    classId = req.params.id;

    let students;
    // Getting students
    try {
        students = await Student.find({ id_class: classId });
    }
    catch (err) {
        console.log(err);
        return res.status(404).json({ message: "Error: " + err }).send();
    }
    if (students) {
        console.log("Found students for " + classId);
        return res.status(200).send(students);
    }
    else {
        console.log("No students found");
        return res.status(400).send("No students for this classid");
    }
});

// Create reponse for student
router.post('/responses/create/', async (req, res) => {
    console.log("/api/student/responses/create/");

    // Finding if this questionnaire was already answered
    const queryS = { "students.responses.id_student": req.body.id_student };
    const responses = await Class.find(queryS, { "students.responses.$": 1 }, (err, result) => {
        if (err) {
            console.error(`Failed to receive responses: ${err}`);
            return res.status(400).json({ message: "Error: " + err }).send();
        }
        console.log("Successfully received responses");
        return result;
    });

    // If questionnaire already exists, update
    if (responses.length > 0) {
        // Find which is my correct response by filtering for id_questionnaire
        myOldResponses = responses[0].students[0].responses.filter(r => r.id_questionnaire == req.body.id_questionnaire)[0];

        try {
            myOldResponses = JSON.parse(JSON.stringify(myOldResponses));

            console.log("exists");

            // Add new answers to old answers
            let newAnswers = req.body;

            delete newAnswers["id_student"];
            delete newAnswers["id_questionnaire"];
            delete newAnswers["id_questionnaire"];
            const mergedObject = {
                ...newAnswers,
                ...myOldResponses
            };

            // Incrementing number of answers, first get number of questions
            let qLength = JSON.parse(JSON.stringify(await getQuestionnaire(myOldResponses.id_questionnaire))).questions.length;

            // Count number of answers
            let answersCount = 0;
            // Count responses, - 3 to get rid of ids
            for (var response in mergedObject) {
                if (mergedObject.hasOwnProperty(response)) {
                    answersCount++;
                }
            }
            answersCount = answersCount - 3;

            // Check if answered all questions
            if (qLength - answersCount <= 0) {
                let ok = await incrementAnswers(mergedObject.id_questionnaire, mergedObject.id_student);
            }

            // Save new reponse
            const action = {
                '$set': {
                    'students.$[s].responses.$[r]': {
                        ...newAnswers,
                        ...myOldResponses
                    }
                }
            };

            // Filter to add to correct user
            const arrayFilters = [
                {
                    "s.id_student": mergedObject.id_student
                },
                {
                    "r.id_questionnaire": mergedObject.id_questionnaire
                }
            ]

            // Updating class with students responses
            Class.findOneAndUpdate(queryS, action, { useFindAndModify: false, arrayFilters: arrayFilters }, (err, result) => {
                if (err) {
                    console.error(`Failed to add responses: ${err}`);
                    return res.status(400).json({ message: "Error: " + err }).send();
                }
                console.log("Successfully created responses");
                return res.status(200).json({ response: result }).send();
            });
        }
        catch (e) {
            console.error(e);

            // If response doesnt exist
            console.log("doesnt exists")
            const query = { "students.id_student": req.body.id_student };
            const action = { "students.$.responses": req.body };

            console.log("Object:")
            console.log(req.body)
            // Updating class with students responses
            Class.findOneAndUpdate(query, { $push: action }, { useFindAndModify: false, new: true }, (err, result) => {
                if (err) {
                    console.error(`Failed to add responses: ${err}`);
                    return res.status(400).json({ message: "Error: " + err }).send();
                }
                console.log("Successfully created responses");
                return res.status(200).json({ response: result }).send();
            });
        }
    }

    // If not exists
    else {
        console.log("doesnt exists")
        const query = { "students.id_student": req.body.id_student };
        const action = { "students.$.responses": req.body };

        console.log("Object:")
        console.log(req.body)
        // Updating class with students responses
        Class.findOneAndUpdate(query, { $push: action }, { useFindAndModify: false, new: true }, (err, result) => {
            if (err) {
                console.error(`Failed to add responses: ${err}`);
                return res.status(400).json({ message: "Error: " + err }).send();
            }
            console.log("Successfully created responses");
            return res.status(200).json({ response: result }).send();
        });
    }
});

module.exports = router;