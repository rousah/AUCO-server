const StudentSchema = require('../models/StudentSchema');
const mongoose = require('mongoose');
const Student = mongoose.model('student', StudentSchema);

const getStudents = async (classId) => {
    console.log("Getting students");
    let students;
    // Getting students
    try {
        students = await Student.find({ id_class: classId });
    }
    catch (err) {
        console.log(err);
        return false;
    }
    if (students) {
        console.log("Found students for " + classId);
        return students;
    }
    else {
        console.log("No students found");
        return false;
    }
}

module.exports.getStudents = getStudents;
