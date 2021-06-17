const router = require('express').Router();
const Class = require('../models/Class');
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

    // Query for student
    const query = { "students.id_student": studentId };

    // Return only student with this studentid
    const projection = { _id: 0, "students": { $elemMatch: { "id_student": studentId } } };

    // Gettings student
    const aStudent = await Class.find(query, projection);

    if (aStudent) {
        student = aStudent[0].students[0];
        console.log("Found student gamification for " + studentId);
        return res.status(200).send(student);
    }
    else {
        console.log("No student gamification found");
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

    // Query for questionnaire
    const query = { "questionnaires.id_questionnaire": req.body.id_questionnaire };

    // DOESNT WORK
    /*
    // Increment answered number for this questionnaire
    await Class.findOneAndUpdate(query, { $inc: { "questionnaires.answered": 1 } }, { useFindAndModify: false, new: true, upsert: true }, (err, result) => {
        if (err) {
            console.error(`Failed to increment answered: ${err}`);
            return res.status(400).json({ message: "Error: " + err }).send();
        }
        console.log("Successfully incremented answered");
    });
*/
    // Finding if this questionnaire was already answered
    const responses = await Class.find(query, (err, result) => {
        if (err) {
            console.error(`Failed to add responses: ${err}`);
            return res.status(400).json({ message: "Error: " + err }).send();
        }
        console.log("Successfully created responses");
        return result;
    });

    // If exists, update
    if (responses.length > 0) {
        console.log("exists")
        const action = {
            $set: {
                "students.$[s].responses.$[r]": req.body
            }
        };

        const arrayFilters = [
            {
                "s.id_student": req.body.id_student
            },
            {
                "r.id_questionnaire": req.body.id_questionnaire
            }
        ]

        // Updating class with students responses
        Class.findOneAndUpdate({}, action, { useFindAndModify: false, new: true, arrayFilters: arrayFilters }, (err, result) => {
            if (err) {
                console.error(`Failed to add responses: ${err}`);
                return res.status(400).json({ message: "Error: " + err }).send();
            }
            console.log("Successfully created responses");
            return res.status(200).json({ response: result }).send();
        });
    }

    // If not exists
    else {
        console.log("doesnt exists")
        const query = { "students.id_student": req.body.id_student };
        const action = { "students.$.responses": req.body };

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