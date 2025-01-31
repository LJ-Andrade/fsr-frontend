import { Component, inject } from '@angular/core';
import { AuthService } from '@src/app/core/auth/auth.service';

// import { PanelComponent } from '@src/app/elements/panel/panel.component';

@Component({
	selector: 'app-profile',
	standalone: true,
	// imports: [PanelComponent],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.sass'
})

export class ProfileComponent {
	authService = inject(AuthService);
}
