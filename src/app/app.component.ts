import { Component } from '@angular/core';
import { MessageService } from './message.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Epic Chat';
  message = '';
  // chats = [
  // 'Lorem ipsum dolor sit amet', 
  // 'consectetur adipiscing elit',
  // 'sed do eiusmod tempor incididunt',
  // 'ut labore et dolore magna aliqua',
  // 'Ut enim ad minim veniam, quis',
  // 'nostrud exercitation ullamco' 
  // ];
  chats = [];
  constructor(private messageService: MessageService){
  	this.messageService.getChats().subscribe((data) => {
  		this.chats = data; 
  		window.setTimeout(() => {
  			const elem = document.getElementById('scrolldiv');
  			elem.scrollTop = elem.scrollHeight;
  		}.500);
  	});
  }
  addChat(){
  if (this.message.length === 0) {
  	return;
  }
  this.chats.push(this.message);
  this.message = '';
  window.setInterval(() => {
  	const elem = document.getElementById('scrolldiv');
  	elem.scrollTop = elem.scrollHeight;
  	},500);
  }
}
