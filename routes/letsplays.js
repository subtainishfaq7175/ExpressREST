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

router.route('/letsplayssearch')
    .get(function(req, res) {

        Letsplays.paginate({"title":{ "$regex": "^"+req.param('query'), "$options": "i" }}, { page : req.param('page'), limit: 10 ,sort: { date: 'desc' }}, function(error, pageCount, paginatedResults) {
            if (error) {
                console.error(error);
                res.send(error);
            } else {

                res.json(pageCount);
            }
        });

});
router.route('/letsplays')
    .get(function(req, res) {

        Letsplays.paginate({}, { page : req.param('page'), limit: 10 ,sort: { date: 'desc' }}, function(error, pageCount, paginatedResults) {
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

router.route('/letsplayslikes/:id').get(function(req,res){


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

                    if ( typeof letsplay["likes"] === 'undefined' )
                        letsplay["likes"]={count : 0 , _creator:[]};

                    if(letsplay["likes"]._creator.indexOf(user._id)!== -1)
                    {  var i =letsplay["likes"]._creator.indexOf(user._id);
                        letsplay["likes"]._creator.pull(user._id );
                        letsplay["likes"].count--;
                        letsplay.save();
                        console.log(i);
                        return res.json({message: "duplicate"});

                    }


                    letsplay["likes"]._creator.push(user._id);
                    letsplay["likes"].count++;


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


router.route('/letsplaysdislikes/:id').get(function(req,res){


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


                    if ( typeof letsplay["dislikes"] === 'undefined' )
                        letsplay["dislikes"]={count : 0 , _creator:[]};

                    if(letsplay["dislikes"]._creator.indexOf(user._id)!== -1)
                    { var i =letsplay["dislikes"]._creator.indexOf(user._id);
                        letsplay["dislikes"]._creator.pull(user._id );
                        letsplay["dislikes"].count--;
                        letsplay.save();
                        return res.json({message: "duplicate"});

                    }


                    letsplay["dislikes"]._creator.push(user._id);
                    letsplay["dislikes"].count++;






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

router.route('/letsplaysfavourites/:id').get(function(req,res){


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

                    if ( typeof letsplay["favourites"] === 'undefined' )
                        letsplay["favourites"]={count : 0 , _creator:[]};

                    if(letsplay["favourites"]._creator.indexOf(user._id)!== -1)
                    {   var  i=letsplay["favourites"]._creator.indexOf(user._id);
                        letsplay["favourites"]._creator.pull( user._id);
                        letsplay["favourites"].count--;
                        letsplay.save();
                        return res.json({message: "duplicate"});

                    }

                    letsplay["favourites"]._creator.push(user._id);
                    letsplay["favourites"].count++;

                    if ( typeof user["favourites_games"] === 'undefined' )
                        user.favourite_letsplay=[];

                    user.favourite_letsplay.push(letsplay._id);
                    user.save();



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
        if (typeof req.param('language') != 'undefined' )
        Letsplays.find({'$or':[{"language":{ "$regex": req.param('language'), "$options": "i" }},{"episodes.language":{ "$regex": req.param('language'), "$options": "i" }} ]},function(err, letsplays) {
            if (err) {
                return res.send(err);
            }

            res.json(letsplays);
        }).limit(5);

        else
            Letsplays.find(function(err, letsplays) {
                if (err) {
                    return res.send(err);
                }

                res.json(letsplays);
            }).limit(5);

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


router.route('/letsplayfavourite')
    .get(function(req, res) {
        Letsplays.find().sort('-favourites.count')
            .limit(5)
            .exec(function(err, docs)

        {
            if(!err)
            res.json(docs);
            else
            res.send(err);
        });


    });

router.route('/letsplaypopular')
    .get(function(req, res) {
        Letsplays.find().sort('-likes.count')
            .limit(5)
            .exec(function(err, docs)

        {
            if(!err)
            res.json(docs);
            else
            res.send(err);
        });


    });

router.route('/letsplayimage/')
    .post(function(req, res) {
        var sampleFile;

        if (!req.files) {
            res.send('No files were uploaded.');
            return;
        }

        sampleFile = req.files.sampleFile;

      var  fileLoc='./public/images/'+Date.now()+(sampleFile.name.replace(/ /g,''));
        console.log(fileLoc);
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
