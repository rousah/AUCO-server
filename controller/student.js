const router = require('express').Router();
const Class = require('../models/Class');

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

module.exports = router;