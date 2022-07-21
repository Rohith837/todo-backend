const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('./helperFunctions');
const user = require('../models/user');

router.post('/todos', isLoggedIn, async (req, res) => {
	try {
		let existingUser = await user.findById(req.user._id);
		res.json({ todos: existingUser.todos });
	} catch (error) {
		res.status(500).json({
			error: 'something went wrong, try again later.'
		});
	}
});

router.post('/addTodo', isLoggedIn, async (req, res) => {
	try {
		let { todo } = req.body;
		let existingUser = await user.findById(req.user._id);
		existingUser.todos.addToSet(todo);
		existingUser.save();
		res.json({ status: 'added successfully', todos: existingUser.todos });
	} catch (error) {
		res.status(500).json({
			error: 'something went wrong, try again later.'
		});
	}
});

router.delete('/:deleteTodo', isLoggedIn, async (req, res) => {
	try {
		let existingUser = await user.findById(req.user._id);
		existingUser.todos.pull(req.params.deleteTodo);
		existingUser.save();
		res.json({ status: 'deleted todo', todos: existingUser.todos });
	} catch (error) {
		res.status(500).json({
			error: 'something went wrong, try again later.'
		});
	}
});

module.exports = router;
