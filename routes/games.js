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

router.route('/gamessearch')
    .get(function(req, res) {


        Games.paginate({"title":{ "$regex": "^"+req.param('query'), "$options": "i" }}, { page : req.param('page'), limit: 10 , sort : {created_time :'desc'} }, function(error, pageCount, paginatedResults) {
            if (error) {
                console.error(error);
                res.send(error);
            } else {

                res.json(pageCount);
            }
        });


});router.route('/gamescounts/:id')
    .get(function(req, res) {


       var query= Games.findOne({ _id: req.params.id }).select({ "likes": 1,  "favourites": 1, "dislikes": 1, "_id": 0});

        query.exec(function (err, someValue) {
            if (err)     res.send(err);
            else
            {
                res.json(someValue);
            }

        });


});router.route('/gamesfilter')
    .get(function(req, res) {

      var  andingParams=[];
      var  sorting={};

        if(typeof req.param('categories')!== 'undefined')
            andingParams.push({"categories.title":{ "$regex": "^"+req.param('categories'), "$options": "i" }});

        if(typeof req.param('genre')!== 'undefined')
            andingParams.push({"genre.title":{ "$regex": "^"+req.param('genre'), "$options": "i" }});

        if(typeof req.param('language')!== 'undefined')
        {
            andingParams.push({"languages.title":{ "$regex": "^"+req.param('language'), "$options": "i" }});
        }
        var  query ={
            $and : andingParams

        };
        if(typeof req.param('order')!== 'undefined')
        {
            sorting["created_time"]=req.param('order');
        }
        if(typeof req.param('orderby')!== 'undefined')
        {
            sorting[req.param('order')]="desc";
            if(req.param('orderby')==="title")
                sorting[req.param('order')]="asc";
        }

        Games.paginate(query, { page : req.param('page'), limit: 10 , sort : sorting }, function(error, pageCount, paginatedResults) {
            if (error) {
                res.send(error);
            } else {

                res.json(pageCount);
            }
        });


});
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

        Games.find(function(err, games) {
            if (err) {
                return res.send(err);
            }

            res.json(games);
        }).limit(5);

    });


router.route('/gamesfeed/')
    .get(function(req, res) {


        Games.find({is_feed:true},function(err, games) {
            if (err) {
                return res.send(err);
            }

            res.json(games);
        })



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
router.route('/gameslike/:id').get(function(req,res){
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

                        if ( typeof game["likes"] === 'undefined' )
                            game["likes"]={count : 0 , _creator:[]};

                        if(game["likes"]._creator.indexOf(user._id)!== -1)
                        {  var i =game["likes"]._creator.indexOf(user._id);
                            game["likes"]._creator.pull(user._id );
                            game["likes"].count--;
                            game.save();
                            console.log(i);
                            return res.json({message: "duplicate"});

                        }


                        game["likes"]._creator.push(user._id);
                        game["likes"].count++;




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

router.route('/gamesdislikes/:id').get(function(req,res){
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


                        if ( typeof game["dislikes"] === 'undefined' )
                            game["dislikes"]={count : 0 , _creator:[]};

                        if(game["dislikes"]._creator.indexOf(user._id)!== -1)
                        { var i =game["dislikes"]._creator.indexOf(user._id);
                            game["dislikes"]._creator.pull(user._id );
                            game["dislikes"].count--;
                            game.save();
                            return res.json({message: "duplicate"});

                        }


                        game["dislikes"]._creator.push(user._id);
                        game["dislikes"].count++;






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


router.route('/gamesfavourites/:id').get(function(req,res){
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


                        if ( typeof game["favourites"] === 'undefined' )
                            game["favourites"]={count : 0 , _creator:[]};

                        if(game["favourites"]._creator.indexOf(user._id)!== -1)
                        {   var  i=game["favourites"]._creator.indexOf(user._id);
                            game["favourites"]._creator.pull( user._id);
                            game["favourites"].count--;
                            game.save();
                            return res.json({message: "duplicate"});

                        }

                        game["favourites"]._creator.push(user._id);
                        game["favourites"].count++;
                        if ( typeof user["favourites_games"] === 'undefined' )
                            user.favourites_games=[];

                        user.favourites_games.push(game._id);
                        user.save();


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

router.route('/gamesfavourite')
    .get(function(req, res) {
        Games.find().sort('-favourites.count')
            .limit(5)
            .exec(function(err, docs)

            {
                if(!err)
                    res.json(docs);
                else
                    res.send(err);
            });


    });


router.route('/gamespopular')
    .get(function(req, res) {
        Games.find().sort('-likes.count')
            .limit(5)
            .exec(function(err, docs)

            {
                if(!err)
                    res.json(docs);
                else
                    res.send(err);
            });


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
