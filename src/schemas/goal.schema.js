const mongoose = require('mongoose');
const { Team } = require('../models');

module.exports = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.String,
            required: true
        },
        minute: {
            type: mongoose.Schema.Types.Number,
            required: true
        },
        teamFor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true
            // validate: {
            //     validator: (teamId) => Team.findById(teamId),
            //     message: "El equipo para el que se hizo el gol no existe"
            // }
        },
        teamTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true
            // validate: {
            //     validator: (teamId) => Team.findById(teamId),
            //     message: "El equipo al que se le hizo el gol no existe"
            // }
        },
    },
    {
        timestamps: true
    }
);
