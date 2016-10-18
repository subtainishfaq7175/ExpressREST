/**
 * Created by subtainishfaq on 10/18/16.
 */
var Letsplays = require('../models/letsplay');
var express = require('express');
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
        /*
    Letsplays.find(function(err, letsplays) {
        if (err) {
            return res.send(err);
        }

        res.json(letsplays);
    });
*/
})

.post(function(req, res) {
    var letsplay = new Letsplays(req.body);

    letsplay.save(function(err) {
        if (err) {
            return res.send(err);
        }

        res.send({ message: 'Letsplay Added' });
    });
});

router.route('/letsplays/:id').put(function(req,res){
    Letsplay.findOne({ _id: req.params.id }, function(err, letsplay) {
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
});


router.route('/letsplays/:id').get(function(req, res) {
    Letsplay.findOne({ _id: req.params.id}, function(err, letsplay) {
        if (err) {
            return res.send(err);
        }

        res.json(letsplay);
    });
});

router.route('/letsplays/:id').delete(function(req, res) {
    Letsplay.remove({
        _id: req.params.id
    }, function(err, letsplay) {
        if (err) {
            return res.send(err);
        }

        res.json({ message: 'Successfully deleted' });
    });
});



router.route('/letsplayupdate/')
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


module.exports = router;
