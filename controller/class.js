const router = require('express').Router();
const { readXlsx } = require('../middleware/readXlsx');
const { createXlsxWithStudents } = require('../middleware/createExcel');
const { calculateSociograph } = require('../middleware/calculateSociograph');
const formidable = require('formidable');
const Class = require('../models/Class');
const { createStudent } = require('../middleware/createStudent');
const { deleteStudentsFromClass } = require('../middleware/deleteStudentsFromClass');
const { createGamificationInfo } = require('../middleware/createGamificationInfo');
const { getStudents } = require('../middleware/getStudents');
const { reportValidation } = require('../validation');
var ObjectID = require('mongodb').ObjectID;
const Questionnaire = require('../models/Questionnaire');


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

        // Check if all fields are complete
        if (fields['userId'] == undefined || fields['withFile'] == undefined || fields['classname'] == undefined || fields['year'] == undefined) {
            return res.status(400).json({ message: "Form information not complete" }).send();
        }

        // For when we don't have a file
        if (fields['withFile'] == 'false') {
            if (fields['students'] == undefined) {
                console.log("No students in form");
                return res.status(400).json({ message: "Form information not complete, no students" }).send();
            }
            else {
                students = JSON.parse(fields['students']);
            }
        }
        // For when we do have a file
        else {
            try {
                students = await readXlsx(files['selectedFile']);
            }
            // For corrupt, missing or broken file
            catch (err) {
                console.log("Something is wrong with the file")
                return res.status(400).json({ message: "Xlxs file not correct" }).send();
            }
        }

        console.log("Successfully read excel file");

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

            // Stringify and parse to json again because for some reason it didn't work without formatting even tho it's type object???
            let stringJSON = JSON.stringify(questionnaire)
            let obj = JSON.parse(stringJSON);

            questionnaireSettings.push(
                {
                    id_questionnaire: obj._id,
                    active: true,
                    automatic: true,
                    options: "weekly",
                    answered: 0,
                    name: obj.name
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
            // Check if student info is complete
            if (students[i].name != "" && students[i].surname != "") {

                // Create student
                students[i] = await createStudent(students[i], classId);

                // Create gamificationinfo for all students
                gamification[i] = createGamificationInfo(students[i]._id);
            }
        }

        // Create file with names, surnames, usernames and passwords
        createXlsxWithStudents(students);

        // Add gamificationinfo of all students to class in database
        try {
            savedClass = await Class.updateOne({ "_id": ObjectID(classId) }, { $set: { students: gamification } });
            console.log("Successfully saved gamification info");
        } catch (err) {
            console.error(err);
            res.status(400).send(err);
        }

        console.log("Successfully created class and students!");
        res.status(200).sendFile(path.join(__dirname, '../resources', 'Students.xlsx'));
    });
});

// Get classes
router.get('/classes/:id', async (req, res) => {
    console.log("/api/class/classes");

    // Getting id info of the user
    userId = req.params.id;

    // Getting classes
    try {
        const aClass = await Class.find({ id_teacher: userId });
        if (aClass.length > 0) {
            console.log("Found classes for " + userId);
            return res.status(200).send(aClass);
        }
        else {
            console.log("No classes found");
            return res.status(400).json({ message: "No classes for this userid" }).send();
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: err }).send();
    }
});

// Get class
router.get('/:id', async (req, res) => {
    console.log("/api/class/:id");

    // Getting id info of the class
    classId = req.params.id;

    let aClass;
    // Getting class
    try {
        aClass = await Class.find({ _id: classId });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Error: " + err }).send();
    }
    if (aClass.length > 0) {
        console.log("Found class for " + classId);

        // Get student names of class
        let students = await getStudents(classId);
        // Getting students
        if (students) {
            console.log("Found students for " + classId);

            // Calculate sociograph
            let sociographNodes = calculateSociograph(aClass[0].students, students);

            const body = {
                relationships: sociographNodes, myClass: aClass[0]
            }
            return res.status(200).send(body);
        }
        else {
            console.log("No students found");
            return res.status(400).send("No students for this classid");
        }
    }
    else {
        console.log("No class found");
        return res.status(404).json({ message: "No class for this classid" }).send();
    }
});

