/**
 * Created by subtainishfaq on 10/18/16.
 */
var Games = require('../models/game');
var express = require('express');
var fs = require('node-fs');
var busboy = require('connect-busboy');

var router = express.Router();
router.use(busboy())

router.route('/games')
    .get(function(req, res) {
        Games.paginate({}, { page: 1, limit: 10 }, function(error, pageCount, paginatedResults) {
            if (error) {
                console.error(error);
                res.send(error);
            } else {
              //  console.log('Pages:', pageCount);
              //  console.log(paginatedResults);
                res.json(pageCount);
            }
        });
/*    Games.find(function(err, games) {
        if (err) {
            return res.send(err);
        }

        res.json(games);
    });*/
})




.post(function(req, res) {
    var game = new Games(req.body);
    game.save(function(err) {
        if (err) {
            return res.send(err);
        }

        res.send({ message: 'Game Added' });
    });
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
        /*    Games.find(function(err, games) {
         if (err) {
         return res.send(err);
         }

         res.json(games);
         });*/
    })

router.route('/games/:id').put(function(req,res){
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
    Games.remove({
        _id: req.params.id
    }, function(err, game) {
        if (err) {
            return res.send(err);
        }

        res.json({ message: 'Successfully deleted' });
    });
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


    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        //fstream = fs.createWriteStream('../public/uploads/' + filename);

        // fstream.on('close', function () {
        //     res.redirect('back');
        // });



          Games.findOne({ _id: req.params.id }, function(err, game) {
         if (err) {
         return res.send(err);
         }
         console.log(file);
          game["image"] = file.buffer;

         //  game["image"] = req.file.name;
         //  game["image"] = req.file.name;


         // save the game
         game.save(function(err) {
         if (err) {
         return res.send(err);
         }

         res.json({ message: 'Game updated!' });
         });
         });

    });


/*

    console.log(req.files) // File from Client
    if(req.files.file){   // If the Image exists
        fs.readFile(req.files.file.path, function (dataErr, data) {
            if(data) {

                Games.findOne({ _id: req.params.id }, function(err, game) {
                    if (err) {
                        return res.send(err);
                    }
                      game["image"] = data;
                    //  game["image"] = req.file.name;
                    //  game["image"] = req.file.name;


                    // save the game
                    game.save(function(err) {
                        if (err) {
                            return res.send(err);
                        }
                    });

               });
            }
        });
        return
    }
    res.json(HttpStatus.BAD_REQUEST,{error:"Error in file upload"});*/


    /*  Games.findOne({ _id: req.params.id }, function(err, game) {
        if (err) {
            return res.send(err);
        }
          //  game["image"] = req.file.name;
          //  game["image"] = req.file.name;
          //  game["image"] = req.file.name;


        // save the game
        game.save(function(err) {
            if (err) {
                return res.send(err);
            }

            res.json({ message: 'Game updated!' });
        });
    });*/
});

/*

router.route('/gamesimage/:id').post(function(req, res) {
    var game = new Games(req.body);

    game.save(function(err) {
        if (err) {
            return res.send(err);
        }

        res.send({ message: 'Game Added' });
    });
});

 put(function(req,res){
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
 });
*/

module.exports = router;
