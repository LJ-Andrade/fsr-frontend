import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [Menubar, CommonModule ],
})

export default class HeaderComponent implements OnInit {

    items: MenuItem[] | undefined;

    constructor(private router: Router) {}

    ngOnInit() {
        this.items = [
            { 
                label: 'Home',
                icon: 'pi pi-home',
                routerLink: '/dashboard'
            }, 
            { 
                label: 'Profile',
                icon: 'pi pi-user',
                routerLink: '/profile'
            }, 
            // {
            //     label: 'Router',
            //     icon: 'pi pi-palette',
            //     items: [
            //         {
            //             label: 'Installation',
            //             route: '/installation'
            //         },
            //         {
            //             label: 'Configuration',
            //             route: '/configuration'
            //         }
            //     ]
            // },
            // {
            //     label: 'Programmatic',
            //     icon: 'pi pi-link',
            //     command: () => {
            //         this.router.navigate(['/installation']);
            //     }
            // },
            // {
            //     label: 'External',
            //     icon: 'pi pi-home',
            //     items: [
            //         {
            //             label: 'Angular',
            //             url: 'https://angular.io/'
            //         },
            //         {
            //             label: 'Vite.js',
            //             url: 'https://vitejs.dev/'
            //         }
            //     ]
            // }
        ];
    }
}