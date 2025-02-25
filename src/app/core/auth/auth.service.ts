import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@src/environments/environment';
import { DataService } from '../services/data.service';
import { NotificationService } from '../services/notification.service';
import { Observable } from 'rxjs';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';
export type AuthUser = User | null | undefined;

interface LoginState {
	status: LoginStatus;
}

interface AuthState {
  user: AuthUser;
}

interface User {
	id: number;
	email: string;
	name: string;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	notificationService = inject(NotificationService);
	http = inject(HttpClient);
	dataService = inject(DataService);
	router = inject(Router);

	private loginStatus = signal<LoginState>({
		status: 'pending',
	});

	private user = signal<AuthState>({
		user: null,
	});

	loginState = computed(() => this.loginStatus().status);
	currentUser = computed(() => this.user().user);

	isAuthenticated() {
		const authToken = localStorage.getItem(environment.tokenKeyName);
		return !!authToken;
	}

	login(loginData: any, redirectTo: string = '/inicio') {
		this.loginStatus.set({ status: 'authenticating' });

		this.http.post(environment.apiUrl + 'auth/login', loginData)
		.subscribe({
			next: (res: any) => {
				localStorage.setItem(environment.tokenKeyName, res.token);
				this.loginStatus.set({ status: 'success' });
				this.notificationService.success('Bienvenid@', 'Has ingresado correctamente');
				this.router.navigateByUrl(redirectTo);
				setTimeout(() => {
					this.loginStatus.set({ status: 'pending' });
				}, 1000);
			},
			error: (error: any) => {
				if(error.status === 0) {
					this.notificationService.error('Error', 'No hay conexión con el servidor. Inténtalo más tarde.');
				} else {
					this.notifyErrors(error.error.errors);
				}
				this.loginStatus.set({ status: 'error' });
				setTimeout(() => {
					this.loginStatus.set({ status: 'pending' });
				}, 1000);
			}
		});
	}

	register(registerData: any, redirectTo: string = '/inicio') {
		this.loginStatus.set({ status: 'authenticating' });

		this.http.post(environment.apiUrl + 'auth/register', registerData)
		.subscribe({
			next: (res: any) => {
				localStorage.setItem(environment.tokenKeyName, res.token);
				this.loginStatus.set({ status: 'success' });
				this.notificationService.success('Bienvenid@', 'Has ingresado correctamente');
				this.router.navigateByUrl(redirectTo);
				setTimeout(() => {
					this.loginStatus.set({ status: 'pending' });
				}, 1000);
			},
			error: (error: any) => {
				if(error.status === 0) {
					this.notificationService.error('Error', 'No hay conexión con el servidor. Inténtalo más tarde.');
				} else {
					this.notifyErrors(error.error.errors);
				}
				this.loginStatus.set({ status: 'error' });
				setTimeout(() => {
					this.loginStatus.set({ status: 'pending' });
				}, 1000);
			}
		});
	}

	getUserData() {
		this.dataService.httpFetch(environment.apiUrl + 'auth/user').subscribe((res: any) => {
			this.user.set({ user: res.data });
		});
	}

	logout() {
		this.notificationService.info('Cerrando sesión...', '');
		this.dataService.httpPost(environment.apiUrl + 'auth/logout', {}).subscribe({
			next: (res: any) => {
				if (res.status) {
					localStorage.removeItem(environment.tokenKeyName);
					location.reload();
				}
			},
			error: () => {
				// Si hay error en el logout, de todas formas limpiamos el token y recargamos
				localStorage.removeItem(environment.tokenKeyName);
				location.reload();
			}
		});
	}

	notifyErrors(errors: any) {
		let message = '';
		for (const errorKey in errors) {
			message += '- ' + errors[errorKey] + '</br>';
		}
		this.notificationService.error('Error', message);
	}
}
