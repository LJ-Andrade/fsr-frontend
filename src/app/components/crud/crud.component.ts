import { Component, ElementRef, Input, OnChanges,  SimpleChanges, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SkeletonComponent } from "../skeleton/skeleton.component";
import { ToolbarModule } from 'primeng/toolbar';
import { CrudService } from '@src/app/services/crud/crud.service';
import { FieldErrorComponent } from '../field-error/field-error.component';

type FormState = 'IDLE' | 'SUCCESS' | 'ERROR'

export interface ListData {
	name: string;
	text: string;
	valueClass?: string;
	relation?: boolean;
	image?: boolean;
	manyRelations?: boolean;
	relationName?: any;
	relationFieldName?: any;
	mutate?: (data: any) => string;
	selectedRows?: boolean;
	hidden?: boolean;
	hideOnCreation?: boolean;
	hideOnEdition?: boolean;
	hideOnList?: boolean;
	hideOnShow?: boolean;
	fieldType?: string;
	columnClass?: string;
	relationFields?: ListData[];
	limitText?: number;
}

export interface SectionConfig {
	model: string;
	nameSingular: string;
	namePlural: string;
}

@Component({
	selector: 'app-crud',
	standalone: true,
	imports: [
		CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, CheckboxModule, 
		ToolbarModule, SkeletonComponent, FieldErrorComponent ],
	templateUrl: './crud.component.html'
})

export class CrudComponent implements OnChanges {
    
	crudService: CrudService = inject(CrudService);
    
	@Input() listData: ListData[] = [];
	@Input() sectionConfig: SectionConfig = { model: 'Default', nameSingular: 'Default', namePlural: 'Default' };
	@Input() formFields: any[] = []
	@Input() formData: any = {};
	
    @ViewChild('mainCheckbox') mainCheckbox!: ElementRef;

	sectionForm = new FormGroup({});
	formState: FormState = 'IDLE'
	loading: boolean = false

	selectedRows = signal<any[]>([]);
	selectedRowsCount = computed(() => this.selectedRows().length);
	activeData: any = {}
	data: any[] = [];
	
    checked: boolean = false;
	creationFormVisible: boolean = false;

    ngOnInit() {
        this.crudService.read(this.sectionConfig.model)
		this.buildSectionForm()
    }

    ngOnChanges(changes: SimpleChanges) {
		
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

}