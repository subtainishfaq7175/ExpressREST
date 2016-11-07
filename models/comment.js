/**
 * Created by subtainishfaq on 11/3/16.
 */

var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var commentSchema = new Schema(


{
    discussion_id: String,
    content: String,
    user_id : String,
    date:   { type: Date, default: Date.now }

}



    );


commentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Comment', commentSchema);