/**
 * Created by subtainishfaq on 10/18/16.
 */

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var gameSchema = new Schema({
    title: String,
    release_date: String,
    os: String,
    studio: String,
    series: String,
    language: String,
    category: String,
    genre: String,
    tags: String,
    trailer: String,
    content: String,
    imge_url: String,
    steam_url: String,
    buy_url: String,
    extra: String,
    language: String,
    is_feed: Boolean,

});

module.exports = mongoose.model('Game', gameSchema);