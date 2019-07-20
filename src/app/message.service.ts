import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class MessageService {
	_chats = [];
	_chatssub;
	socket; 
	constructor(){
		this._chatssub = new Subject<any[]>();
		this.socket = io.connect();
		this.socket.on('connect', () => {
			console.log('new user connected.....');
		});
		this.socket.emit('new message', 'hey');
		this.socket.on('message recieved', (data)=>{
			console.log(data);
		});
		this.socket.on('all messages', (data) => {
			this._chats = [...data];
			this._chatssub.next([...this._chats]);
		});
	}
	addchat(message){
		this.socket.emit('new message', message);
	}
	getChats(){
		return this._chatssub.asObservable();
	}
}