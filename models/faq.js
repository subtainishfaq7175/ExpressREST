/**
 Created by subtainishfaq on 10/18/16.
 **/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var faqSchema = new Schema({
    title: String,
    creation_date:  { type: Date, default: Date.now },
    content: String,
    created_time:  { type: Date, default: Date.now }


});

faqSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Faq', faqSchema);