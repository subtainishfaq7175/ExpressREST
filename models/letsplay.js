/**
 * Created by subtainishfaq on 10/18/16.
 */

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var letsplaySchema = new Schema({
    title: String,
    releaseYear: String,
    director: String,
    genre: String
});

module.exports = mongoose.model('Letsplay', letsplaySchema);