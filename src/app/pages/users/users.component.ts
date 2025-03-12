import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudComponent, SectionConfig, TableData } from '@src/app/components/crud/crud.component';
// import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [ CommonModule, CrudComponent ],
    templateUrl: './users.component.html'
})

export class UsersComponent {

    sectionConfig: SectionConfig = {
		model: 'users',
		visualId: 'name',
		nameSingular: 'usuario',
		namePlural: 'usuarios'
	}

    tableData: TableData[] =
	[
		{ name: 'id', text: 'Id', columnClass: 'w-3', hideOnCreation: false, hideOnEdition: false },
		{ name: 'user', text: 'Username' },
        { name: 'email', text: 'Email' },
        { name: 'first_name', text: 'First Name'},
        { name: 'last_name', text: 'Last Name', columnClass: '', }
	];



}