var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt    = require('jwt-simple');
var config      = require('../config/database');
var passport	= require('passport');



router.route('/users')
    .get(function(req, res) {


      User.paginate({}, { page : req.param('page'), limit: 10 , sort : {created_time :'desc'} }, function(error, pageCount, paginatedResults) {
        if (error) {
          console.error(error);
          res.send(error);
        } else {

          res.json(pageCount);
        }
      });


    })



router.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password,
      userrole:req.body.userrole,
        favourite_games:[],
        favourite_letsplay:[],
        favourite_news:[]
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

router.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
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
        res.json({success: true, msg: 'Welcome in the member area ' + user.name + ' role ' + decoded.userRole});
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.route('/users/:id').get(function(req, res) {
  User.findOne({ _id: req.params.id}, function(err, user) {
    if (err) {
      return res.send(err);
    }

    res.json(user);
  });
});


router.route('/users/:id').delete(function(req, res) {
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

        User.remove({
          _id: req.params.id
        }, function(err, user) {
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
router.route('/users/:id').put(function(req, res) {
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

          User.findOne({ _id: req.params.id }, function(err, letsplay) {
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

                  res.json({ message: 'user updated!' });
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
