import { Component, computed, inject, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionConfig, ListData, ListConfig } from '@src/app/components/crud/old/crud.component';
import { Validators } from '@angular/forms';
import { Crud } from '@src/app/components/crud/crud';
import { ListComponent } from '@src/app/components/crud/old/list.component';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [ CommonModule, ListComponent, Toolbar, ButtonModule ],
    templateUrl: './users.component.html'
})

export class Users2Component extends Crud {

    dataRelations = signal<any>({
        roles: []
    })

    results = signal<any>({})


    override ngOnInit() {
        this.fetchRelations()
    }

    fetchRelations() {
        this.dataService.getModelData('roles').subscribe(
            data => this.roles.set(data)
        );

        this.dataRelations.set({
            roles: this.roles(),
        })

        console.log(this.dataRelations)
    }

    sectionConfig: SectionConfig = {
		model: 'users',
        icon: 'pi pi-users',
		nameSingular: 'user',
		namePlural: 'users',
        formSize: 'MEDIUM',
	}

    listData: ListData[] =
	[
		{ name: 'id', text: 'Id', columnClass: 'w-3', hideOnCreation: false, hideOnEdition: false, 
            unDeleteableIds: [ 1, 2 ], unEditableIds: [ 1, 2 ] },
		{ name: 'user', text: 'Username' },
        { name: 'email', text: 'Email' },
        // { name: 'role', text: 'Role', columnClass: 'w-6',
        //     relation: true, relationName: 'roles', 'relationFieldName': 'name'
        // },
        { name: 'first_name', text: 'First Name'},
        { name: 'last_name', text: 'Last Name', columnClass: '', }
	];

    listConfig: ListConfig = {
        unDeleteableIds: [ 1, 2 ],
        unEditableIds: [ 1, 2 ]
    }

    formFields: any[] = [

		{ name: 'name', label: 'Username', value: '', placeholder: 'Enter the username', type: 'text', class: 'col-span-6',
			validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },

        { name: 'first_name', label: 'First Name', value: '', placeholder: 'Ingrese su nombre', type: 'text', class: 'col-span-6',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },

        { name: 'roles', label: 'Roles', value: '', placeholder: 'Ingrese su nombre', type: 'select', class: 'col-span-12',
            validators: [ Validators.required ], 
            relation: true, 
            relationName: 'roles', 
            relationFieldName: 'name',
            relationData: this.roles()
        },

        { name: 'email', label: 'Email', value: '', placeholder: 'Ingrese su nombre', type: 'text', class: 'col-span-12',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.email ] },

	]

}