import { Routes } from '@angular/router';
import MainComponent from '@private/main.component';
import { LoginComponent } from './public/login/login.component';
import { RequestResetPasswordComponent } from './public/request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './public/reset-password/reset-password.component';
import { authGuard } from '@app/core/auth/auth.guard';
import { ProfileComponent } from './private/profile/profile.component';
import DashboardComponent from './private/dashboard/dashboard.component';
import { ApiTestComponent } from './public/api-test/api-test.component';


export const routes: Routes = [

	// { path: '', component: MainComponent, pathMatch: 'full'},
	// { path: 'login', component: LoginComponent, pathMatch: 'full'},
	// { path: 'request-password-reset', component: RequestResetPasswordComponent, pathMatch: 'full'},
	// { path: 'reset-password', component: ResetPasswordComponent, pathMatch: 'full'},

	{
		path: '',
		component: MainComponent,
		// canActivate: [ authGuard ], data: { showOnMenu: true },
		children: [
			{ path: '', redirectTo: '', pathMatch: 'full' },
			{ path: 'dashboard', component: DashboardComponent,
				data: { },
			},
			{ path: 'profile', component: ProfileComponent,
				data: { },
			},
			{
				path: 'inicio', title: 'Inicio', component: DashboardComponent,
				data: { }
			},
			{ 
				path: 'api-test', 
				component: ApiTestComponent,
				data: { title: 'Rick & Morty API Test' }
			}
		]
	}   
];
