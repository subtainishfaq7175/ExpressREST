/**
 Created by subtainishfaq on 10/18/16.
 **/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var newsSchema = new Schema({
    title: String,
    release_dear: String,
    image_url: String,
    content: String,
    language: String,
    is_feed:Boolean,
    image:Buffer

});

newsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('News', newsSchema);