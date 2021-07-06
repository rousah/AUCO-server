const router = require('express').Router();

//Authentication
const authRoute = require('../controller/auth');
router.use('/user', authRoute);

//Classes
const classRoute = require('../controller/class');
router.use('/class', classRoute);

//Students
const studentRoute = require('../controller/student');
router.use('/student', studentRoute);

//Questionnaires
const suestionnairesRoute = require('../controller/questionnaire');
router.use('/questionnaire', suestionnairesRoute);

module.exports = router;