import { Component, ElementRef, Input, OnChanges,  SimpleChanges, ViewChild, inject, signal } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SkeletonComponent } from "../skeleton/skeleton.component";
import { ToolbarModule } from 'primeng/toolbar';
import { CrudService } from '@src/app/services/crud/crud.service';
import { environment } from '@src/environments/environment.development';
import { FieldErrorComponent } from '../field-error/field-error.component';

// type ServiceActions = 'create' | 'edit' | 'delete' | 'batch-delete' | 'show' | null
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
	visualId: string,
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
	// public softLoading = computed(() => this.#softLoading())

    @ViewChild('mainCheckbox') mainCheckbox!: ElementRef;

    @Input() listData: ListData[] = [];
	@Input() sectionConfig: SectionConfig = { model: 'Default', visualId: 'name', nameSingular: 'Default', namePlural: 'Default' };
	@Input() formFields: any[] = []
	@Input() formData: any = {};
    
	sectionForm = new FormGroup({});
	formState: FormState = 'IDLE'
	loading: boolean = false

    selectedRows = signal<any[]>([]);
    // data: any[] = [];
	
    checked: boolean = false;
	creationFormVisible: boolean = false;

    ngOnInit() {
        this.crudService.read(this.sectionConfig.model)
		this.buildSectionForm()
    }

    ngOnChanges(changes: SimpleChanges) {
		
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


	submitForm() {

		// console.log("Sending data: ", this.formGroup.value)

		if(this.validateForm()) {
			this.loading = true

			this.crudService.dataService.httpPost(environment.apiUrl + this.sectionConfig.model,
			this.buildFormData(this.sectionForm.value))
			.subscribe({

				next: (res: any) => {
					this.formState = 'SUCCESS'
					console.log(res)
					// if(res.result){
					// 	this.formState = 'SUCCESS'
					// } else {
					// 	this.formState = 'ERROR'
					// 	console.log(res)
					// }
				},
				error: (err: any) => {
					console.log(err)
					this.formState = 'ERROR'
				}
			})
		}
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



    
    toggleAllRows(event: any): void {

		if(event.target.checked) {
			if (this.selectedRows().length >= 0) {
				// this.data = this.crudService.results().filter(row => {
				// 	row.selected = true;
				// 	return true;
				// });
			 }
		} else {
			this.deselectAllRows()
		}

		// this.updateSelected()
	}

//#region  Row Selection
	toggleCreationForm(): void {
		this.creationFormVisible = !this.creationFormVisible;

		if(!this.creationFormVisible) {
			this.clearCreationForm();
		}
	}

	clearCreationForm(): void {
		this.sectionForm.reset();
	}

//#endregion


    deselectAllRows(): void {

		// this.data.forEach(row => {
		// 	row.selected = false;
		// });

		// this.selectedRows.set([]);
	}

}