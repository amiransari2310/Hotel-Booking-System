const model = require('../models/hotel.js');
const util = require('../helpers/utils.js');

/*
Function to list all hotel
Inputs:
- filter
	- type: Stringify Valid JSON Object
	- Source: In query
Output: JSON Object
*/
list = async (req, res) => {
	try {
		let filter = (req.query.filter) ? JSON.parse(req.query.filter) : {};
		let hotels = await model.find(filter).lean();
		if(!hotels || (hotels && hotels.length === 0)) res.status(200).json({statusCode: 204, status: "NO_CONTENT", message: "No Hotels Found.", data: hotels || []});
		else res.status(200).json({statusCode: 200, status: "SUCCESS", message: "Hotels Fetched Successfully.", data: hotels});
	} catch(err) {
    	console.log("Error While Fetching Hotels: ", err);
    	res.status(400).json({statusCode: 400, status: "FAIL", message: "Something Went Wrong While Fetching Hotels."});
	}
}

/*
Function to get a unique hotel with Id
Inputs:
- id
	- type: Valid Object Id
	- Source: In path
Output: JSON Object
*/
get = async (req, res) => {
	try {
		let hotel = await model.findById(req.params.id);
		if(!hotel) res.status(200).json({statusCode: 204, status: "NO_CONTENT", message: "No Hotel Found.", data: hotel});
		else res.status(200).json({statusCode: 200, status: "SUCCESS", message: "Hotel Fetched Successfully.", data: hotel});
	} catch(err) {
    	console.log("Error While Fetching Hotel: ", err);
    	res.status(400).json({statusCode: 400, status: "FAIL", message: "Something Went Wrong While Fetching Hotel."});
	}
}

/*
Function to add a hotel
Inputs:
- Payload
	- type: Valid JSON Object
	- Source: In body
Output: JSON Object
*/
add = async (req, res) => {
	try {
		let hotel = await model.create(req.body);
		res.status(200).json({statusCode: 200, status: "SUCCESS", message: "Hotel Added Successfully.", data: hotel});
	} catch(err) {
    	console.log("Error While Adding hotel: ", Object.keys(err));
    	res.status(400).json({statusCode: 400, status: "FAIL", message: err.message || "Something Went Wrong While Adding Hotel."});		
	}
}

/*
Function to update hotel
Inputs:
- id
	- type: Valid Object Id
	- Source: In path
- Payload
	- type: Valid JSON Object
Output: JSON Object
*/
update = async (req, res) => {
	try {
		let hotel = await model.findByIdAndUpdate(req.params.id, req.body);
		res.status(200).json({statusCode: 200, status: "SUCCESS", message: "Hotel Updated Successfully.", data: hotel});
	} catch(err) {
    	console.log("Error While Updating Hotel: ", err);
    	res.status(400).json({statusCode: 400, status: "FAIL", message: "Something Went Wrong While Updating Hotel."});		
	}
}

/*
Function to delet a hotel
Inputs:
- id
	- type: Valid Object Id
	- Source: In path
Output: JSON Object
*/
remove = async (req, res) => {
	try {
		let hotel = await model.findById(req.params.id);
		deleteResponse = (!hotel) ? hotel : await hotel.remove();
		let response = (!deleteResponse) ? {statusCode: 204, status: "NO_CONTENT", message: "Hotel Does Not Exist.", data: deleteResponse} : {statusCode: 200, status: "SUCCESS", message: "Hotel Deleted Successfully.", data: deleteResponse};
		res.status(200).json(response);
	} catch(err) {
    	console.log("Error While Deleting Hotel: ", err);
    	res.status(400).json({statusCode: 400, status: "FAIL", message: "Something Went Wrong While Deleting Hotel."});		
	}
}

/*
Function to add a room in a hotel
Inputs:
- id
	- type: Valid Object Id
	- Source: In path
- Payload
	- Valid JSON Object
Output: JSON Object
*/
addRoom = async (req, res) => {
	try {
		let hotel = await model.findByIdAndUpdate(req.params.id, {$push:{rooms: req.body}});
		res.status(200).json({statusCode: 200, status: "SUCCESS", message: "Room Added Successfully.", data: hotel});
	} catch(err) {
    	console.log("Error While Adding Room: ", err);
    	res.status(400).json({statusCode: 400, status: "FAIL", message: "Something Went Wrong While Adding Room."});		
	}
}

