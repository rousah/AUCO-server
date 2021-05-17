const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var rug = require('random-username-generator');
var generator = require('generate-password');
var accents = require('remove-accents');
StudentModel = mongoose.model('student', Student);

const findUsername = async (username) => {
    return userExists = await StudentModel.findOne({ username: username });
}

const createRandomUser = async (name) => {
    // Set name for random username
    rug.setNames([accents.remove(name)]);

    // Generate random username based on name
    var username = rug.generate();

    // Check if username already exists
    const userExists = await findUsername(username);
    if (userExists) {
        console.log("This user already exists!")
        createRandomUser(name);
    }
    else return username;
}

const createStudent = async (student) => {
    console.log("createStudent()");

    // Generate random username based on name
    var username = await createRandomUser(student.name)

    // Generate random password
    var password = generator.generate({
        length: 8,
        numbers: true,
        excludeSimilarCharacters: true
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    student = {
        name: student.name,
        surname: student.surname,
        username: username,
        password: hashedPassword,
        openPassword: password,
        score: 0,
        level: 1
    }

    return student;
}

module.exports.createStudent = createStudent;