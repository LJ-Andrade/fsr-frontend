import { Routes } from '@angular/router';
import MainComponent from '@src/app/pages/main.component';
import { LoginComponent } from './pages/login/login.component';
import { RequestResetPasswordComponent } from './pages/request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { authGuard } from '@src/app/services/auth/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import DashboardComponent from './pages/dashboard/dashboard.component';
import { ApiTestComponent } from './pages/api-test/api-test.component';

/**
 * App routes
 */
export const routes: Routes = [
	{ path: 'login', component: LoginComponent, pathMatch: 'full'},
	{ path: 'request-password-reset', component: RequestResetPasswordComponent, pathMatch: 'full'},
	{ path: 'reset-password', component: ResetPasswordComponent, pathMatch: 'full'},
	{
		path: '',
		component: MainComponent,
		canActivate: [ authGuard ],
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
