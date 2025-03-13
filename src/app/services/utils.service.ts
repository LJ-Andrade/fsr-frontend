import { Injectable, inject } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class UtilsService {
	public log(message: any) {
		console.log(message);
	}

}