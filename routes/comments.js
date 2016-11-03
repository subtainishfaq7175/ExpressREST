/**
 * Created by subtainishfaq on 11/3/16.
 */
/**
 * Created by subtainishfaq on 10/18/16.
 */
var Comments = require('../models/comment');
var express = require('express');
var jwt    = require('jwt-simple');
var config      = require('../config/database');
var passport	= require('passport');
var User = require('../models/user');

var router = express.Router();

router.route('/comments')
    .get(function(req, res) {
        Comments.find( function(err, comments) {

            if (err)
                res.send(err);

            res.json(comments);
        });





    })


    .post(function(req, res) {

        var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.findOne({
                name: decoded.name
            }, function(err, user) {
                if (err) throw err;

                if (!user) {
                    return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                } else {

                    var comments = new Comments(req.body);

                    comments.save(function(err) {
                        if (err) {
                            return res.send(err);
                        }

                        res.send({ message: 'Comments Added' });
                    });

                }
            });
        } else {
            return res.status(403).send({success: false, msg: 'No token provided.'});
        }

    });

router.route('/comments/:id').put(function(req,res){

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {

                Comments.findOne({ _id: req.params.id }, function(err, comments) {
                    if (err) {
                        return res.send(err);
                    }

                    for (prop in req.body) {
                        comments[prop] = req.body[prop];
                    }

                    // save the comments
                    comments.save(function(err) {
                        if (err) {
                            return res.send(err);
                        }

                        res.json({ message: 'Comments updated!' });
                    });
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }




});


router.route('/comments/:id').get(function(req, res) {
    Comments.findOne({ _id: req.params.id}, function(err, comments) {
        if (err) {
            return res.send(err);
        }

        res.json(comments);
    });
});

router.route('/comments/:id').delete(function(req, res) {

    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {

                Comments.remove({
                    _id: req.params.id
                }, function(err, comments) {
                    if (err) {
                        return res.send(err);
                    }

                    res.json({ message: 'Successfully deleted' });
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }


});



getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;
