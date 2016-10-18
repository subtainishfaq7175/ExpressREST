/**
 * Created by subtainishfaq on 10/18/16.
 */
var Games = require('../models/game');
var express = require('express');
var router = express.Router();

router.route('/games')
    .get(function(req, res) {
    Games.find(function(err, games) {
        if (err) {
            return res.send(err);
        }

        res.json(games);
    });
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

router.route('/games/:id').put(function(req,res){
    Game.findOne({ _id: req.params.id }, function(err, game) {
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

router.route('/gamesfeed/')
    .get(function(req, res) {
        Games.find({is_feed:true},function(err, games) {
            if (err) {
                return res.send(err);
            }

            res.json(games);
        }).limit(5);
    });

module.exports = router;
