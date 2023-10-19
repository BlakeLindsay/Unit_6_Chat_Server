const router = require('express').Router();
const Room = require("../models/room.model");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateSession = require('../middleware/validateSession');

function errorResponse(res, err){
    res.status(500).json({
        ERROR: err.message,
    });
};

router.post("/new", validateSession, async(req, res) =>{
	try{
		const newRoom = {
				title: req.body.title,
				description: req.body.description,
				messages: [],
				ownerId: req.user._id
		}

		const room = new Room(newRoom);
		const postRoom = await room.save();

		res.status(200).json({
			message: "New Room Created!",
			order: postRoom,
		});
	} catch(err){
		errorResponse(res, err);
	}
});


router.get("/list", async (req, res) => {
  try {
    const getAllRooms = await Room.find();
		
    getAllRooms.length > 0 ?
      res.status(200).json({ getAllRooms })
      :
      res.status(404).json({ message: "No Room Found" });
  } catch (err) {
    errorResponse(res, err);
  }
});

router.get('/:id', async (req, res) => {
	try {
    const singleRoom = await Room.findOne({ _id: req.params.id });

    res.status(200).json({ singleRoom });
  } catch (err) {
    errorResponse(res, err);
  }
});


router.patch('/:id', validateSession, async (req, res) => {
  try {
    let _id = req.params.id;
    let ownerId = req.user.id;

    console.log(_id);
    console.log(ownerId);

    let updatedInfo = req.body;

    const updated = await Room.findOneAndUpdate({ _id, ownerId }, updatedInfo, { new: true });

    if (!updated)
      throw new Error("Invalid Room/User Combination");

    res.status(200).json({
      message: `${updated._id} Updated!`,
      updated
    });
  } catch (err) {
    errorResponse(res, err);
  }
})

router.delete('/:id', validateSession, async function(req, res) {
  try {
    let { id } = req.params;
    let ownerId = req.user.id;

    const deletedRoom = await Room.deleteOne({ _id: id, ownerId });

    if (!deletedRoom.deletedCount) {
      throw new Error('could not find room :(')
    }

    res.status(200).json({
      message: 'Room Deleted!',
      deletedRoom
    });
  } catch(err) {
    errorResponse(res, err);
  }
})

module.exports = router;