import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// import { EventService } from '@src/app/services/event.service';
import HeaderComponent from '@app/private/partials/header.component';
import { AuthService } from '@app/core/auth/auth.service';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';


// import { SharedDataService } from '@src/app/services/shared-data.component';

@Component({
    selector: 'app-main',
    standalone: true,
	// imports: [ CommonModule, RouterModule, HeaderComponent, SideMenuComponent, SectionHeaderComponent ],
    imports: [ CommonModule, RouterModule, Toast, ButtonModule, Ripple, HeaderComponent ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.sass'
})


export default class MainComponent implements OnInit {
	// eventService = inject(EventService);
	authService = inject(AuthService);
	router = inject(Router);
	// sharedDataService = inject(SharedDataService);


	ngOnInit(): void {
		this.authService.getUserData()
	}
}
