const express = require('express');
const app = express();
const connectDB = require('./config/db');

// Connect to DB
connectDB();

// Init middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ msg: "Welcome to the Contact Keeper API" })
});

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
});