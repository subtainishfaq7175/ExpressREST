/**
 * Created by subtainishfaq on 12/6/16.
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var messageSchema = new Schema({
    name: String,
    username:  { type: String, default: "anonymous" },
    subject: String,
    content:  { type: String, default: "General" }


});

messageSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Message', messageSchema);