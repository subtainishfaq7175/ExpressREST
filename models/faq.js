/**
 Created by subtainishfaq on 10/18/16.
 **/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var faqSchema = new Schema({
    title: String,
    creation_date:  { type: Date, default: Date.now },
    content: String

});

faqSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Faq', faqSchema);