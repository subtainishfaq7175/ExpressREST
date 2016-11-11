/**
 * Created by subtainishfaq on 10/18/16.
 */
var Letsplays = require('../models/letsplay');
var express = require('express');
var jwt    = require('jwt-simple');
var config      = require('../config/database');
var passport	= require('passport');
var User = require('../models/user');

var router = express.Router();

router.route('/letsplays')
    .get(function(req, res) {

        Letsplays.paginate({}, { page: 1, limit: 10 }, function(error, pageCount, paginatedResults) {
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
                var letsplay = new Letsplays(req.body);

                letsplay.save(function(err) {
                    if (err) {
                        return res.send(err);
                    }

                    res.send({ message: 'Letsplay Added' });
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

router.route('/letsplays/:id').put(function(req,res){


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
                Letsplays.findOne({ _id: req.params.id }, function(err, letsplay) {
                    if (err) {
                        return res.send(err);
                    }

                    for (prop in req.body) {
                        letsplay[prop] = req.body[prop];
                    }

                    // save the letsplay
                    letsplay.save(function(err) {
                        if (err) {
                            return res.send(err);
                        }

                        res.json({ message: 'Letsplay updated!' });
                    });
                });


            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }


});


router.route('/letsplays/:id').get(function(req, res) {
    Letsplays.findOne({ _id: req.params.id}, function(err, letsplay) {
        if (err) {
            return res.send(err);
        }

        res.json(letsplay);
    });
});

router.route('/letsplays/:id').delete(function(req, res) {
    Letsplays.remove({
        _id: req.params.id
    }, function(err, letsplay) {
        if (err) {
            return res.send(err);
        }

        res.json({ message: 'Successfully deleted' });
    });
});



router.route('/letsplaysupdate')
    .get(function(req, res) {
        Letsplays.find(function(err, letsplays) {
            if (err) {
                return res.send(err);
            }

            res.json(letsplays);
        }).limit(3);
    });
router.route('/letsplayfeed/')
    .get(function(req, res) {
        Letsplays.find({is_feed:true},function(err, letsplays) {
            if (err) {
                return res.send(err);
            }

            res.json(letsplays);
        })
    });

router.route('/letsplayimage/')
    .post(function(req, res) {
        var sampleFile;

        if (!req.files) {
            res.send('No files were uploaded.');
            return;
        }

        console.log(req);
        sampleFile = req.files.sampleFile;
        fileLoc='./public/images/'+Date.now()+(sampleFile.name.replace(/ /g,''));
        sampleFile.mv(fileLoc, function (err) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.json({url: req.protocol + '://' + req.get('host')+fileLoc.substring(1)});
            }
        })
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
