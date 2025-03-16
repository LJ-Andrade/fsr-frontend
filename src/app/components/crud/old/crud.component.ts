import { Component, ElementRef, Input, OnChanges,  SimpleChanges, TemplateRef, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { CheckboxModule } from 'primeng/checkbox';
import { CrudService } from '@src/app/services/crud/crud.service';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { Panel, PanelModule } from 'primeng/panel';
import { SkeletonComponent } from '../../skeleton/skeleton.component';
import { FieldErrorComponent } from '../../field-error/field-error.component';
import { Toolbar } from 'primeng/toolbar';

type FormState = 'IDLE' | 'SUCCESS' | 'ERROR'

export interface ListData {
	name: string;
	text: string;
	unDeleteableIds?: number[];
	unEditableIds?: number[];

	valueClass?: string;
	image?: boolean;
	mutate?: (data: any) => string;
	hidden?: boolean;
	hideOnList?: boolean;
	hideOnCreation?: boolean;
	hideOnEdition?: boolean;
	columnClass?: string;

	relation?: boolean;
	relationName?: any;
	relationFieldName?: any;

	// manyRelations?: boolean;
	// selectedRows?: boolean;
	// hideOnShow?: boolean;
	// fieldType?: string;
	// relationFields?: ListData[];
	// limitText?: number;
}

export interface ListConfig {
	unDeleteableIds: number[];
	unEditableIds: number[];
}

export interface SectionConfig {
	model: string;
	icon: string;
	nameSingular: string;
	namePlural: string;
	formSize: 'SMALL' | 'MEDIUM' | 'LARGE'
}

@Component({
	selector: 'app-crud',
	standalone: true,
	imports: [
		CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, CheckboxModule, Panel, IftaLabelModule,
		Toolbar, SkeletonComponent, FieldErrorComponent, InputTextModule, Message, DialogModule ],
	templateUrl: './crud.component.html'
})

export class CrudComponent implements OnChanges {
    
	crudService: CrudService = inject(CrudService);
    
	@Input() sectionConfig: SectionConfig = { 
		model: 'Default', 
		icon: '', 
		nameSingular: 'Default', 
		namePlural: 'Default', 
		formSize: 'LARGE'
	};
	@Input() listData: ListData[] = [];
	@Input() dataRelations: {} = {};
	@Input() listConfig: ListConfig = { unDeleteableIds: [], unEditableIds: [] };
	@Input() formFields: any[] = []
	@Input() formData: any = {};
	@Input() customForm!: TemplateRef<any>;

	
    @ViewChild('mainCheckbox') mainCheckbox!: ElementRef;

	sectionForm = new FormGroup({});
	formState: FormState = 'IDLE'
	loading: boolean = false

	selectedRows = signal<any[]>([]);
	selectedRowsCount = computed(() => this.selectedRows().length);
	activeData: any = {}
	data: any[] = [];
	recordsToDelete: any[] = [];

    checked: boolean = false;
	creationFormVisible: boolean = false;
	displayDeleteConfirmation: boolean = false;

    ngOnInit() {
        this.crudService.read(this.sectionConfig.model)
		this.buildSectionForm()
    }

    ngOnChanges(changes: SimpleChanges) {
		
	}

	ngOnDestroy() {
		this.crudService.clearResults();
	}

//#region Forms

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
					for (let key in errors) {
						this.sectionForm.get(key)?.setErrors({serverError: errors[key]})
						this.crudService.notificationService.error("Error ", errors[key]);
					}
				}
			},
			complete: () => {
				this.sectionForm.reset();
			}
		});
	}

	buildFormData(data: any): FormData {
		let formData = new FormData();

		for(let key in data) {
			formData.append(key, data[key])
		}

		return formData
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

//#endregion

//#region  Row Selection

	toggleRowSelection(row: any): void {
		if(this.selectedRowsCount() === 1) {
			this.activeData = row;
		} else {
			this.activeData = {}
		}
		this.updateSelected();	
	}

    toggleAllRows(event: any): void {
		
		if(event.target.checked) {
			if (this.selectedRows().length >= 0) {
				this.data = this.crudService.results().filter(row => {
					row.selected = true;
					return true;
				});
			 }
		} else {
			this.deselectAllRows()
		}
		this.updateSelected()
	}

	updateSelected(): void {
		this.selectedRows.set(this.crudService.results().filter(row => row.selected));
		console.log("Selected Rows ", this.selectedRows())
	}

	toggleCreationForm(): void {
		this.creationFormVisible = !this.creationFormVisible;

		if(!this.creationFormVisible) {
			this.clearCreationForm();
		}
	}

	clearCreationForm(): void {
		this.sectionForm.reset();
	}

    deselectAllRows(): void {

		this.data.forEach(row => {
			row.selected = false;
		});

		this.selectedRows.set([]);
	}

//#endregion

//#region Delete

	// requestDelete(record: {}) {
	// 	console.log("Request Delete", record)
	// 	this.recordsToDelete = [record];
	// 	this.showDeleteConfirmation()
	// }

	addSelectedToDeleteQueue() {
		this.recordsToDelete = []
		this.recordsToDelete = this.selectedRows()
		this.showDeleteConfirmation()
	}

	deleteSingleRecord(record: {}) {
		this.recordsToDelete = []
		this.recordsToDelete.push(record)
		this.showDeleteConfirmation()
	}

	async confirmDelete() {
		let allSuccessful: boolean = true;
		console.log("Records to delete", this.recordsToDelete)

		for (let record of this.recordsToDelete) {
			if(this.listConfig.unDeleteableIds.includes(record['id'])) {
				this.crudService.notificationService.error('You cannot delete the record: ' + record.name, '');
			} else {
				const success = await this.performDelete(record['id']);
				if (!success) {
					allSuccessful = false;
				}
			}
		}

		if (allSuccessful) {
			this.crudService.notificationService.success('All records were successfully deleted', '');
			this.selectedRows.set([])
		} else {
			this.crudService.notificationService.error('Some records could not be deleted', '');
		}
	}

	performDelete(id: number): Promise<boolean> {
		return new Promise((resolve) => {
			this.crudService.delete(id, this.sectionConfig.model)
			.subscribe({
				next: (res: any) => {
					this.crudService.read(this.sectionConfig.model);
					resolve(true);
				},
				error: (error: any) => {
					this.crudService.notificationService.error('Error deleting the record', '');
					resolve(false);
				},
				complete: () => {
					this.closeDeleteConfirmation();
				}
			});
		});
	}


	closeDeleteConfirmation() {
		this.displayDeleteConfirmation = false;
	}

	showDeleteConfirmation() {
		this.displayDeleteConfirmation = true;
	}

//#endregion Delete

	log(value: any) {
		console.log(value)
	}
}