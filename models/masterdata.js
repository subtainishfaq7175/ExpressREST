/**
 * Created by subtainishfaq on 10/18/16.
 */

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var masterdataSchema = new Schema({
    title: String,
    content:String,
    secondary:String,
    content_type:String
});



module.exports = mongoose.model('Masterdata', masterdataSchema);