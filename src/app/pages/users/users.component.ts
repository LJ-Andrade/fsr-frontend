import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudComponent, SectionConfig, ListData } from '@src/app/components/crud/crud.component';
import { Validators } from '@angular/forms';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [ CommonModule, CrudComponent ],
    templateUrl: './users.component.html'
})

export class UsersComponent {

    sectionConfig: SectionConfig = {
		model: 'users',
		nameSingular: 'user',
		namePlural: 'users'
	}

    listData: ListData[] =
	[
		{ name: 'id', text: 'Id', columnClass: 'w-3', hideOnCreation: false, hideOnEdition: false },
		{ name: 'user', text: 'Username' },
        { name: 'email', text: 'Email' },
        { name: 'first_name', text: 'First Name'},
        { name: 'last_name', text: 'Last Name', columnClass: '', }
	];

    formFields: any[] = [

		{ name: 'name', label: 'Username', value: '', placeholder: 'Enter the username', type: 'text', class: '',
			validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },

        { name: 'first_name', label: 'First Name', value: '', placeholder: 'Ingrese su nombre', type: 'text', class: '',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },

        { name: 'email', label: 'Email', value: '', placeholder: 'Ingrese su nombre', type: 'text', class: '',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.email ] },

	]

}