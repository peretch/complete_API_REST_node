const { json } = require('body-parser');
const { sign, decode } = require('jsonwebtoken');
const { compare, hash } = require('bcrypt');
const checkJwt = require('express-jwt');

const User = require('../models/user.model');
const Team = require('../models/team.model');
const Goal = require('../models/goal.model');

const JWT_SECRET = 'cualquierCosa';

module.exports = (app) => {
    
    // Endpoints USERS
    app.post('/users', json(), (req, res) => {
        const userBody = req.body;

        hash(userBody.password, 10)
            .then((hash) => {
                return User.create({
                    name:       userBody.name,
                    email:      userBody.email,
                    password:   hash
                })
            })
            .then((created_user) => {
                const token = sign({}, JWT_SECRET);

                res.json({
                    user: created_user,
                    token
                });
            })
            .catch((error) => {
                if(error.code === 11000){
                    res
                    .status(401)
                    .json({
                        message: ('El usuario on el mail "' + error.keyValue.email + '" ya existe en el sistema')
                    })
                }
                
                res.json({
                    error
                })
            });
    });

    // Endpoints session
    app.post('/sessions', json(), (req, res) => {
        const userBody = req.body;

        User.findOne({ email: userBody.email })
            .then((userDoc) => {
                return Promise.all([
                    userDoc,
                    compare(
                        userBody.password, 
                        userDoc.password
                    )
                ]);
            })
            .then(([{email}]) =>  {
                const token = sign({ email }, JWT_SECRET);

                res.json({
                    user: email,
                    token
                })
            })
            .catch((error) => {
                res
                    .status(400)
                    .json({
                        error: error.message
                    });
            })
    })

    // Endpoints TEAMS
    app.get('/teams', checkJwt({ secret: JWT_SECRET }), (req, res) => {
        // const auth = req.get("Authorization");
        // const { email } = decode(auth.split(" ")[1]);
        
        Team.find({})
            .then((doc) => {
                res
                    .status(200)
                    .json({
                        teams: doc
                    })
            })
            .catch((error) => {
                res
                    .status(400)
                    .json({
                        error: error.message
                    });
            });
    });
    
    app.get('/teams/:code', checkJwt({ secret: JWT_SECRET }), (req, res) => {
        const code = req.params.code;

        Team.findOne({code})
            .then((doc) => {
                res
                    .status(200)
                    .json({
                        team: doc
                    })
            })
            .catch((error) => {
                res
                    .status(400)
                    .json({
                        error: error.message
                    });
            });
    });

    app.post('/teams', checkJwt({ secret: JWT_SECRET }), json(), (req, res) => {
        const teamBody = req.body;
        res.json({body: teamBody});

        Team.create(teamBody)
                .then((doc) => {
                    res
                        .status(201)
                        .json({
                            team: doc
                        })
                })
                .catch((err) => {
                    res
                        .status(400)
                        .json({
                            error: err.message
                        })
                });
    });

    app.delete('/teams/:code', checkJwt({ secret: JWT_SECRET }), (req, res) => {
        const code = req.params.code;

        Team.deleteOne({code})
                .then((doc) => {
                    res
                        .status(200)
                        .json({
                            team: doc
                        })
                })
                .catch((err) => {
                    res
                        .status(400)
                        .json({
                            error: err.json
                        })
                })
    });

    // Endpoints GOALS
    app.get('/goals', checkJwt({ secret: JWT_SECRET }), json(), (req, res) => {
        Goal.find({})
            .populate('teamFor')
            .populate('teamTo')
            .then((doc) => {
                res
                    .status(200)
                    .json({
                        goals: doc
                    })
            })
            .catch((err) => {
                res
                    .status(400)
                    .json({
                        error: err.message
                    })
            });
    });
    
    app.get('/goals/:goalId', checkJwt({ secret: JWT_SECRET }), (req, res) => {
        const goalId = req.params.goalId;

        Goal.findById(goalId)
            .populate('teamFor')
            .populate('teamTo')
            .then((doc) => {
                res
                    .status(200)
                    .json({
                        goals: doc
                    })
            })
            .catch((err) => {
                res
                    .status(400)
                    .json({
                        error: err.message
                    })
            });
    });

    app.post('/goals', checkJwt({ secret: JWT_SECRET }), json(), (req, res) => {
        const goalBody = req.body;

        Goal.create(goalBody)
                .then((doc) => {
                    res
                        .status(201)
                        .json({
                            goal: doc
                        })
                })
                .catch((err) => {
                    res
                        .status(400)
                        .json({
                            error: err.message
                        })
                })
    });

    app.delete('/goals/:teamId', checkJwt({ secret: JWT_SECRET }), (req, res) => {
        res.json({
            message: "Not implemented"
        })
    });
}
