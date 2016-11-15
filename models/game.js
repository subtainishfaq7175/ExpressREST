/**
 * Created by subtainishfaq on 10/18/16.
 */

var mongoose=require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema=mongoose.Schema;

var gameSchema = new Schema({
    title: String,
    release_date: Date,
    studio: String,
    series: String,
    file_size: String,
    cpu: String,
    memory: String,
    directx: String,
    trailer_link: String,
    created_time:  { type: Date, default: Date.now },
    content: String,
    steam_url: String,
    buy_url: String,
    is_feed: Boolean,
    image_url: String,
    categories:[{title:String}],
    genre:[{title:String}],
    languages:[{title:String}],
    os:String,
    tags:[{title:String}],
    amazon_url:String,
    gamestop_url:String,
    screen_images:[{image_url:String}],




});

gameSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Game', gameSchema);