import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [Menubar, CommonModule],
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
            { 
                label: 'Rick & Morty API',
                icon: 'pi pi-flask',
                routerLink: '/api-test'
            }
        ];
    }
}