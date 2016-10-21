/**
 * Created by subtainishfaq on 10/18/16.
 */

var mongoose=require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema=mongoose.Schema;

var letsplaySchema = new Schema({
    title: String,
    content: String,
    imgae_url: String,
    title_detials:{},
    stream_url: {},
    details: {},
    language: String,
    is_feed:Boolean,
    image:Buffer,
    episodes: [{
        episode_title:String,
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

    created_time:  { type: Date, default: Date.now }

});
letsplaySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Letsplay', letsplaySchema);