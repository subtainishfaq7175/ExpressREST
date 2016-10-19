/**
 * Created by subtainishfaq on 10/20/16.
 */
/**
 * Created by subtainishfaq on 10/18/16.
 */
var Walkthrough = require('../models/walkthrough');
var express = require('express');
var router = express.Router();

router.route('/walkthrough')
    .get(function(req, res) {
        /*  console.log("inget");
         Walkthrough.paginate({}, { page: 1, limit: 10 }, function(error, pageCount, paginatedResults) {
         if (error) {
         console.error(error);
         res.send(error);
         } else {
         //  console.log('Pages:', pageCount);
         //  console.log(paginatedResults);
         res.json(pageCount);
         }
         });*/
        Walkthrough.find(function(err, walkthrough) {
            if (err) {
                return res.send(err);
            }

            res.json(walkthrough);
        });
    })

    .post(function(req, res) {
        var walkthrough = new Walkthrough(req.body);
        /* if(req.files.file)
         {   // If the Image exists
         var fs = require('node-fs');
         fs.readFile(req.files.file.path, function (dataErr, data) {
         if(data) {
         walkthrough.image ='';
         walkthrough.image = data;  // Assigns the image to the path.

         }
         });
         }*/

        walkthrough.save(function(err) {
            if (err) {
                return res.send(err);
            }

            res.send({ message: 'Walkthrough Added' });
        });
    });

router.route('/walkthrough/:id').put(function(req,res){
    Walkthrough.findOne({ _id: req.params.id }, function(err, walkthrough) {
        if (err) {
            return res.send(err);
        }

        for (prop in req.body) {
            walkthrough[prop] = req.body[prop];
        }

        // save the walkthrough
        walkthrough.save(function(err) {
            if (err) {
                return res.send(err);
            }

            res.json({ message: 'Walkthrough updated!' });
        });
    });
});


router.route('/walkthrough/:id').get(function(req, res) {
    Walkthrough.findOne({ _id: req.params.id}, function(err, walkthrough) {
        if (err) {
            return res.send(err);
        }

        res.json(walkthrough);
    });
});

router.route('/walkthrough/:id').get(function(req, res) {
    Walkthrough.findOne({ _id: req.params.id}, function(err, walkthrough) {
        if (err) {
            return res.send(err);
        }

        res.json(walkthrough);
    });
});


router.route('/walkthrough/:id').delete(function(req, res) {
    Walkthrough.remove({
        _id: req.params.id
    }, function(err, walkthrough) {
        if (err) {
            return res.send(err);
        }

        res.json({ message: 'Successfully deleted' });
    });
});

router.route('/walkthroughupdate/')
    .get(function(req, res) {
        Walkthrough.find(function(err, walkthrough) {
            if (err) {
                return res.send(err);
            }

            res.json(walkthrough);
        }).limit(5);
    });
router.route('/walkthroughfeed/')
    .get(function(req, res) {

        Walkthrough.find({is_feed:true},function(err, walkthrough) {
            if (err) {
                return res.send(err);
            }

            res.json(walkthrough);
        })
    });

/*

 router.route('/walkthroughimage/:id').post(function(req, res) {
 var walkthrough = new Walkthrough(req.body);

 walkthrough.save(function(err) {
 if (err) {
 return res.send(err);
 }

 res.send({ message: 'Walkthrough Added' });
 });
 });

 put(function(req,res){
 Walkthrough.findOne({ _id: req.params.id }, function(err, walkthrough) {
 if (err) {
 return res.send(err);
 }

 for (prop in req.body) {
 walkthrough[prop] = req.body[prop];
 }

 // save the walkthrough
 walkthrough.save(function(err) {
 if (err) {
 return res.send(err);
 }

 res.json({ message: 'Walkthrough updated!' });
 });
 });
 });
 */

module.exports = router;
