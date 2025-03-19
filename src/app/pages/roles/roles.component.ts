import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionConfig, ListData, ListConfig } from '@src/app/components/crud/old/crud.component';
import { Validators } from '@angular/forms';
import { CrudBase } from '@src/app/components/crud/crud-base';
import { CrudManagerComponent } from '@src/app/components/crud/crud-manager.component';
import { CrudFormComponent } from '@src/app/components/crud/crud-form.component';


@Component({
    selector: 'app-roles',
    standalone: true,
    imports: [ CommonModule, CrudManagerComponent, CrudFormComponent ],
    templateUrl: './roles.component.html'
})

export class RolesComponent extends CrudBase  {
    
    override ngOnInit() {
        super.ngOnInit()
    }

    override sectionConfig: SectionConfig = {
        model: 'roles',
        icon: 'pi pi-crown',
        nameSingular: 'role',
        namePlural: 'roles',
        formSize: 'SMALL',
    }

    override listData: ListData[] = [
        { name: 'id', text: 'Id', columnClass: 'w-3', hideOnCreation: false, hideOnEdition: false, 
            unDeleteableIds: [ 1, 2 ], unEditableIds: [ 1, 2 ] },
        { name: 'name', text: 'Nombre' }
    ];

    override listConfig: ListConfig = {
        unDeleteableIds: [ 1, 2 ],
        unEditableIds: [ 1, 2 ]
    }

    override formFields: any[] = [
        { name: 'name', label: 'Name', value: '', placeholder: 'Enter the role name', type: 'text', class: 'col-span-12',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },
    ]
}