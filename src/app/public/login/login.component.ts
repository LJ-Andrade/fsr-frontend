import { Component, OnInit, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '@app/core/auth/auth.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule,
		ButtonModule,
		InputTextModule,
		PasswordModule,
		CardModule,
		DividerModule,
		ToastModule
	],
	providers: [MessageService],
	templateUrl: './login.component.html',
	styleUrl: './login.component.sass'
})
export class LoginComponent implements OnInit {
	
	loginForm: FormGroup;
	loading: boolean = false;

	constructor(
		private messageService: MessageService,
		private authService: AuthService
	) {
		this.loginForm = new FormGroup({
			user: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required, Validators.minLength(8)])
		});

		// Efecto para manejar los cambios en el estado del login
		effect(() => {
			const status = this.authService.loginState();
			
			switch (status) {
				case 'success':
					this.loading = false;
					this.messageService.add({
						severity: 'success',
						summary: 'Éxito',
						detail: 'Inicio de sesión exitoso'
					});
					break;
				case 'error':
					this.loading = false;
					break;
				case 'authenticating':
					this.loading = true;
					break;
				case 'pending':
					this.loading = false;
					break;
			}
		});
	}

	ngOnInit(): void {
		// Si ya está autenticado, redirigir al dashboard
		if (this.authService.isAuthenticated()) {
			this.authService.router.navigate(['/dashboard']);
		}
	}

	onSubmit() {
		if (this.loginForm.valid) {
			this.loading = true;
			// Llamar al servicio de autenticación
			this.authService.login(this.loginForm.value, '/dashboard');
		} else {
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: 'Por favor, complete todos los campos correctamente'
			});
			
			// Marcar todos los campos como tocados para mostrar los errores
			Object.keys(this.loginForm.controls).forEach(key => {
				const control = this.loginForm.get(key);
				control?.markAsTouched();
			});
		}
	}
}
