const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
	title: {
		type: String, 
		required: true,
		unique: true
	},
	description: {
		type: String,
		unique: true
	},
	messages: {
		type: Array
	},
    ownerId:{
        type: mongoose.Types.ObjectId
    }

});

module.exports = mongoose.model('Room', RoomSchema);