const Student = require('../models/StudentSchema');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var rug = require('random-username-generator');
var generator = require('generate-password');
var accents = require('remove-accents');
StudentModel = mongoose.model('student', Student);

const deleteStudentsFromClass = async (classId) => {
    console.log("Deleting all students from class: " + classId);
    try {
        await StudentModel.deleteMany({id_class: classId});
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
    return true;
}

module.exports.deleteStudentsFromClass = deleteStudentsFromClass;