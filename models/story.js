const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema({
    title:{type: String, required: [true, 'title is required']},
    author: {type: Schema.Types.ObjectId, ref:'User'},
    content: {type: String, required: [true, 'content is required'], 
        minLength: [10, 'The content should have at least ten characters']},
    startTime: {type: String, required: [true, 'Start time is required']},
    endTime: {type: String, required: [true, 'End time is required']},
    location: {type: String, require: [true, 'location is required']},
    host: {type: String, required: [true, 'host is required']},
    category: {type: String, required: [true, 'category is required']}
},
{timestamps: true}
);

//collection name is stories in the database
module.exports = mongoose.model('Story', storySchema);