/*
Function to list all available rooms within hotel for the given dates
Inputs:
- id
	- type: Valid Object Id
	- path: In path
- Payload
	- type: JSON Object with valid dates
	- path: In body
Output: JSON Object
*/
getAvailableRooms = async (req, res) => {
	try {
		if(!req.body.fromDate || !req.body.tillDate || (req.body.fromDate && req.body.tillDate && (new Date(req.body.fromDate) >= new Date(req.body.tillDate)))) res.status(200).json({statusCode: 422, status: "VALIDATION_FAIL", message: "Insufficient/Invalid Input.", data: null});
		let hotel = await model.findById(req.params.id).lean();
		if(!hotel) res.status(200).json({statusCode: 204, status: "NO_CONTENT", message: "Hotel Does Not Exist.", data: hotel});
		else if(hotel.rooms.length === 0) res.status(200).json({statusCode: 204, status: "NO_CONTENT", message: "Rooms Not Available In This Hotel.", data: hotel});
		else {
			let allAvailableRooms = [];
			hotel.rooms.forEach((room) => {
				let availableRooms = room.bookings.filter((booking) => {
					return (((new Date(booking.from_date) <= new Date(req.body.fromDate)) && (new Date(booking.till_date) >= new Date(req.body.fromDate))) || 
						((new Date(booking.from_date) <= new Date(req.body.tillDate)) && (new Date(booking.till_date) >= new Date(req.body.tillDate))));
				});
				if(availableRooms.length === 0) allAvailableRooms.push(room._id);
			});
			if(allAvailableRooms.length === 0) res.status(200).json({statusCode: 204, status: "NO_CONTENT", message: "Rooms Not Available In This Hotel.", data: hotel});
			else res.status(200).json({statusCode: 200, status: "SUCCESS", message: "Available Rooms With Range Fetched Successfully.", data: {id: hotel._id, availableRooms: allAvailableRooms}});
		}
	} catch(err) {
    	console.log("Error While Fetching Available Rooms With Range: ", err);
    	res.status(400).json({statusCode: 400, status: "FAIL", message: "Something Went Wrong While Fetching Available Rooms With Range."});
	}
}

/*
Function to book a room in a hotel
Inputs:
- hotelId
	- type: Valid Object Id
	- path: In path
- userId
	- type: Valid Object Id
	- path: In path	
- Payload
	- type: JSON Object with valid dates
	- path: In body
Output: JSON Object
*/
bookRoom = async (req, res) => {
	try {
		if(!req.body.fromDate || !req.body.tillDate || (req.body.fromDate && req.body.tillDate && (new Date(req.body.fromDate) >= new Date(req.body.tillDate)))) res.status(200).json({statusCode: 422, status: "VALIDATION_FAIL", message: "Insufficient/Invalid Input.", data: null});
		else {
			let hotel = await model.findById(req.params.hotelId).lean();
			if(!hotel) res.status(200).json({statusCode: 204, status: "NO_CONTENT", message: "Hotel Does Not Exist.", data: hotel});
			else if(hotel.rooms.length === 0) res.status(200).json({statusCode: 204, status: "NO_CONTENT", message: "Rooms Not Available In This Hotel.", data: hotel});
			else {
				let allAvailableRooms = [];
				hotel.rooms.forEach((room) => {
					let availableRooms = room.bookings.filter((booking) => {
						return (((new Date(booking.from_date) <= new Date(req.body.fromDate)) && (new Date(booking.till_date) >= new Date(req.body.fromDate))) || 
							((new Date(booking.from_date) <= new Date(req.body.tillDate)) && (new Date(booking.till_date) >= new Date(req.body.tillDate))));
					});
					if(availableRooms.length === 0) allAvailableRooms.push(room._id);
				});
				if(allAvailableRooms.length === 0) res.status(200).json({statusCode: 204, status: "NO_CONTENT", message: "Rooms Not Available In This Hotel.", data: hotel});
				else {
					let roomToBook = allAvailableRooms[0];
					let updatedRooms = hotel.rooms.map((room) => {
						if(room._id === roomToBook) room.bookings.push({booked_by: req.params.userId, from_date: new Date(req.body.fromDate), till_date: new Date(req.body.tillDate)});
						return room;
					});
					let booked = await model.updateOne({_id: req.params.hotelId}, {$set: {rooms: updatedRooms}});
					let userUpdate = await util.addBookingForUser(req.params.userId, {hotel_id: req.params.hotelId, room_id: roomToBook._id, from_date: new Date(req.body.fromDate), till_date: new Date(req.body.tillDate)});
					res.status(200).json({statusCode: 200, status: "SUCCESS", message: "Room booked Successfully.", data: {room_id: roomToBook._id, booked_by: req.params.userId, from_date: req.body.fromDate, till_date: req.body.tillDate}});
				}
			}
		}
	} catch(err) {
    	console.log("Error While Booking Room: ", err);
    	res.status(400).json({statusCode: 400, status: "FAIL", message: "Something Went Wrong While Booking Room."});
	}
}

