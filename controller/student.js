const router = require('express').Router();
const Class = require('../models/Class');
const StudentSchema = require('../models/StudentSchema');
const mongoose = require('mongoose');
const Student = mongoose.model('student', StudentSchema);

// Get student
router.get('/:id', async (req, res) => {
    console.log("/api/student");

    // Getting id info of the student
    studentId = req.params.id;

    // Query for student
    const query = {"students._id": studentId};

    // Return only student with this studentid
    const projection = { _id: 0, "students": {$elemMatch: {"_id": studentId }}};

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

module.exports = router;