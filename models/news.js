/**
 Created by subtainishfaq on 10/18/16.
 **/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var newsSchema = new Schema({
    title: String,
    release_date:  { type: Date, default: Date.now },
    image_url: String,
    content: String,
    language: String,
    created_time:  { type: Date, default: Date.now },
    is_feed:Boolean,
    image:Buffer,
    tags: [{title:String}]

});

newsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('News', newsSchema);