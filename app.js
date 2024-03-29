var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan      = require('morgan');
var passport	= require('passport');
//var User        = require('./app/models/user'); // get the mongoose model
var games = require('./routes/games'); //routes are defined here
var letsplays = require('./routes/letsplays'); //routes are defined here
var news = require('./routes/news'); //routes are defined here
var walkthrough = require('./routes/walkthroughs'); //routes are defined here
var index = require('./routes/index'); //routes are defined here
var app = express(); //Create the Express app
var config      = require('./config/database');
var authentication=require('./routes/users');
var comments=require('./routes/comments');
var faqs=require('./routes/faqs');
var messages=require('./routes/messages');
var masterdata=require('./routes/masterdata');
var fileUpload = require('express-fileupload');


app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(morgan('dev'));
app.use(passport.initialize());

//this for localhost
app.use(function (req,res,next) {
    res.header("Access-Control-Allow-Origin",'http://localhost:63342');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', true);

    next();

});

app.use('/',index);
app.use('/public', express.static(__dirname + '/public'));
mongoose.connect(config.database);
require('./config/passport')(passport);

// bundle our routes
// create a new user account (POST http://localhost:8080/api/signup)

app.use('/api', authentication);
app.use('/api', games); //This is our route middleware
app.use('/api', letsplays); //This is our route middleware
app.use('/api', news); //This is our route middleware
app.use('/api', walkthrough); //This is our route middleware
app.use('/api', comments); //This is our route middleware
app.use('/api', faqs); //This is our route middleware
app.use('/api', masterdata); //This is our route middleware
app.use('/api', messages); //This is our route middleware


module.exports = app;

