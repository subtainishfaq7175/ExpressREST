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
    trailer: String,
    content: String,
    steam_url: String,
    buy_url: String,
    extra: String,
    is_feed: Boolean,
    image:Buffer,
    image_url: String,
    categories:[{title:String}],
    genre:[{title:String}],
    languages:[{title:String}],
    os:[{title:String}],
    tags:[{title:String}],
    amazon_url:String,
    gamestop_url:String,
    screen_images:[{image_url:String}],
    operational_requirements:[{title:String}]




});

gameSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Game', gameSchema);