const router = require('express').Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

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
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        console.log("This email already exists!")
        return res.status(400).send("This email already exists!");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        user: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        console.log("Successfully created user");
        res.send({ user: user._id });
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

    // Check if the email exists
    const user = await User.findOne({ user: req.body.email });
    if (!user) {
        console.log("Email is wrong");
        return res.status(400).send("Email or password is wrong!");
    }

    // Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        console.log("Password incorrect");
        return res.status(400).send("Email or password is wrong!");
    }

    // Create and assign a token in cookie
    const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.cookie('token', token, { httpOnly: true });
    res.json({ token });
    console.log("Successfully logged in");
    return res.status(200).send("Logged in!");

});

module.exports = router;