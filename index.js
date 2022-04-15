require('dotenv').config();
const express = required('express');
const app = express();
const cors = require('cors');
const connection = require('./db');

// database connection
connection();

// middleware
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
