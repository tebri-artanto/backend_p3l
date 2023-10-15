const express = require('express');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const userRoutes = require('./modules/Routes/userRoutes');

const app = express();

dotenv.config();
require("./modules/Database/db");

// Enable CORS
app.use(cors());

// Parse JSON bodies for this app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/', userRoutes);

// Start the server
app.get("/", (req, res) => {
    console.log("Response success")
    res.send("Response Success!!!")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})