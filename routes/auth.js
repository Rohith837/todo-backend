const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { isLoggedIn, generateAccessToken, expiresInSec } = require('./helperFunctions');
const user = require('../models/user');
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

router.post('/register', async (req, res) => {
	try {
		let { email, password } = req.body;

		let validEmail = emailRegexp.test(email);
		if (!validEmail) return res.status(401).json({ error: 'Your Email must be a valid Email address' });

		if (password.length <= 7) return res.status(403).json({ error: 'The password must be longer than 7 letters.' });

		let registeredUser = await user.findOne({ email: email.toLowerCase() });
		if (registeredUser) return res.status(409).json({ error: 'email already exists' });

		password = await bcrypt.hash(password, 10);

		let newUser = await user.create({ email: email.toLowerCase(), password });

		const userObj = { _id: newUser._id };
		const token = generateAccessToken(userObj);

		res.json({ token, expiresInSec, email: newUser.email, id: newUser._id });
	} catch (error) {
		res.status(500).json({
			error: 'something went wrong, try again later.'
		});
	}
});

router.post('/login', async (req, res) => {
	try {
		let { email, password } = req.body;

		let foundUser = await user.findOne({ email });

		if (!foundUser) return res.status(404).json({ error: "Email doesn't exist." });

		let isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
		if (!isPasswordCorrect) return res.status(403).json({ error: 'password is incorrect' });

		const userObj = { _id: foundUser._id };
		const token = generateAccessToken(userObj);

		res.json({ token, expiresInSec, email: foundUser.email, id: foundUser._id });
	} catch (error) {
		res.status(500).json({
			error: 'something went wrong, try again later.'
		});
	}
});

// for updating the details of user

router.put('/user', isLoggedIn, async (req, res) => {
	try {
		let { oldPassword, newPassword } = req.body;

		let foundUser = await user.findById(req.user._id);
		let isOldPasswordTrue = await bcrypt.compare(oldPassword, foundUser.password);

		if (!isOldPasswordTrue) return res.status(403).json({ error: 'old password does not match' });
		if (!newPassword) return res.status(403).json({ error: 'new password cannot be empty' });

		if (newPassword == oldPassword)
			return res.status(403).json({ error: 'new password cannot be same as old password' });
		if (newPassword.length <= 7)
			return res.status(403).json({ error: 'The password must be longer than 7 letters.' });

		newPassword = await bcrypt.hash(newPassword, 10);
		foundUser.password = newPassword;

		await foundUser.save();
		res.json({ status: 'password updated' });
	} catch (error) {
		res.status(500).json({
			error: 'something went wrong, try again later.'
		});
	}
});

module.exports = router;
