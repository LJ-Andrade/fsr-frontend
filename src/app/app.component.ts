import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';



@Component({
	selector: 'app-root',
	imports: [ RouterOutlet ],
	templateUrl: './app.component.html',
	styleUrl: './app.component.sass',
	providers: [ MessageService]
})


export class AppComponent {
	title = 'frontend';

	constructor(private messageService: MessageService) {}


	show() {
		this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
	}

}
