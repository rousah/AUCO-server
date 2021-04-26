const router = require('express').Router();
const User = require('../models/Class');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { readXlsx } = require('../middleware/readXlsx');
const formidable = require('formidable');
const Class = require('../models/Class');

//Register
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
            console.log(fields['students'])
            students = JSON.parse(fields['students']);
        }
        // For when we do have a file
        else {
            students = await readXlsx(files['selectedFile']);
        }
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

module.exports = router;