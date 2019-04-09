const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_name: {type: String, required: true},
    active_bookings: [{
    	hotel_id: String,
    	room_id: String,
    	from_date: Date,
    	till_Date: Date
    }]
});

let user = mongoose.model('user', userSchema);
module.exports = user;
