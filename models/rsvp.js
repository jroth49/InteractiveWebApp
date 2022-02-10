const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    rsvp: {type: String, required:[true, 'RSVP is required']},
    user: {type: Schema.Types.ObjectId, ref:'User', require:[true, 'User is required']},
    story: {type: Schema.Types.ObjectId, ref: 'Story', required: [true, 'Story is required']}
}, {timestamps: true});

module.exports = mongoose.model('Rsvp', rsvpSchema);
