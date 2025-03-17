import { Component, OnInit, inject, signal } from '@angular/core';
import { CrudService } from '@src/app/services/crud/crud.service';
import { DataService } from '@src/app/services/data.service';
import { ToolbarModule } from 'primeng/toolbar';
import { SectionConfig } from './old/crud.component';

@Component({
	selector: 'app-crud-base',
	imports: [ ToolbarModule ],
	standalone: true,
	template: `<div>Do not instantiate this class</div>`,
})

export class Crud implements OnInit {
    
	crudService: CrudService = inject(CrudService);
    // dataService: DataService = inject(DataService);
	sectionForm: any;


	creationFormVisible: boolean = false;
	batchDeleteButtonVisible: boolean = false;

    ngOnInit(): void {
        this.crudService.read(this.sectionConfig.model)
    }

	sectionConfig: SectionConfig = {
		model: '',
        icon: '',
		nameSingular: '',
		namePlural: '',
        formSize: 'LARGE',
	}

	toggleCreationForm(): void {
		this.creationFormVisible = !this.creationFormVisible;

		if(!this.creationFormVisible) {
			this.clearCreationForm();
		}
	}

	onRowsSelected(rows: any[]): void {
		if (rows.length > 0) {
			this.batchDeleteButtonVisible = true;
		} else {
			this.batchDeleteButtonVisible = false;
		}
	}

	clearCreationForm(): void {
		this.sectionForm.reset();
	}
	
}