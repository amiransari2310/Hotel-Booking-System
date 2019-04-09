const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const util = require('../helpers/utils.js');

const roomSchema = new mongoose.Schema({
    room_number: {type: String, required: true},
    bookings: [{
		booked_by: {type: String, ref: 'user'},
		from_date: Date,
		till_date: Date
    }]
});

const hotelSchema = new Schema({
    hotel_name: {type: String, required: true},
    address: String,
    rooms: [roomSchema]
});

let hotel = mongoose.model('hotel', hotelSchema);
module.exports = hotel;
