import { Component, OnInit, ViewChild, computed, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '@src/app/services/layout.service';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [ 
        CommonModule, RouterModule, Menubar, BadgeModule, 
        AvatarModule, InputTextModule, Ripple, ButtonModule,
        PopoverModule ]
})

export class HeaderComponent implements OnInit {
    items: MenuItem[] | undefined;
    layoutService = inject(LayoutService);
    authService = inject(AuthService)

    @ViewChild('op') op!: Popover;
    
    isLoggedIn = computed(() => this.authService.isAuthenticated());
    isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    ngOnInit() {
        this.items = [
            {
                label: 'Home',
                icon: 'pi pi-home',
            },
            {
                label: 'Projects',
                icon: 'pi pi-search',
                badge: '3',
                items: [
                    {
                        label: 'Core',
                        icon: 'pi pi-bolt',
                        shortcut: '⌘+S',
                    },
                    {
                        label: 'Blocks',
                        icon: 'pi pi-server',
                        shortcut: '⌘+B',
                    },
                    {
                        separator: true,
                    },
                    {
                        label: 'UI Kit',
                        icon: 'pi pi-pencil',
                        shortcut: '⌘+U',
                    },
                ],
            },
        ];
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    toggle(event: any) {
        console.log("HOLA")
        this.op.toggle(event);
    }

    userName() {
        return this.authService.getCurrentUser()?.first_name || '';
    }

    async requestLogout() {
        await this.authService.logout();
    }
}