// Delete class
router.delete('/delete/:id', async (req, res) => {
    console.log("/api/class/delete/:id");

    // Getting id info of the class
    classId = req.params.id;

    // Delete students
    try {
        deleteStudentsFromClass(classId);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: err }).send();
    }

    // Delete class
    try {
        await Class.deleteOne({ _id: classId });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: err }).send();
    }

    return res.status(200).json({ message: "Class deleted successfully" }).send();
});

// Create report
router.post('/:id/create-report', async (req, res) => {

    console.log("/api/class/:id/create-report");

    classid = req.params.id;
    report = req.body;

    let validation = reportValidation(report);
    if (!validation.error) {
        // Add notification to class
        Class.findOneAndUpdate({ "_id": ObjectID(classid) }, { $push: { notifications: report } }, { returnNewDocument: true, useFindAndModify: false, new: true, projection: { "notifications": 1 } }, (err, result) => {
            if (err) {
                console.error(`Failed to add report: ${err}`);
                return res.status(400).json({ message: "Error: " + err }).send();
            }
            console.log("Successfully created report");
            return res.status(200).json({ reportId: result.notifications[result.notifications.length - 1]._id }).send();
        });
    }
    else {
        return res.status(400).json({ message: validation.error.details[0].message }).send();
    }
});

// Delete report
router.delete('/delete-report/:id', async (req, res) => {

    console.log("/api/class/delete-report/:id");

    reportid = req.params.id;

    // Query for notification
    const query = { "notifications._id": reportid };

    // Delete report
    try {
        Class.findOneAndUpdate(query, { $pull: { notifications: { '_id': reportid } } }, { useFindAndModify: false, new: true }, (err, result) => {
            if (err) {
                console.error(`Failed to delete report: ${err}`);
                return res.status(400).json({ message: "Error: " + err }).send();
            }
            console.log("Successfully deleted report");
            return res.status(200).json({ message: "Report deleted successfully" }).send();
            //return res.status(200).json({ reportId: result.notifications[result.notifications.length - 1]._id }).send();
        });
    }
    catch (err) {
        console.log(err);
        return res.status(404).json({ message: err }).send();
    }
});

// Update form settings
router.put('/update-formsettings/', async (req, res) => {

    console.log("/api/class/update-formsettings");

    let formsettings = req.body;

    console.log(formsettings);

    const query = { "questionnaires._id": ObjectID(formsettings._id) };

    const action = { $set: { "questionnaires.$": formsettings } };

    // Update questionnaire settings
    try {
        Class.findOneAndUpdate(query, action, { returnNewDocument: true, useFindAndModify: false, new: true, projection: { "questionnaires": 1 } }, (err, result) => {
            if (err) {
                console.error(`Failed to update settings: ${err}`);
                return res.status(400).json({ message: "Error: " + err }).send();
            }
            console.log("Successfully updated settings");
            console.log(result);
            return res.status(200).json({ response: result }).send();
        });
    }
    catch (err) {
        console.log(err);
        return res.status(404).json({ message: err }).send();
    }
});

// Add points to students
router.put('/student/:id/points', async (req, res) => {

    console.log("/api/class/student/:id/points");

    let studentid = req.params.id;
    let points = req.body.points;

    const query = { "students.id_student": ObjectID(studentid) };

    // Get old points
    try {
        Class.find(query, { "students.$": 1 }, (err, result) => {
            if (err) {
                console.error(`Failed to get score: ${err}`);
                return res.status(400).json({ message: "Error: " + err }).send();
            }
            console.log("Successfully received score");
            let oldScore = result[0].students[0].score;

            // Calculate new points
            let newScore = oldScore + points;

            // Calculate new level
            let levelN = newScore / 100;
            let level = Math.trunc(levelN) + 1;

            // Increment score and update level of student
            const action = { $inc: { "students.$.score": points }, $set: { "students.$.level": level } };
            try {
                Class.findOneAndUpdate(query, action, { returnNewDocument: true, useFindAndModify: false, new: true, projection: { "students": 1 } }, (err, result) => {
                    if (err) {
                        console.error(`Failed to update score: ${err}`);
                        return res.status(400).json({ message: "Error: " + err }).send();
                    }
                    console.log("Successfully updated score");
                    return res.status(200).json({ response: result }).send();
                });
            }
            catch (err) {
                console.log(err);
                return res.status(404).json({ message: err }).send();
            }
        });
    }
    catch (err) {
        console.log(err);
        return res.status(404).json({ message: err }).send();
    }
});


module.exports = router;