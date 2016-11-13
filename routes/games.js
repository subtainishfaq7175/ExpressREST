/**
 * Created by subtainishfaq on 10/18/16.
 */
var Games = require('../models/game');
var express = require('express');
var fs = require('node-fs');
var busboy = require('connect-busboy');
var jwt    = require('jwt-simple');
var config      = require('../config/database');
var passport	= require('passport');
var User = require('../models/user');


var router = express.Router();
router.use(busboy())

router.route('/games')
    .get(function(req, res) {


        Games.paginate({}, { page : req.param('page'), limit: 10 , sort : {created_time :'desc'} }, function(error, pageCount, paginatedResults) {
            if (error) {
                console.error(error);
                res.send(error);
            } else {

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

            if (!user)
            {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else
                {

                var game = new Games(req.body);
                game.save(function(err)
                {
                    if (err) {
                        return res.send(err);
                    }

                    res.send({ message: 'Game Added' });
                });

                }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }



});

router.route('/gamesgte/:dat')
    .get(function(req, res) {

        Games.find({

            release_date: { $gte: req.params.dat }
        }, function(err, game) {
            if (err) {
                return res.send(err);
            }

            res.json(game);
        });

    });
router.route('/gamesrange')
    .get(function(req, res) {


        Games.find({
                release_date: {$gte: new Date(req.param('datstart')),$lte: new Date(req.param('datend') ) }

            }

            , function(err, game) {
                if (err) {
                    return res.send(err);
                }

                res.json(game);
            });





    });

router.route('/games/:id').put(function(req,res){
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user)
            {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else
            {

                Games.findOne({ _id: req.params.id }, function(err, game) {
                    if (err) {
                        return res.send(err);
                    }

                    for (prop in req.body) {
                        game[prop] = req.body[prop];
                    }

                    // save the game
                    game.save(function(err) {
                        if (err) {
                            return res.send(err);
                        }

                        res.json({ message: 'Game updated!' });
                    });
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }






});


router.route('/games/:id').get(function(req, res) {
    Games.findOne({ _id: req.params.id}, function(err, game) {
        if (err) {
            return res.send(err);
        }

        res.json(game);
    });

});


router.route('/games/:id').delete(function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user)
            {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else
            {

                Games.remove({
                    _id: req.params.id
                }, function(err, game) {
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

router.route('/gamesupdate/')
    .get(function(req, res) {


        var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.findOne({
                name: decoded.name
            }, function(err, user) {
                if (err) throw err;

                if (!user)
                {
                    return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                } else
                {


                    Games.find(function(err, games) {
                        if (err) {
                            return res.send(err);
                        }

                        res.json(games);
                    }).limit(5);


                }
            });
        } else {
            return res.status(403).send({success: false, msg: 'No token provided.'});
        }


    });


router.route('/gamesfeed/')
    .get(function(req, res) {

        var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.findOne({
                name: decoded.name
            }, function(err, user) {
                if (err) throw err;

                if (!user)
                {
                    return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                } else
                {

                    Games.find({is_feed:true},function(err, games) {
                        if (err) {
                            return res.send(err);
                        }

                        res.json(games);
                    })
                }
            });
        } else {
            return res.status(403).send({success: false, msg: 'No token provided.'});
        }




    });

router.route('/gamesimage/:id').put(function(req,res){
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user)
            {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else
            {


                var fstream;
                req.pipe(req.busboy);
                req.busboy.on('file', function (fieldname, file, filename) {





                    Games.findOne({ _id: req.params.id }, function(err, game) {
                        if (err) {
                            return res.send(err);
                        }
                        console.log(file);
                        game["image"] = file.buffer;


                        // save the game
                        game.save(function(err) {
                            if (err) {
                                return res.send(err);
                            }

                            res.json({ message: 'Game updated!' });
                        });
                    });

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
