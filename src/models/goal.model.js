const mongoose =  require('mongoose');
const GoalSchema = require('../schemas/goal.schema');

module.exports = mongoose.model('Goal', GoalSchema);
