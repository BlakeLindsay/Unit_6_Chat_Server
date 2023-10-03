const router = require("express").Router();
const Room = require("../models/room.model");
const Message = require("../models/message.model");
const validateSession = require('../middleware/validateSession');


function errorResponse(res, error) {
	res.status(500).json({
		ERROR: error.message
	});
};

router.post("/message/:room/:text", validateSession, async (req, res) => {
	try {
		if (!req.params.room || !req.params.text || !req.user._id) {
			throw new Error("something is wrong");
		}

		const room = await Room.findOne({ _id: req.params.room });

		const message = new Message({
			date: Date(),
			text: req.params.text,
			owner: req.user._id,
			room: room._id
		});

		const newMessage = await message.save();

		res.status(200).json({
			message: "message posted",
			object: newMessage
		});

	} catch (error) {
		errorResponse(res, err);
	}
});

router.delete("/message/:id", validateSession, async (req, res) => {
	try {
		const { id } = req.params;
		const deleteMessage = await Message.deleteOne({
			_id: id,
			owner: req.user.id
		});

		if(deleteMessage.deleteCount) {
			res.status(200).json({
				message: 'message deleted'
			});
		} else {
			throw new Error("could not delete message");
		}

	} catch (error) {
		errorResponse(res, error);
	}
});

module.exports = router;