import { Component, OnInit, ViewChild, inject, computed } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RoutesRecognized } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '@src/app/services/layout.service';
import { PopoverModule } from 'primeng/popover';
import { Popover } from 'primeng/popover';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [ 
        CommonModule, RouterModule, Menubar, BadgeModule, 
        AvatarModule, InputTextModule, Ripple, ButtonModule,
        PopoverModule, ConfirmPopupModule, ToastModule, DialogModule
    ]
})

export class HeaderComponent implements OnInit {
    items: MenuItem[] = [];
    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    router = inject(Router);

    @ViewChild('op') op!: Popover;
    
    isLoggedIn = computed(() => this.authService.isAuthenticated());
    isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);
    userName = computed(() => this.authService.getUserFullName());
    
    displayConfirmation: boolean = false;

    ngOnInit() {
        this.generateMenu();
        this.router.events.subscribe(event => {
            if (event instanceof RoutesRecognized) {
                this.generateMenu();
            }
        });
    }

    generateMenu() {
        const routes = this.router.config.find(route => route.path === '')?.children || [];
        this.items = this.buildMenu(routes);
    }

    buildMenu(routes: any[]): MenuItem[] {
        return routes
            .filter(route => route.data?.title || route.data?.icon)
            .filter(route => !route.data.skipFromMenu)
            .map(route => ({
                title: route.data.title,
                icon: route.data.icon || '',
                routerLink: ['/', route.path],  // Changed to array format for proper routing
                command: (event: any) => {
                    if (!route.children) {
                        this.router.navigate(['/', route.path]);
                    }
                },
                items: route.children ? this.buildMenu(route.children) : undefined
            }));
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    toggle(event: any) {
        this.op.toggle(event);
    }

    goToProfile() {
        this.router.navigate(['/profile'], { replaceUrl: true });
    }

    async requestLogout() {
        this.closeLogoutConfirmation()
        await this.authService.logout();
    }

    openLogoutConfirmation() {
        this.displayConfirmation = true;
    }

    closeLogoutConfirmation() {
        this.displayConfirmation = false;
    }
}
