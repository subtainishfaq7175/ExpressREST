/**
 * Created by subtainishfaq on 11/3/16.
 */

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var commentSchema = new Schema(


{
    discussion_id: String,
    content: String,
    user : String,
      date:   { type: Date, default: Date.now }

}



    );



module.exports = mongoose.model('Comment', commentSchema);