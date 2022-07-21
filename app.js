const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
let cors = require('cors');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_SRV);

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(
	cors({
		origin: '*'
	})
);

app.get('/', (req, res) => {
	res.json({ hello: 'this is an api' });
});

app.use(authRoutes);
app.use(todoRoutes);

let port = process.env.PORT || 9000;

app.listen(port, () => {
	console.log(`Server running at ${port}`);
});
