import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@services/auth/auth.service';

@Component({
    selector: 'app-root',
    standalone: true, // Añadido
    imports: [ RouterOutlet, ToastModule ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass'
})

export class AppComponent {
    title = 'frontend';

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.authService.retrieveLoggedUser();
    }
    
}