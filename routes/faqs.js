/**
 * Created by subtainishfaq on 10/18/16.
 */
var Faqs = require('../models/faq');
var express = require('express');
var jwt    = require('jwt-simple');
var config      = require('../config/database');
var passport	= require('passport');
var User = require('../models/user');

var router = express.Router();

router.route('/faqs')
    .get(function(req, res) {

       Faqs.paginate({}, { page: 1, limit: 10 }, function(error, pageCount, paginatedResults) {
            if (error) {
                console.error(error);
                res.send(error);
            } else {
                //  console.log('Pages:', pageCount);
                //  console.log(paginatedResults);
                res.json(pageCount);
            }
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

                var faqs = new Faqs(req.body);

                faqs.save(function(err) {
                    if (err) {
                        return res.send(err);
                    }

                    res.send({ message: 'Faqs Added' });
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }

});

router.route('/faqs/:id').put(function(req,res){

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

                Faqs.findOne({ _id: req.params.id }, function(err, faqs) {
                    if (err) {
                        return res.send(err);
                    }

                    for (prop in req.body) {
                        faqs[prop] = req.body[prop];
                    }

                    // save the faqs
                    faqs.save(function(err) {
                        if (err) {
                            return res.send(err);
                        }

                        res.json({ message: 'Faqs updated!' });
                    });
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }




});


router.route('/faqs/:id').get(function(req, res) {
    Faqs.findOne({ _id: req.params.id}, function(err, faqs) {
        if (err) {
            return res.send(err);
        }

        res.json(faqs);
    });
});

router.route('/faqs/:id').delete(function(req, res) {

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

                Faqs.remove({
                    _id: req.params.id
                }, function(err, faqs) {
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
