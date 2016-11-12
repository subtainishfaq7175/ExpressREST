/**
 * Created by subtainishfaq on 10/18/16.
 */

var mongoose=require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema=mongoose.Schema;

var walkthroughSchema = new Schema({
    title: String,
    series: String,
    artist: String,
    translator: String,
    scanlator: String,
    magazine: String,
    language: String,
    release_date: String,
    content: String,
    download_url: String,
    created_time:  { type: Date, default: Date.now },
    image_url: String,
    genre:[{title:String}],
    flags:[{title:String , image_url:String}],
    tags:[{title:String}],
    chapters:[
        {title:String,
         images :[
             {
                 image_url: String
             }
         ]
        }],
    sorting_order:Number




});

walkthroughSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Walkthrough', walkthroughSchema);