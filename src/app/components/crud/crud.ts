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

	ngOnDestroy(): void {
		this.clearCreationForm();
		this.crudService.clearResults();
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
        const field = this.formFields.find(f => f.name === fieldName);
        if (field && field.options) {
            field.options.data = data;
            this.buildSectionForm(); // Rebuilds the form with new data
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

	toggleCreationForm(visibility: boolean = true, clearForm: boolean = false): void {
		this.hideOtherComponents()
		if(visibility) {
			this.creationFormVisibility = true;
		} else {
			this.creationFormVisibility = false;
			if (clearForm) {
				this.clearCreationForm();
			}
		}
	}


	editRecord(record: any) {
		this.toggleEditForm(true, record);

	}

	toggleEditForm(visibility: boolean = true, record: any = null): void {
		this.hideOtherComponents()
		
		if(visibility) {
			this.creationFormVisibility = true;
			// this.currentRecord = record;
			this.fillFormWithRecordData(record);
		} else {
			this.creationFormVisibility = false;
			this.clearCreationForm();
		}
	}
	
	fillFormWithRecordData(record: any) {
		// console.log('Record ', record)
		console.log('Form ', this.sectionForm)
		// this.sectionForm.patchValue(record);
		console.log("form fields ", this.formFields)
		this.formFields.forEach(field => {
			
			if(field.isRelation) {
				// console.log(this.sectionForm.get(field.name))
				// console.log("Record ", record)
				// console.log("Field name ", field.options.name)
				// console.log('Relation ', field.name, record[field.options.name][0])
				if (record[field.options.name][0] == undefined) {
					this.sectionForm.get(field.name)?.setValue(null);
				} else {
					this.sectionForm.get(field.name)?.setValue(record[field.options.name][0]);
				}
			} else {
				// console.log("normal field")
				this.sectionForm.get(field.name)?.setValue(record[field.name]);
			}
		});
	}
	

	toggleList(visibility: boolean = true): void {
		this.hideOtherComponents()
		if(visibility) {
			this.listVisibility = true;
		} else {
			this.listVisibility = false;
		}
	}

	hideOtherComponents() {
		this.creationFormVisibility = false;
		this.listVisibility = false;
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
		this.sectionForm.clearValidators();
		this.sectionForm.updateValueAndValidity();
	}

		
}