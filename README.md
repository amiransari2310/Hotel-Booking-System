# HBS
HBS - Hotel Booking System API

How to start?

=> Execute the below command to install npm pacage dependies:
- npm i / npm install

=> To Start the Node Server execute the below mentioned command:
- node app.js

Note: Make sure mongo db server is up and running on your local machine

=> To run the test cases: npm run test

------------------------------------------------ API Routes ------------------------------------------------\

=> GET URL's:

-> /hotel:

URI: http://localhost:3000/hotel
Description: API to get list of hotels

Query Params:

filter: Stringify JSON Object to filter documents

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": [{}] }

-> /hotel/:id
Description: API to get a specific hotel using Id

URI: http://localhost:3000/hotel/:id

Query Params: None

Route Param:

id: String

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": {} }

-> /user:

URI: http://localhost:3000/user
Description: API to get list of users

Query Params:

filter: Stringify JSON Object to filter documents

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": [{}] }

-> /user/:id

URI: http://localhost:3000/user/:id
Description: API to get a specific user using Id

Query Params: None

Route Param:

id: String

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": {} }

=> POST URL's:

-> /hotel

URI: http://localhost:3000/hotel
Description: API to add a hotel

Query Params: None

Route Param: None

Request Strcture:
{   
    "hotel_name" : String,
    "rooms": [{
        "room_number": String
    }]
}

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": {} }

-> /user

URI: http://localhost:3000/user
Description: API to add a user

Query Params: None

Route Param: None

Request Strcture:
{   
    "user_name": String
}

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": {} }

-> /hotel/room/:id

URI: http://localhost:3000/hotel/room/:id
Description: API to add a room to a hotel

Route Param:

id: String

Request Strcture:
{   
    "room_number": String
}

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": {} }

-> /hotel/getAvailableRooms/:id

URI: http://localhost:3000/hotel/getAvailableRooms/:id
Description: API to get all available rooms in a hotel

Route Param:

id: String

Request Strcture:
{   
    "fromDate": Date,
    "tillDate": Date
}

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": {"id": String, "availableRooms": [String]} }

-> /hotel/bookRoom/:hotelId/:userId

URI: http://localhost:3000/hotel/bookRoom/:hotelId/:userId
Description: API to book a room in a hotel

Route Param:

hotelId: String,
userId: String

Request Strcture:
{   
    "fromDate": Date,
    "tillDate": Date
}

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": {"room_id": String, "booked_by": String, "from_date": Date, "till_date": Date} }

-> /hotel/bookRoom/:hotelId/:roomId/:useId

URI: http://localhost:3000/hotel/bookRoom/:hotelId/:roomId/:userId
Description: API to book a room in a specific room in a hotel

Route Param:

hotelId: String,
roomId: String,
userId: String

Request Strcture:
{   
    "fromDate": Date,
    "tillDate": Date
}

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": {"room_id": String, "booked_by": String, "from_date": Date, "till_date": Date} }

=> PUT URL's:

-> /hotel/:id

URI: http://localhost:3000/hotel/:id
Description: API to update a hotel

Query Params: None

Route Param: 

id: String

Request Strcture:
{   
    "hotel_name" : String,
    "rooms": [{
        "room_number": String,
        "bookings": [{
            "booked_by": String,
            "from_date": Date,
            "till_date": Date
        }]
    }]
}

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": {} }

-> /user/:id

URI: http://localhost:3000/user/:id
Description: API to update a user

Query Params: None

Route Param:

id: String

Request Strcture:
{   
    "user_name": String,
    "active_bookings": [{
        hotel_id: String,
        room_id: String,
        from_date: Date,
        till_Date: Date
    }]
}

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": {} }

=> DELETE URL's:

-> /hotel/:id

URI: http://localhost:3000/hotel/:id
Description: API to delete a hotel

Query Params: None

Route Param: 

id: String

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": {} }

-> /user/:id

URI: http://localhost:3000/user/:id
Description: API to delete a user

Query Params: None

Route Param:

id: String

Response Strcture:
{ "statusCode": String, "status": String, "message": String, "data": {} }