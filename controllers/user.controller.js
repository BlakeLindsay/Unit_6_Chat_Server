const router = require('express').Router();

const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
	try {
		const user = new User({
			username: req.body.username,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10)
		});

		const newUser = await user.save();

		const token = jwt.sign({ id: newUser._id }, process.env.JWT, { expiresIn: "1 day" } );

		res.status(200).json({
			user: newUser,
			message: 'Success! User Created!',
			token
		});
	} catch (error) {
		res.status(500).json({
			ERROR: err.message
		});
	}
});

router.post('/login', async function(req, res) {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email: email });

		if (!user) {
			throw new Error('Email or Password does not match');
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '1 day'});

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) throw new Error('Email or Password does not match');

		res.status(200).json({
			user,
			message: 'Successful Login!',
			token
		});

	} catch (error) {
		res.status(500).json({
			ERROR: error.message
		});
	}
});

module.exports = router;