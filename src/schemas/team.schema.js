const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    code: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    flag: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    goals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal'
    }]
});
