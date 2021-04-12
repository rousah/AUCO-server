const router = require('express').Router();

//Authentication
const authRoute = require('../controller/auth');
router.use('/user', authRoute);

//Any with middleware
const postRoute = require('../controller/post');
router.use('/api/post', postRoute);

module.exports = router;