const router = require('express').Router();
const { readXlsx } = require('../middleware/readXlsx');
const formidable = require('formidable');
const Class = require('../models/Class');
const { createStudent } = require('../middleware/createStudent');

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

        // Create student user for every student
        for (let i = 0; i < students.length; i++) {
            students[i] = await createStudent(students[i]);
        }

        // Create class
        let newClass = new Class({
            name: fields['classname'],
            year: fields['year'],
            teacherid: fields['userId'],
            students: students
        });

        // Save the class in the database
        try {
            const savedClass = await newClass.save();
            console.log("Successfully created class");
            res.status(200).send({ newClass: savedClass._id });
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    });
});

// Get classes
router.get('/classes/:id', async (req, res) => {
    console.log("/api/class/classes");

    // Getting id info of the user
    userId = req.params.id;

    // Getting classes
    const aClass = await Class.find({ teacherid: userId });
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
    console.log("/api/class");

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