const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: {
		type: String,
		required: true
	},
	todos: [ { type: String } ]
});

module.exports = mongoose.model('user', userSchema);
