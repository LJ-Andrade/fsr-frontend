import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudComponent, SectionConfig, ListData, ListConfig } from '@src/app/components/crud/crud.component';
import { Validators } from '@angular/forms';

@Component({
	selector: 'app-roles',
	imports: [ CommonModule, CrudComponent ],
	templateUrl: './roles.component.html'
})

export class RolesComponent {
	sectionConfig: SectionConfig = {
		model: 'roles',
		icon: 'pi pi-crown',
		nameSingular: 'role',
		namePlural: 'roles',
        formSize: 'SMALL',
	}

	listData: ListData[] =
	[
		{ name: 'id', text: 'Id', columnClass: 'w-3', hideOnCreation: false, hideOnEdition: false,
			unDeleteableIds: [ 1, 2 ], unEditableIds: [ 1, 2 ] },
		{ name: 'name', text: 'Name' },
	];

	listConfig: ListConfig = {
        unDeleteableIds: [ 1, 2, 22 ],
        unEditableIds: [ 1, 2 ]
    }

	formFields: any[] = [

		{
			name: 'name', label: 'Role Name', value: '', placeholder: 'Enter the name of the role', type: 'text', class: 'col-span-12',
			validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
		},

	]
}
