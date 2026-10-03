const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => {
    console.log('listening on port 3000');
});