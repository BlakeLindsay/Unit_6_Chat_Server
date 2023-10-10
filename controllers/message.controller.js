const router = require("express").Router();
const Room = require("../models/room.model");
const Message = require("../models/message.model");
const validateSession = require('../middleware/validateSession');
const { validate } = require("../models/user.model");

/**
 * gives a standard error
 * 
 * @param {*} res 
 * @param {*} error 
 */
function errorResponse(res, error) {
	res.status(500).json({
		ERROR: error.message
	});
};

/**
 * room is the id of the room, text is a string for the text of the message
 */
router.post("/:room", validateSession, async (req, res) => {
	try {
		const message = new Message({
			date: Date(),
			text: req.body.text,
			owner: req.user._id,
			room: req.params.room
		});

		const newMessage = await message.save();

		res.status(200).json({
			message: "message posted",
			newMessage
		});

	} catch (error) {
		errorResponse(res, error);
	}
});

/**
 * :room is the id of the room
 */
router.get("/:room", async (req, res) => {
	try {
		const messages = await Message.find({ room: req.params.room });

		messages.length > 0 ?
		res.status(200).json({messages})
		:
		res.status(404).json({message: "no messages found"});

	} catch (error) {
		errorResponse(res, error);
	}
});

router.patch("/", validateSession, async (req, res) => {
	try {
		let info = {
			date: Date(),
			text: req.body.text
		};
		let updatedMessage = await Message.findOneAndUpdate({_id: req.body.id, owner: req.user.id}, info, {new: true});
		if (!updatedMessage) {
			throw new Error("Invalid Message / User combination");
		}
		res.status(200).json({
			message: `${req.body.id} updated`,
			text: req.body.text
		});
	} catch (error) {
		errorResponse(res, error);
	}
});

/**
 * id is the id of the message to be deleted
 */
router.delete("/:id", validateSession, async (req, res) => {
	try {
		const { id } = req.params;
		console.log(req.user);
		const deleteMessage = await Message.deleteOne({
			_id: id,
			owner: req.user._id
		});

		if(deleteMessage.deletedCount) {
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