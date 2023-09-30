const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	date: {
		type: Date, 
		required: true
	},
	text: {
		type: String,
		required: true
	},
	owner: {
		type: mongoose.Types.ObjectId
	},
	room: {
		type: mongoose.Types.ObjectId
	}
});

module.exports = mongoose.model('Message', MessageSchema);