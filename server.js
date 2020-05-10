const express = require('express');
const app = express();
const connectDB = require('./config/db');

// Connect to DB
connectDB();

app.get('/', (req, res) => {
    res.json({ msg: 'connected' })
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
});