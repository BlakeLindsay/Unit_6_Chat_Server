const router = require('express').Router;

const Room = require("../models/room.model");

function errorResponse(res, err){
    res.status(500).json({
        ERROR: err.message,
    });
};

//Add new room to Mongo database
// user? user id?
router.post("/user", async(req, res) =>{
    try{
            const newRoom = {
                title: req.Room.title,
                description: req.Room.description,
                messages: req.room.messages,
                owner: req.user._id

            }
    }
catch(err){
errorresponse(res, err);
}
});
