const JWT = require('jsonwebtoken');
require('dotenv').config();
const secret_key = process.env.JWT_SECRET_KEY;
const expiresInSec = 3600;

function isLoggedIn(req, res, next) {
	const token = req.body.token;
	if (!token) {
		res.status(401).json({
			error: 'Please login to access'
		});
		return;
	}
	JWT.verify(token, secret_key, (err, user) => {
		if (err) {
			res.status(500).json({ error: 'something went wrong, try again later.' });
		} else {
			req.user = user;
			next();
		}
	});
}

function generateAccessToken(user, expiresIn = expiresInSec) {
	const accessToken = JWT.sign(user, secret_key, { expiresIn: `${expiresIn}s` });
	return accessToken;
}

module.exports = {
	isLoggedIn,
	generateAccessToken,
	expiresInSec
};
