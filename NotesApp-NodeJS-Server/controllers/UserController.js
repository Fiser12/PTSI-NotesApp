var mongoose    = require('mongoose');
var config      = require('../parameters');
var jwt         = require('jwt-simple');
var User        = require('../models/user');
require('../passport')(require('passport'));

exports.signup = function(req, res) {
    if (!req.body.name || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        var newUser = new User({
            name: req.body.name,
            password: req.body.password,
            googleOAUTH: req.body.googleOAUTH
        });
        newUser.save(function(err) {
            if (err) {
                return res.status(403).json({success: false, msg: 'Username already exists.'});
            }
            res.status(200).json({success: true, msg: 'Successful created new user.'});
        });
    }
};

exports.authenticate = function(req, res) {
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user, config.secret);
                    res.status(200).send('JWT ' + token);
                } else {
                    res.status(403).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
};