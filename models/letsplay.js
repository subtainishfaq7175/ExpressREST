/**
 * Created by subtainishfaq on 10/18/16.
 */

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var letsplaySchema = new Schema({
    title: String,
    content: String,
    imgae_url: String,
    title_detials:{},
    stream_url: {},
    details: {}
});

module.exports = mongoose.model('Letsplay', letsplaySchema);