import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { Results } from '@src/app/interfaces/results.interface';
import { DataService } from '@src/app/services/data.service';
import { Data } from '@angular/router';
import { environment } from '@src/environments/environment.development';


type ServiceActions = 'create' | 'edit' | 'delete' | 'batch-delete' | 'show' | null

export interface TableData {
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
	relationFields?: TableData[];
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
	imports: [ CommonModule, FormsModule, ButtonModule, CheckboxModule ],
	templateUrl: './crud.component.html'
})


export class CrudComponent implements OnChanges {
    
    dataService: DataService = inject(DataService);
    
    #state = signal<Results<any>>({
		loading: true,
		results: [],
		pagination: undefined,
		error: ''
	})
    
    public results = computed(() => this.#state().results)
	public pagination = computed(() => this.#state().pagination)
	public loading = computed(() => this.#state().loading)
	public error = computed(() => this.#state().error)
	// public softLoading = computed(() => this.#softLoading())

    @Input() tableData: TableData[] = [];
	@Input() sectionConfig: SectionConfig = { model: 'Default', visualId: 'name', nameSingular: 'Default', namePlural: 'Default' };
	@Input() sectionForm: FormGroup = new FormGroup({});
	@Input() formData: any = {};
    
    @ViewChild('mainCheckbox') mainCheckbox!: ElementRef;
    checked: boolean = false;

    selectedRows = signal<any[]>([]);
    data: any[] = [];

    ngOnInit() {
        this.read(this.sectionConfig.model)
    }

    ngOnChanges(changes: SimpleChanges) {
		
	}

    public read(modelName: string, url: string | null = null) {
		if (!url)
			url = `${environment.apiUrl}`+modelName

		// this.#state.set({loading: true, results: this.results(), pagination: this.pagination(), error: ''})
		// this.#softLoading.set(true);

		this.dataService.httpFetch(url)
			.subscribe({
				next: (res: any) => {
					this.#state.set({
						loading: false,
						results: res.data,
						pagination: this.dataService.makePagination(res.meta),
						error: ''
					})
                    console.log(this.#state())
				},
				error: (error: any) => {
					console.log("Error on users ", error)
				},
				complete: () => {
					// this.#softLoading.set(false);
				}
			});
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

    deselectAllRows(): void {

		this.data.forEach(row => {
			row.selected = false;
		});

		this.selectedRows.set([]);
	}

}