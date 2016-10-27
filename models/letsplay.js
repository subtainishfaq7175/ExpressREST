/**
 * Created by subtainishfaq on 10/18/16.
 */

var mongoose=require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema=mongoose.Schema;

var letsplaySchema = new Schema({
    title: String,
    content: String,
    image_url: String,
    title_detials:{},
    stream_url: {},
    details: {},
    language: String,
    is_feed:Boolean,
    image:Buffer,
    short_titles:[{title:String}],
    alternative_titles:[{title:String}],
    screen_images:[{image_url:String}],
    genre:[{title:String}],
    chanell:[{title:String}],
    episodes: [{
        title:String,
        streams:
            [
                {
                    title:String,
                    stream_links:
                    [
                        {
                            url:String,
                            isYoutube:Boolean,
                            isDailymotion:Boolean,
                            isVimeo:Boolean,
                        }
                    ]
                }
            ]
                }],

    created_time:  { type: Date, default: Date.now },
    release_date:  { type: Date, default: Date.now },
    tags:[{
        title:String
    }],
    season:String,
    length:Number

});
letsplaySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Letsplay', letsplaySchema);