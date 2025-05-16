import { Injectable, OnInit, inject } from '@angular/core';
import { CrudService } from '@src/app/services/crud.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ListConfig, ListData, SectionConfig } from '@src/app/interfaces/crud.interface';


@Injectable({
    providedIn: 'root'
})

export class CrudBase implements OnInit {

	crudService: CrudService = inject(CrudService);

	listVisibility: boolean = true;
	batchDeleteButtonVisible: boolean = false;
	creationFormVisibility: boolean = false;
	currentPage: number = 1;

	relations: { [key: string]: any } = {};
	debug: boolean = false;

    ngOnInit(): void {
	   	this.fetchData();
	   	this.buildSectionForm();
		this.buildSearchForm();

		if (this.debug) {
			console.info("Debug mode is activated on the current view file")
			console.log('Section config ', this.sectionConfig)
			console.log('List data ', this.listData)
			console.log('List config ', this.listConfig)
			console.log('Form fields ', this.formFields)
			
			console.log('Relations ', this.relations)
		}

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
	searchForm: FormGroup = new FormGroup({});
	currentRecord: any = {};


	fetchData(params: any = {}) {
		
		// if (page > 1) {
		// 	this.currentPage = page;
		// }

		let perPage: number = 10;
		if (localStorage.getItem('perPage')) {
			perPage = parseInt(localStorage.getItem('perPage')!);
		}
		
		params['list_regs_per_page'] = perPage;
		this.currentPage = params['page']
		
		this.crudService.read(this.sectionConfig.model, params)

	}

    fetchRelation(model: string, field: string) {
        this.crudService.dataService.getModelData(model).subscribe(
            data => {
                this.relations[model] = data; 
                this.updateFormFieldsWithData(field, data);
				this.updateSearchFormWithData(model, data);
            }
        );
    }

	buildSectionForm() {
		this.formFields.forEach(field => {
			if (field.options && field.options.name) {
				this.relations[field.options.name] = {};
			}
		});

		this.sectionForm = new FormGroup({});

		this.formFields.forEach(field => {
			this.sectionForm.addControl(
				field.name,
				new FormControl(null, field.validators))

			if (field.value)
				this.sectionForm.get(field.name)?.setValue(field.value)
		});

	}

	buildSearchForm() {
		this.listData.forEach((field: any) => {
			if (field.search) {
				this.searchForm.addControl(
					field.name, new FormControl(null))
			}
		});
	}


	updateFormFieldsWithData(fieldName: string, data: any[]) {
        const field = this.formFields.find(f => f.name === fieldName);
        if (field && field.options) {
            field.options.data = data;
            this.buildSectionForm(); // Rebuilds the form with new data
        }
    }

	updateSearchFormWithData(fieldName: string, data: any[]) {
        this.listData.forEach((field: any) => {
			if (field.name == fieldName) {
				field.search.options.data = data;
				this.buildSearchForm(); // Rebuilds the form with new data
			}
        });
    }


	submitForm() {
		console.log(this.validateForm())
		if(!this.validateForm()) {
			return
		}

		this.crudService.save(this.sectionForm.getRawValue(), this.sectionConfig.model)!
		.subscribe({
			next: (res: any) => {
				let message: string = '';
				if (res.meta && res.meta.operation == 'update') {
					message = 'The record has been updated successfully';
				} else {
					message = 'The record has been created successfully';
				}
				this.crudService.notificationService.success(message, '');
				this.fetchData();
			},
			error: (error: any) => {
				let errors = error.error;
				if(errors) {
					this.sectionForm.get('errors')?.setErrors({serverError: errors.errors})
					console.log("Error on form ", errors)
					
					let error_message: string = '';
					
					if (errors.errors) {
						for (let key in errors.errors) {
							error_message += '- ' + errors.errors[key] + '\n';
						}
					}

					if (errors.error) {
						error_message += '- '+ errors.error + '\n';
					}

					this.crudService.notificationService.error("There are errors on the form ", error_message);
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
		this.clearCreationForm();

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
		// console.log('Form ', this.sectionForm)
		// this.sectionForm.patchValue(record);
		// console.log("form fields ", this.formFields)
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