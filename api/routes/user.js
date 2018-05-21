const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// model
const User = require("../models/user");

// Sign Up
router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if(user.length >= 1) {
                // Return the function
                return res.status(409).json({
                    message: 'email already taken'
                });
            }
            else {
                let userParams = {
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: req.body.password
                }
                const user = new User(userParams);
                user.save()
                    .then( (newUser) => {
                        // console.log('User created', newUser);
                        return res.status(201).json(
                            {
                                message: 'User Created',
                                user: newUser
                            }
                        )
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
        .catch( (err) => {
            console.log('First Error', err);
        } );
});

// Login using 

router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then( (foundUser) => {
        if(foundUser.length < 1) {
            return res.status(401).json({
                message: "Auth failed User Doesn't exist"
            });
        }
        if(foundUser[0].password === req.body.password) {
            //retunr jwt token
            // console.log('----> ready to Return JWT');
            const token = jwt.sign(
                {
                    email: foundUser[0].email,
                    userId: foundUser[0]._id
                },
                "Secrect2",
                {
                    expiresIn: "1h"
                }
            );

            return res.status(200).json({
                message: 'Auth Done',
                token: token
            });

        }
    })
});

module.exports = router;