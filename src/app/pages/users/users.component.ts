import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionConfig, ListData, ListConfig } from '@src/app/components/crud/old/crud.component';
import { Validators } from '@angular/forms';
import { Crud } from '@src/app/components/crud/crud';
import { CrudManagerComponent } from '@src/app/components/crud/crud-manager.component';
import { CrudFormComponent } from '@src/app/components/crud/crud-form.component';


@Component({
    selector: 'app-users',
    standalone: true,
    imports: [ CommonModule, CrudManagerComponent, CrudFormComponent ],
    templateUrl: './users.component.html'
})

export class UsersComponent extends Crud  {
    
    override ngOnInit() {
        this.fetchRelation('roles', 'role')
        super.ngOnInit()
    }

    override sectionConfig: SectionConfig = {
        model: 'users',
        icon: 'pi pi-users',
        nameSingular: 'user',
        namePlural: 'users',
        formSize: 'MEDIUM',
    }

    override listData: ListData[] = [
        { name: 'id', text: 'Id', columnClass: 'w-3', hideOnCreation: false, hideOnEdition: false, 
            unDeleteableIds: [ 1, 2 ], unEditableIds: [ 1, 2 ] },
        { name: 'user', text: 'Username' },
        { name: 'email', text: 'Email' },
        { name: 'roles', text: 'Role', columnClass: 'w-6', showAsBadge: true,
            relation: true, relationName: 'roles', relationFieldName: 'name' },
        { name: 'first_name', text: 'First Name'},
        { name: 'last_name', text: 'Last Name', columnClass: '', }
    ];

    override listConfig: ListConfig = {
        unDeleteableIds: [ 1, 2 ],
        unEditableIds: [ 1 ]
    }

    override formFields: any[] = [

        { name: 'id', label: 'Id', value: '', placeholder: 'Enter the id', type: 'text', class: 'col-span-12',
            hidden: true },

        { name: 'user', label: 'Username', value: '', placeholder: 'Enter the username', type: 'text', class: 'col-span-12',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },
       
        { name: 'first_name', label: 'First Name', value: '', placeholder: 'Enter the first name', type: 'text', class: 'col-span-6',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },
       
        { name: 'last_name', label: 'Last Name', value: '', placeholder: 'Enter the last name', type: 'text', class: 'col-span-6',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },
        
        { name: 'email', label: 'Email', value: '', placeholder: 'Enter the email', type: 'text', class: 'col-span-6',
                validators: [ Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(50)] },

        { name: 'password', label: 'Password', value: '', placeholder: 'Enter the password', type: 'text', class: 'col-span-6',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },

        { name: 'role', label: 'Role', value: '', placeholder: 'Select the role', type: 'select', class: 'col-span-12',
            isRelation: true,
            options: { 
                name: 'roles', valueName: 'name', data: []
            },
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },
    
    ]
}