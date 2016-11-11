/**
 * Created by subtainishfaq on 11/3/16.
 */
/**
 * Created by subtainishfaq on 10/18/16.
 */
var Masterdata = require('../models/masterdata');
var express = require('express');
var jwt    = require('jwt-simple');
var config      = require('../config/database');
var passport	= require('passport');
var User = require('../models/user');

var router = express.Router();

router.route('/masterdata')
    .get(function(req, res) {

        Masterdata.find({content_type :req.param('type')}, function(err, masterdata) {

            if (err)
                res.send(err);

            res.json(masterdata);
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

                    var masterdata = new Masterdata(req.body);

                    masterdata.save(function(err,saved) {
                        if (err) {
                            return res.send(err);
                        }
                        console.log(saved);
                        res.send({ message: 'Masterdata Added' ,_id:saved._id});
                    });

                }
            });
        } else {
            return res.status(403).send({success: false, msg: 'No token provided.'});
        }

    });

router.route('/masterdata/:id').put(function(req,res){

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

                Masterdata.findOne({ _id: req.params.id }, function(err, masterdata) {
                    if (err) {
                        return res.send(err);
                    }

                    if(masterdata==null)
                    return    res.status(404).send({success: false, msg: 'No object'})
                    for (prop in req.body) {
                        masterdata[prop] = req.body[prop];
                    }

                    // save the masterdata
                    masterdata.save(function(err) {
                        if (err) {
                            return res.send(err);
                        }

                        res.json({ message: 'Masterdata updated!' });
                    });
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }




});


router.route('/masterdata/:id').get(function(req, res) {
    Masterdata.findOne({ _id: req.params.id}, function(err, masterdata) {
        if (err) {
            return res.send(err);
        }

        res.json(masterdata);
    });
});

router.route('/masterdata/:id').delete(function(req, res) {

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

                Masterdata.remove({
                    _id: req.params.id
                }, function(err, masterdata) {
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
