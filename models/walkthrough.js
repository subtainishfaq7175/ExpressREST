/**
 * Created by subtainishfaq on 10/18/16.
 */

var mongoose=require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema=mongoose.Schema;

var walkthroughSchema = new Schema({
    title: String,
    release_date: String,
    content: String,
    download_url: String,
    image_url: String,
    categories:[{title:String}],
    genre:[{title:String}],
    flags:[{title:String , image_url:String}],
    tags:[{title:String}],
    screen_images:[{image_url:String}],
    sorting_order:Number




});

walkthroughSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Walkthrough', walkthroughSchema);