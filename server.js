// server.js

const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors');

const app = express();

// Connect Database
connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Hello world!'));

// Import routes
const Router = require('./routes/routes');
app.use(Router);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));