import { Component, OnInit, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { AuthService } from '@src/app/services/auth/auth.service';
import { FieldErrorComponent } from '@src/app/components/field-error/field-error.component';
import { SkinService } from '@src/app/services/skin.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		CommonModule, ReactiveFormsModule, RouterModule, FieldErrorComponent,
		ButtonModule, InputTextModule, PasswordModule, CardModule, DividerModule,

	],
	providers: [MessageService],
	templateUrl: './login.component.html',
	styleUrl: './login.component.sass'
})

export class LoginComponent {
	authService: AuthService = inject(AuthService);
	messageService: MessageService = inject(MessageService);
	skinService: SkinService = inject(SkinService);

	formFields = [
		{
			name: 'user',
			label: 'Username',
			type: 'text',
			validators: [Validators.required],
			placeholder: 'Enter username'
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			validators: [Validators.required, Validators.minLength(8)],
			placeholder: 'Enter password'
		}
	];

	loginForm!: FormGroup;
	loading: boolean = false;

	constructor() {
		this.buildForm();

		effect(() => {
			this.handleLoginState(this.authService.loginState() as 'authenticating' | 'success' | 'error' | 'idle');
		});
	}

	ngOnInit(): void {
		const urlParams = new URLSearchParams(window.location.search);
		const domain = urlParams.get('domain');

		if (domain) {
			this.skinService.loadSkin(domain).subscribe({
				next: (res) => console.log('Skin loaded:', res),
				error: (err) => console.error('Skin error:', err)
			});
			console.log('Domain:', domain);
		} else {
			console.warn('No domain provided in URL');
		}

		if (this.authService.isAuthenticated()) {
			this.authService.router.navigate(['/dashboard']);
		}
	}


	private buildForm() {
		this.loginForm = new FormGroup({});
		this.formFields.forEach(field => {
			this.loginForm.addControl(
				field.name,
				new FormControl('', field.validators)
			);
		});
	}

	private handleLoginState(status: 'authenticating' | 'success' | 'error' | 'idle') {
		this.loading = status === 'authenticating';

		if (status === 'success') {
			this.messageService.add({
				severity: 'success',
				summary: 'Success',
				detail: 'Login successful'
			});
		}
	}

	onSubmit() {
		if (this.loginForm.valid) {
			this.authService.authenticate(this.loginForm.value, '/dashboard');
		} else {
			this.handleInvalidForm();
		}
	}

	private handleInvalidForm() {
		this.messageService.add({
			severity: 'error',
			summary: 'Error',
			detail: 'Please fill all required fields correctly'
		});
		Object.keys(this.loginForm.controls).forEach(key => {
			this.loginForm.get(key)?.markAsTouched();
		});
	}
}
