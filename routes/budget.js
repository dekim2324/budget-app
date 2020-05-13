const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Budget = require('../models/Budget');

// @route    GET api/budget
// @desc     Get all users budget
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const budget = await Budget.find({ user: req.user.id }).sort({ date: -1 });
        res.json(budget);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/budget
// @desc    Add new budget
// @access  Private
router.post('/', auth, async (req, res) => {
    const {
        income, 
        rent, car, gas, subscriptions, groceries, play,
        t401k, hsa, roth, robinhood
    } = req.body;

    try {
        const newBudget = new Budget({
            user: req.user.id,
            income,
            expenses: { rent, car, gas, subscriptions, groceries, play},
            investments: { t401k, hsa, roth, robinhood }
        });

        const budget = await newBudget.save();
        res.json(budget);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    };
});


module.exports = router;