/**
 Created by subtainishfaq on 10/18/16.
 **/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var newsSchema = new Schema({
    title: String,
    release_date:  { type: Date, default: Date.now },
    image_url: String,
    content: String,
    language: String,
    created_time:  { type: Date, default: Date.now },
    is_feed:Boolean,
    image:Buffer,
    tags: [{title:String}],
    likes : { count: {type :Number ,default :0},   _creator :[ { type: Schema.Types.ObjectId, ref: 'User'  ,defualt :0 }]
    },
    favourites :{ count: {type :Number ,default :0},   _creator :[ { type: Schema.Types.ObjectId, ref: 'User'  ,defualt :0 }]
    },
    dislikes : { count: {type :Number ,default :0},   _creator :[ { type: Schema.Types.ObjectId, ref: 'User'  ,defualt :0 }]
    },
    comments : [ { title: String,   _creator :{ type: Schema.Types.ObjectId, ref: 'User'  ,defualt :0 } , username :String, time : { type: Date, default: Date.now }
    }]

});

newsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('News', newsSchema);