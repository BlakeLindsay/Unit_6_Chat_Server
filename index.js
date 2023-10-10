const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');

const { PORT, MONGO } = process.env;

mongoose.connect(`${MONGO}/Chat_Server`);

const db = mongoose.connection;

db.once('open', () => console.log(`Connected to: ${MONGO}`));

app.use(express.json());

const users = require('./controllers/user.controller');
const rooms = require('./controllers/room.controller');
const messages = require('./controllers/message.controller');

app.use('/user', users);
app.use('/room', rooms);
app.use('/message', messages);

app.listen(PORT);