bookRoomById = async (req, res) => {
	try {
		if(!req.body.fromDate || !req.body.tillDate || (req.body.fromDate && req.body.tillDate && (new Date(req.body.fromDate) >= new Date(req.body.tillDate)))) res.status(200).json({statusCode: 422, status: "VALIDATION_FAIL", message: "Insufficient/Invalid Input.", data: null});
		else {
			let hotel = await model.findById(req.params.hotelId).lean();
			if(!hotel) res.status(200).json({statusCode: 204, status: "NO_CONTENT", message: "Hotel Does Not Exist.", data: hotel});
			else if(hotel.rooms.length === 0) res.status(200).json({statusCode: 204, status: "NO_CONTENT", message: "Given Room Does Not Exist In This Hotel.", data: hotel});
			else {
				let room = hotel.rooms.find(room => room._id.toString() === req.params.roomId);
				if(!room) res.status(200).json({statusCode: 204, status: "NO_CONTENT", message: "Given Room Does Not Exist In This Hotel.", data: hotel});
				else {
					let availableRooms = room.bookings.filter((booking) => {
						return (((new Date(booking.from_date) <= new Date(req.body.fromDate)) && (new Date(booking.till_date) >= new Date(req.body.fromDate))) || 
							((new Date(booking.from_date) <= new Date(req.body.tillDate)) && (new Date(booking.till_date) >= new Date(req.body.tillDate))));
					});
					if(availableRooms.length !== 0) res.status(200).json({statusCode: 200, status: "SUCCESS", message: "Room Not Available For Given Dates.", data: hotel});
					else {
						let updatedRooms = hotel.rooms.filter(room => room._id.toString() !== req.params.roomId);
						room.bookings.push({booked_by: req.params.userId, from_date: new Date(req.body.fromDate), till_date: new Date(req.body.tillDate)});
						updatedRooms.push(room);
						let booked = await model.updateOne({_id: req.params.hotelId}, {$set: {rooms: updatedRooms}});
						let userUpdate = await util.addBookingForUser(req.params.userId, {hotel_id: req.params.hotelId, room_id: room._id, from_date: new Date(req.body.fromDate), till_date: new Date(req.body.tillDate)});
						res.status(200).json({statusCode: 200, status: "SUCCESS", message: "Room booked Successfully.", data: {room_id: room._id, booked_by: req.params.userId, from_date: req.body.fromDate, till_date: req.body.tillDate}});
					}
				}
			}
		}
	} catch(err) {
    	console.log("Error While Booking Room: ", err);
    	res.status(400).json({statusCode: 400, status: "FAIL", message: "Something Went Wrong While Booking Room."});
	}
}

module.exports = {
	list,
	add,
	get,
	update,
	remove,
	addRoom,
	bookRoom,
	bookRoomById,
	getAvailableRooms
}