import { Component, OnInit, inject, signal } from '@angular/core';
import { CrudService } from '@src/app/services/crud/crud.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ListConfig, ListData, SectionConfig } from './old/crud.component';
import { Form, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-crud-base',
	imports: [ ToolbarModule ],
	standalone: true,
	template: `<div>Do not instantiate this class</div>`,
})

export class Crud implements OnInit {

	crudService: CrudService = inject(CrudService);

	listVisibility: boolean = true;
	batchDeleteButtonVisible: boolean = false;
	creationFormVisibility: boolean = false;

	relations: { [key: string]: any } = {};

    ngOnInit(): void {
		// this.toggleCreationForm(); // DEBUG

        this.crudService.read(this.sectionConfig.model)
		
		this.formFields.forEach(field => {
			if (field.options && field.options.name) {
				this.relations[field.options.name] = {};
			}
		});

		this.buildSectionForm();
    }


	sectionConfig: SectionConfig = {
		model: '',
        icon: '',
		nameSingular: '',
		namePlural: '',
        formSize: 'LARGE',
	}	

	listData: ListData[] = [];
	listConfig: ListConfig = { unDeleteableIds: [], unEditableIds: [] }
	formFields: any[] = [];
	sectionForm: FormGroup = new FormGroup({});
	currentRecord: any = {};

	
    fetchRelation(model: string, field: string) {
        this.crudService.dataService.getModelData(model).subscribe(
            data => {
                this.relations[model] = data; 
                this.updateFormFieldsWithData(field, data); 
            }
        );
    }

	buildSectionForm() {
		this.sectionForm = new FormGroup({});

		this.formFields.forEach(field => {
			this.sectionForm.addControl(
				field.name,
				new FormControl(null, field.validators))

			if (field.value)
				this.sectionForm.get(field.name)?.setValue(field.value)
		});

	}

	updateFormFieldsWithData(fieldName: string, data: any[]) {
        // console.log('Updating field:', fieldName);
		// console.log('Available fields:', this.formFields);
        // console.log('Found field:', this.formFields.find(f => f.name === fieldName));
        // console.log('New data:', data);
        const field = this.formFields.find(f => f.name === fieldName);
        if (field && field.options) {
            field.options.data = data;
            this.buildSectionForm(); // Rebuilds the form with new data
        }
    }

	toggleCreationForm(visibility: boolean = true): void {
		
		if(visibility) {
			this.creationFormVisibility = true;
			this.toggleList(false)
		} else {
			this.creationFormVisibility = false;
			this.clearCreationForm();
		}
	}

	submitForm() {
		if(!this.validateForm()) {
			return
		}

		this.crudService.save(this.sectionForm.getRawValue(), this.sectionConfig.model)!
		.subscribe({
			next: (res: any) => {
				this.crudService.notificationService.success('El registro se ha creado correctamente', '');
				this.crudService.read(this.sectionConfig.model)
			},
			error: (error: any) => {
				let errors = error.error;
				if(errors) {
					this.sectionForm.get('errors')?.setErrors({serverError: errors.errors})
					let errors_test: string = '';
					for (let key in errors.errors) {
						errors_test += '- ' + errors.errors[key] + '\n';
					}

					this.crudService.notificationService.error("There are errors on the form ", errors_test);
				}
			},
			complete: () => {
				this.sectionForm.reset();
			}
		});
	}

	validateForm(): boolean {
		if (!this.sectionForm.valid) {
			this.sectionForm.markAllAsTouched();
			console.log("Error on form ", this.sectionForm)
			return false
		} else {
			return true
		}
	}


	toggleList(visibility: boolean = true): void {
		if(visibility) {
			this.listVisibility = true;
			this.toggleCreationForm(false);
		} else {
			this.listVisibility = false;
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