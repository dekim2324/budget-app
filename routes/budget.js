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

// @route   PUT api/budget/:id
// @desc    Update budget
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const {
        income, 
        rent, car, gas, subscriptions, groceries, play,
        t401k, hsa, roth, robinhood
    } = req.body;

    try {
        let budget = await Budget.findById(req.params.id);
        if(!budget) return res.status(404).json({ msg: 'Budget not found' });

        // make sure user owns budget
        if(budget.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        };

        let changedBudget = JSON.parse(JSON.stringify(budget));
        
        if(income) changedBudget.income = income;
        if(rent) changedBudget.expenses.rent = rent;
        if(car) changedBudget.expenses.car = car;
        if(gas) changedBudget.expenses.gas = gas;
        if(subscriptions) changedBudget.expenses.subscriptions = subscriptions;
        if(groceries) changedBudget.expenses.groceries = groceries;
        if(play) changedBudget.expenses.play = play;
        if(t401k) changedBudget.investments.t401k = t401k;
        if(hsa) changedBudget.investments.hsa = hsa;
        if(roth) changedBudget.investments.roth = roth;
        if(robinhood) changedBudget.investments.robinhood = robinhood;

        let newBudget = await Budget.findOneAndUpdate(req.params.id, 
            { $set: changedBudget },
            { new: true }
        );
        res.json(newBudget);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    };
})

// @route   DELETE api/budget/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let budget = await Budget.findById(req.params.id);
        if(!budget) return res.status(404).json({ msg: 'Budget not found' });

        // make sure user owns budget
        if(budget.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        };

        await Budget.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Contact Removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    };
})

module.exports = router;