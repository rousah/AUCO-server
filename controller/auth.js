const router = require('express').Router();
const Teacher = require('../models/Teacher');
const StudentSchema = require('../models/StudentSchema');
const mongoose = require('mongoose');
const Student = mongoose.model('student', StudentSchema);
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const checkPassword = async (user, password) => {
    // Check if password is correct
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
        console.log("Password incorrect");
        return false;
    }
    return true;
}

//Register
router.post('/register', async (req, res) => {

    console.log("/api/user/register")

    // Data Validation
    const { error } = registerValidation(req.body);

    // If there's an error it will not create a new user
    if (error) {
        console.log(error.details[0].message)
        return res.status(400).send(error.details[0].message);
    }

    // Check if user is already registred
    const emailExist = await Teacher.findOne({ email: req.body.email });
    if (emailExist) {
        console.log("This email already exists!")
        return res.status(400).send("This email already exists!");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new Teacher({
        name: req.body.name,
        surname: req.body.surname,
        institution: req.body.institution,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        console.log("Successfully created teacher");
        // Create and assign a token in cookie
        const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.json({ token, role: 'teacher', userDetails: user });
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }

});

//Login
router.post('/login', async (req, res) => {
    console.log("/user/login");
    console.log(req.body);

    // Data Validation
    const { error } = loginValidation(req.body);

    // If there's an error it will not log in
    if (error) {
        console.log(error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }

    // Check if the email exists for teachers
    let user = await Teacher.findOne({ email: req.body.email });
    if (!user) {
        // Check if user exists for students
        user = await Student.find({
            "username": req.body.email
        });
        if (user.length == 0) {
            console.log("No student or teacher with these credentials");
            return res.status(400).send("Email, user or password is wrong!");
        }
        console.log("Found student");
        console.log(user)
        user = user[0];
        user.role = 'student';
    }

    // Check if password is correct
    const validPass = await checkPassword(user, req.body.password);
    if (!validPass) {
        return res.status(400).send("Email or password is wrong!");
    }

    // Create and assign a token in cookie
    const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.cookie('token', token, { httpOnly: true });
    res.json({ token, role: user.role, userDetails: user });
    console.log("Successfully logged in");
    return res.send().status(200);

});

module.exports = router;