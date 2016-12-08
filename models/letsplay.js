/**
 * Created by subtainishfaq on 10/18/16.
 */

var mongoose=require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema=mongoose.Schema;

var letsplaySchema = new Schema({
    title: String,
    alternate_title: String,
    short_title:String,
    content: String,
    image_url: String,
    title_detials:{},
    stream_url: {},
    details: {},
    language: String,
    is_feed:Boolean,
    is_censored:Boolean,
    image:Buffer,
    screen_images:[{image_url:String}],
    genre:[{title:String}],
    chanel:String,
    episodes_number:Number,
    episodes: [{
        title:String,
        language : String,
        release_date: { type: Date, default: Date.now },
        streams:
            [
                {
                    title:String,
                    url:String,
                    link_type:String


                }
            ]
                }],

    created_time:  { type: Date, default: Date.now },
    release_date:  { type: Date, default: Date.now },
    tags:[{
        title:String
    }],
    season:String,
    length:Number,
    screen_shots:[{image_url:String}],
    likes : { count: {type :Number ,default :0},   _creator :[ { type: Schema.Types.ObjectId, ref: 'User'  ,defualt :0 }]
    },
    favourites :{ count: {type :Number ,default :0},   _creator :[ { type: Schema.Types.ObjectId, ref: 'User'  ,defualt :0 }]
    },
    dislikes : { count: {type :Number ,default :0},   _creator :[ { type: Schema.Types.ObjectId, ref: 'User'  ,defualt :0 }]
    }

});
letsplaySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Letsplay', letsplaySchema);