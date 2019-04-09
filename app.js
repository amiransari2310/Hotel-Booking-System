const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config.js').config;
const hotelController = require('./controllers/hotelController.js');
const userController = require('./controllers/userController.js')
const util = require('./helpers/utils.js');

mongoose.Promise = global.Promise;

// connecting mongo
mongoose.connect(config.mongoURI, { useNewUrlParser: true }); 

// When successfully connected
mongoose.connection.on('connected', function () {  
  	console.log('Mongoose default connection open to ' + config.mongoURI);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  	console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  	console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  	mongoose.connection.close(function () { 
    	console.log('Mongoose default connection disconnected through app termination'); 
    	process.exit(0); 
  	}); 
}); 

// create express app
const app = express();
app.set('json spaces', 2);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Hotel routes
app.get('/hotel', hotelController.list);
app.get('/hotel/:id', hotelController.get);
app.post('/hotel', hotelController.add);
app.put('/hotel/:id', hotelController.update);
app.delete('/hotel/:id', hotelController.remove);

app.post('/hotel/room/:id', hotelController.addRoom);
app.post('/hotel/getAvailableRooms/:id', hotelController.getAvailableRooms);
app.post('/hotel/bookRoom/:hotelId/:userId', hotelController.bookRoom);
app.post('/hotel/bookRoom/:hotelId/:roomId/:userId', hotelController.bookRoomById);

// User routes
app.get('/user', userController.list);
app.get('/user/:id', userController.get);
app.post('/user', userController.add);
app.put('/user/:id', userController.update);
app.delete('/user/:id', userController.remove);


// listen for requests
app.listen(3000, (err, result) => {
    if(!err) console.log("Server is listening on port 3000");
    else console.log("Error while connecting to port: 3000");
});

module.exports = app;