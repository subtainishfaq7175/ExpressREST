/**
 * Created by subtainishfaq on 10/20/16.
 */
var mongoose=require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema=mongoose.Schema;

var walkthroughSchema = new Schema({
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


walkthroughSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Walkthrough', walkthroughSchema);