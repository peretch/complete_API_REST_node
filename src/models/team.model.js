const mongoose =  require('mongoose');
const TeamSchema = require('../schemas/team.schema');

module.exports = mongoose.model('Team', TeamSchema);
