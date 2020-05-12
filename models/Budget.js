const mongoose = require('mongoose');

const BudgetSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    income: {
        type: Number,
        required: true
    },
    expenses: {
        rent: Number,
        car: Number,
        gas: Number,
        subscriptions: Number,
        groceries: Number,
        play: Number
    },
    investments: {
        '401k': Number,
        hsa: Number,
        roth: Number,
        robinhood: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('budget', BudgetSchema);