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

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
	console.log("new user connected");
	socket.on('new message', (data) =>{
		console.log(data);
		socket.emit('message recieved', 'i am data from server..');
	}); //listem to event
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
		_id: mongoose.Types.ObjectId,
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