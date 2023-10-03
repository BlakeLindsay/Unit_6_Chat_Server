const router = require("express").Router();
const Room = require("../models/room.model");
const Message = require("../models/message.model");
const validateSession = require('../middleware/validateSession');


function errorResponse(res, error) {
	res.status(500).json({
		ERROR: error.message
	});
};

/**
 * room is the id of the room, text is a string for the text of the message
 */
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

/**
 * :room is the id of the room
 */
router.get("/message/:room", async (req, res) => {
	try {
		const messages = await Message.find({ room: req.params.id });

		messages.length > 0 ?
		res.status(200).json({messages})
		:
		res.status(404).json({message: "no messages found"});

	} catch (error) {
		errorResponse(res, error);
	}
});

/**
 * id is the id of the message to be deleted
 */
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