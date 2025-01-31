
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [ ],
	templateUrl: './login.component.html',
	styleUrl: './login.component.sass'
})

export class LoginComponent implements OnInit {
	
	loginForm: FormGroup = new FormGroup({});

	ngOnInit(): void {

		this.loginForm = new FormGroup({
			email: new FormControl(null, [Validators.required, Validators.email]),
			password: new FormControl(null, [Validators.required, Validators.minLength(8)] )
		});

	}

	OnFormSubmitted() {
		// this.authService.login(this.loginForm.value);
	}

}

