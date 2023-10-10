const router = require('express').Router();
const Room = require("../models/room.model");

//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const validateSession = require('../middleware/validateSession');

function errorResponse(res, err){
    res.status(500).json({
        ERROR: err.message,
    });
};

//Add new room to Mongo database
// user? user id?
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
    }
catch(err){
errorResponse(res, err);
}
});


router.get("/list", async (req, res) => {
  try {
    // console.log('user:', req.user.id); // hopefully this contains my user object
    const getAllRooms = await Room.find(); // this should give me everything in the collection
    // console.log([] == false);
    // Make a ternary to handle whether or not we get pizzas
    getAllRooms.length > 0 ?
      res.status(200).json({ getAllRooms })
      :
      res.status(404).json({ message: "No Room Found" });
  } catch (err) {
    errorResponse(res, err);
  }
});

//Get One

router.get('/:id', async (req, res) => {  try {
    const singleRoom = await Room.findOne({ _id: req.params.id });
    //const user = await User.findById(singleRoom.owner);

    res.status(200).json({ singleRoom });
  } catch (err) {
    errorResponse(res, err);
  }
});

// TODO GET All


// TODO GET All Specific

router.patch('/:id', validateSession, async (req, res) => {
  try {
    // we need the owner and the id
    let _id = req.params.id;
    let ownerId = req.user.id;

    console.log(_id);
    console.log(ownerId);

    let updatedInfo = req.body;

    // now that I can find the id and owner values, I want to find and update my pizza
    const updated = await Room.findOneAndUpdate({ _id, ownerId }, updatedInfo, { new: true });

    if (!updated)
      throw new Error("Invalid Room/User Combination");

    res.status(200).json({
      message: `${updated._id} Updated!`,
      updated
    });
    // res.send('Patch Endpoint'); //? this is temporary so we can console log our information while not having to restart the server due to a lack of a response
  } catch (err) {
    errorResponse(res, err);
  }
})

// TODO DELETE One
router.delete('/:id', validateSession, async function(req, res) {
  try {
    // we need to know what we want to delete
    // let id = req.params.id;
    let { id } = req.params;
    let ownerId = req.user.id;
    // locate and delete the item from our database
    const deletedRoom = await Room.deleteOne({ _id: id, ownerId });
    // respond to our client
    if (!deletedRoom.deletedCount) {
      throw new Error('could not find room :(')
    } 
    // else {

    // }
    // if (1 + 1 === 2) {
    //   console.log('Correct Math!')
    // }
    res.status(200).json({
      message: 'Room Deleted!',
      deletedRoom
    });
  } catch(err) {
    errorResponse(res, err);
  }
})

module.exports = router;