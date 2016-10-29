/**
 * Created by subtainishfaq on 10/18/16.
 */
var News = require('../models/news');
var express = require('express');
var jwt    = require('jwt-simple');
var config      = require('../config/database');
var passport	= require('passport');
var User = require('../models/user');

var router = express.Router();

router.route('/news')
    .get(function(req, res) {

       News.paginate({}, { page: 1, limit: 10 }, function(error, pageCount, paginatedResults) {
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

                var news = new News(req.body);

                news.save(function(err) {
                    if (err) {
                        return res.send(err);
                    }

                    res.send({ message: 'News Added' });
                });

            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }

});

router.route('/news/:id').put(function(req,res){

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

                News.findOne({ _id: req.params.id }, function(err, news) {
                    if (err) {
                        return res.send(err);
                    }

                    for (prop in req.body) {
                        news[prop] = req.body[prop];
                    }

                    // save the news
                    news.save(function(err) {
                        if (err) {
                            return res.send(err);
                        }

                        res.json({ message: 'News updated!' });
                    });
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }




});


router.route('/news/:id').get(function(req, res) {
    News.findOne({ _id: req.params.id}, function(err, news) {
        if (err) {
            return res.send(err);
        }

        res.json(news);
    });
});

router.route('/news/:id').delete(function(req, res) {

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

                News.remove({
                    _id: req.params.id
                }, function(err, news) {
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

router.route('/newsupdate')
    .get(function(req, res) {
        News.find(function(err, news) {
            if (err) {
                return res.send(err);
            }

            res.json(news);
        }).limit(1);
    });

router.route('/newsupdatef')
    .get(function(req, res) {
        News.find(function(err, news) {
            if (err) {
                return res.send(err);
            }

            res.json(news);
        }).limit(4);
    });

router.route('/newsfeed')
    .get(function(req, res) {
        News.find({is_feed: true },function(err, news) {
            if (err) {
                return res.send(err);
            }

            res.json(news);
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
