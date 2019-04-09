const model = require('../models/user.js');

/*
Function to list all user
Inputs:
- filter
	- type: Stringify Valid JSON Object
	- Source: In query
Output: JSON Object
*/
list = async (req, res) => {
	try {
		let filter = (req.query.filter) ? JSON.parse(req.query.filter) : {};
		let users = await model.find(filter).lean();
		if(!users || (users && users.length === 0)) res.status(200).json({statusCode: 204, status: "NO_CONTENT", message: "No Users Found.", data: users || []});
		else res.status(200).json({statusCode: 200, status: "SUCCESS", message: "Users Fetched Successfully.", data: users});
	} catch(err) {
    	console.log("Error While Fetching Users: ", err);
    	res.status(400).json({statusCode: 400, status: "FAIL", message: "Something Went Wrong While Fetching Users."});
	}
}

/*
Function to get a unique user with Id
Inputs:
- id
	- type: Valid Object Id
	- Source: In path
Output: JSON Object
*/
get = async (req, res) => {
	try {
		let user = await model.findById(req.params.id);
		if(!user) res.status(200).json({statusCode: 204, status: "NO_CONTENT", message: "No User Found.", data: user});
		else res.status(200).json({statusCode: 200, status: "SUCCESS", message: "User Fetched Successfully.", data: user});
	} catch(err) {
    	console.log("Error While Fetching User: ", err);
    	res.status(400).json({statusCode: 400, status: "FAIL", message: "Something Went Wrong While Fetching User."});
	}
}

/*
Function to add a user
Inputs:
- Payload
	- type: Valid JSON Object
	- Source: In body
Output: JSON Object
*/
add = async (req, res) => {
	try {
		let user = await model.create(req.body);
		res.status(200).json({statusCode: 200, status: "SUCCESS", message: "User Added Successfully.", data: user});
	} catch(err) {
    	console.log("Error While Adding User: ", Object.keys(err));
    	res.status(400).json({statusCode: 400, status: "FAIL", message: err.message || "Something Went Wrong While Adding User."});		
	}
}

/*
Function to update user
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
		let user = await model.findByIdAndUpdate(req.params.id, req.body);
		res.status(200).json({statusCode: 200, status: "SUCCESS", message: "User Updated Successfully.", data: user});
	} catch(err) {
    	console.log("Error While Updating User: ", err);
    	res.status(400).json({statusCode: 400, status: "FAIL", message: "Something Went Wrong While Updating User."});		
	}
}

/*
Function to delet a user
Inputs:
- id
	- type: Valid Object Id
	- Source: In path
Output: JSON Object
*/
remove = async (req, res) => {
	try {
		let user = await model.findById(req.params.id);
		deleteResponse = (!user) ? user : await user.remove();
		let response = (!deleteResponse) ? {statusCode: 204, status: "NO_CONTENT", message: "User Does Not Exist.", data: deleteResponse} : {statusCode: 200, status: "SUCCESS", message: "User Deleted Successfully.", data: deleteResponse};
		res.status(200).json(response);
	} catch(err) {
    	console.log("Error While Deleting User: ", err);
    	res.status(400).json({statusCode: 400, status: "FAIL", message: "Something Went Wrong While Deleting User."});		
	}
}

module.exports = {
	list,
	get,
	add,
	update,
	remove
}