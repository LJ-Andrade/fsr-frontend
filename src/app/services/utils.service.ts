import { Injectable, inject } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class UtilsService {

	public log(message: any) {
		console.log(message);
	}

	loadSetting<T>(key: string, defaultValue: T): T {
		const storedValue = localStorage.getItem(key);
		return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
	  }
	
	saveSetting<T>(key: string, value: T): void {
		localStorage.setItem(key, JSON.stringify(value));
	}

}