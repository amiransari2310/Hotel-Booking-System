const fs = require('fs');
const mongoose = require('mongoose');
const config = require('../config/config.js').config;
const user = require('../models/user.js');

/*
Function to add booking detail for users
Inputs:
- id
	- type: Valid Object Id
	- source: In params
- bookingDetails
	- type: Valid JSON Object
	- source: In params
Output: JSON Object
*/
addBookingForUser = async (id, bookingDetails) => {
  try {
    let updateResponse = await user.findByIdAndUpdate(id, {$push:{active_bookings: bookingDetails}});
    return updateResponse;
  } catch(e) {
    throw new Error(e);
  }
}


module.exports = {
  addBookingForUser
}