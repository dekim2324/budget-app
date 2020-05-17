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

// @route   PUT api/budget
// @desc    Update budget
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const {
        income, 
        rent, car, gas, subscriptions, groceries, play,
        t401k, hsa, roth, robinhood
    } = req.body;

    // Build budget object
    const budgetFields = {};
    if(income) budgetFields.income = income;
    if(rent) budgetFields.expenses.rent = rent;
    if(car) budgetFields.expenses.car = car;
    if(gas) budgetFields.expenses.gas = gas;
    if(subscriptions) budgetFields.expenses.subscriptions = subscriptions;
    if(groceries) budgetFields.expenses.groceries = groceries;
    if(play) budgetFields.expenses.play = play;
    if(t401k) budgetFields.investments.t401k = t401k;
    if(hsa) budgetFields.investments.hsa = hsa;
    if(roth) budgetFields.investments.roth = roth;
    if(robinhood) budgetFields.investments.robinhood = robinhood;

    try {
        console.log(gas)
        let budget = await Budget.findById(req.params.id);
        console.log(req.params.id);
        if(!budget) return res.status(404).json({ msg: 'Budget not found' });

        // make sure user owns budget
        if(budget.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        };

        budget = await Budget.findOneAndUpdate(req.params.id, 
            { $set: budgetFields },
            { new: true }
        );
        res.json(budget);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    };
})


module.exports = router;