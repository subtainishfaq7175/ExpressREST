/**
 * Created by subtainishfaq on 10/18/16.
 */
var News = require('../models/news');
var express = require('express');
var router = express.Router();

router.route('/news')
    .get(function(req, res) {
    News.find(function(err, news) {
        if (err) {
            return res.send(err);
        }

        res.json(news);
    });
})

.post(function(req, res) {
    var news = new News(req.body);

    news.save(function(err) {
        if (err) {
            return res.send(err);
        }

        res.send({ message: 'News Added' });
    });
});

router.route('/news/:id').put(function(req,res){
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
    News.remove({
        _id: req.params.id
    }, function(err, news) {
        if (err) {
            return res.send(err);
        }

        res.json({ message: 'Successfully deleted' });
    });
});

module.exports = router;
