const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/epicchat', {useNewUrlParser: true});

// mongoose.connect('mongodb://localhost:27017/epicchat');
mongoose.connect('mongodb://localhost:27017/epicchat').then(() => {
	console.log("Connected to Database");
}).catch((err) => {
	console.log("Not Connected to Database ERROR! ", err);
});
mongoose.Promise = global.Promise;

app.use(bodyParser.json());// paser all the requests that are going in and  out with json parser
app.use(express.static(path.join(__dirname,'../dist')));
//events listeners
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
	let user = '';

	socket.on('new message', (data) => {
		const newMessage = new Message({
			_id: mongoose.Types.ObjectId(),
			message: data,
			user: user
		})
		newMessage.save().then(rec => {
			if(rec) {
				io.emit('message recieved', rec)
			} else {
			}
		})
	}); //listen to event

	socket.on('new user', (data) =>{
		user = data;
		console.log("new user connected");
		socket.broadcast.emit('user connected', data); //sends message to all users except the newly connected
		Message.find().then(rec => {
			if(rec){
				socket.emit('all messages', rec);
			}
			else{

			}
		});
	});
	socket.on('disconnect', () => {
		socket.broadcast.emit('user disconnected', user);
	});
});

const Message = require('./models/message');

app.get('/api/chat',(req, res) => {
	Message.find().then(rec => {
		if(rec){
			res.send(rec);
		}
		else{
			res.send([]);
		}
	});
});

app.post('/api/chat',(req, res) => {
	const newMessage = new Message({
		_id: mongoose.Types.ObjectId(),
		message: req.body.message,
		user: 'user'
	});
	newMessage.save().then(rec => {
		if(rec){
			res.send(rec);
		}
		else{
			res.send([]);
		}
	});
});

app.get('*',(req, res) => {
	res.sendFile(path.join(__dirname, '../dist/index.html'))
});

server.listen(3000, () => console.log('Listening on port 3000...'));