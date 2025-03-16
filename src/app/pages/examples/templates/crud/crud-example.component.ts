import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudComponent, SectionConfig, ListData } from '@src/app/components/crud/old/crud.component';
import { Validators } from '@angular/forms';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [ CommonModule, CrudComponent ],
    templateUrl: './crud-example.component.html'
})

export class UsersComponent {

    sectionConfig: SectionConfig = {
		model: 'examples',
		nameSingular: 'example',
		namePlural: 'examples'
	}

    listData: ListData[] =
	[
		{ name: 'id', text: 'Id', columnClass: 'w-3', hideOnCreation: false, hideOnEdition: false },
		{ name: 'name', text: 'Name' },
	];

    formFields: any[] = [

		{ name: 'name', label: 'Name', value: '', placeholder: 'Enter the name', type: 'text', class: '',
			validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },

	]

}