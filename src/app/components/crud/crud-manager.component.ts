import { Component, computed, EventEmitter, inject, Input, Output, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { ToolbarModule } from 'primeng/toolbar';
import { Results } from '@src/app/interfaces/results.interface';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { Badge } from 'primeng/badge';
import { NotificationService } from '@src/app/services/notification.service';
import { CrudService } from '@src/app/services/crud/crud.service';
import { SectionConfig } from '@src/app/interfaces/crud.interface';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup';
import { SelectModule } from 'primeng/select';

@Component({
	selector: 'app-crud-manager',
	templateUrl: './crud-manager.component.html',
	standalone: true,
	imports: [ CommonModule, SkeletonComponent,	 ToolbarModule, CheckboxModule, FormsModule, ReactiveFormsModule,
		 InputGroupAddonModule, InputTextModule, InputGroup, PaginatorModule, ButtonModule, 
		 DialogModule, PanelModule, Badge, SelectModule
	]
})

export class CrudManagerComponent {

	notificationService: NotificationService = inject(NotificationService);
	crudService: CrudService = inject(CrudService);

	@Input() sectionConfig: SectionConfig = { model: '', icon: '', nameSingular: '', namePlural: '', formSize: 'LARGE' };
	@Input() listData: any[] = [];
	@Input() listConfig: any = {};
	@Input() apiDataResponse!: Signal<Results<any>>
	@Input() listVisibility: boolean = true;
	@Input() creationFormVisibility: boolean = true;
	@Input() searchForm: FormGroup = new FormGroup({});
	
	@Output() rowsSelected = new EventEmitter<any[]>();
	@Output() requestRead = new EventEmitter<{[key: string]: any}>();
	@Output() requestCreationForm = new EventEmitter<void>();
	@Output() requestList = new EventEmitter<void>();
	@Output() requestEdit = new EventEmitter<any>();
	
	selectedRows = signal<any[]>([]);
	selectedRowsCount = computed(() => this.selectedRows().length);
	activeData: any = {}
	currentData: any[] = []; // CHeck why I made this for,
	displayDeleteConfirmation: boolean = false;
	recordsToDelete: any[] = [];
	creationFormTitle: string = 'Creating ' + this.sectionConfig.nameSingular;
	currentPage: number = 1;
	
	
	searchOptionsVisibility: boolean = false;
	advancedSearchOptionsVisibility: boolean = false;
	advancedSearchAvailable: boolean = true;


	// ngOnInit() {
	// 	this.buildSearchForm()
	// }

	emitRequestRead() {
		this.requestRead.emit({ page: this.currentPage })
	}

	emitRequestList() {
		this.requestList.emit()
	}

	emitRequestCreationForm() {
		this.requestCreationForm.emit()
		this.creationFormTitle = 'Creating ' + this.sectionConfig.nameSingular;
		this.toggleSearchOptions(false);
	}
	
	emitRequestEdit(record: any) {
		this.requestEdit.emit(record);
		this.creationFormTitle = 'Editing ' + this.sectionConfig.nameSingular;
		this.toggleSearchOptions(false);
	}

//#region Search

// buildSearchForm() {

// 	this.listData.forEach((field: any) => {
		
// 		if (field.search) {
// 			this.searchForm.addControl(
// 				field.name,
// 				new FormControl(null))

// 			// If at least 1 field has a search property, then show the advanced search options
// 			this.advancedSearchAvailable = true;
// 		}
// 	});

// }




submitSearch() {
	console.log(this.searchForm.value)
	let searchParams: any = {};
	for (const key in this.searchForm.value) {
		if (this.searchForm.value[key] !== null) {
			searchParams[key] = this.searchForm.value[key];
		}
	}
	this.requestRead.emit(searchParams)
}

toggleSearchOptions(show: boolean = true) {
	if (show) {
		this.searchOptionsVisibility = true;
		this.advancedSearchOptionsVisibility = false;
	} else {
		this.searchOptionsVisibility = false;
		this.advancedSearchOptionsVisibility = false;
	}
}

toggleAdvancedSearchOptions() {
	this.advancedSearchOptionsVisibility = !this.advancedSearchOptionsVisibility;
}


resetAdvancedSearchOptions() {
	this.requestRead.emit()
	this.searchForm.reset()
}
//#endregion Search


//#region Row Selection
	
	toggleRowSelection(row: any): void {
		this.updateSelected();
		this.rowsSelected.emit(this.selectedRows());
	}
	

	toggleAllRows(event: any): void {
		if (event.target.checked) {
			
		  this.currentData = this.apiDataResponse().results.filter(row => {
			row.selected = true;
			return true;
		  });
		} else {
		  this.deselectAllRows();
		  this.currentData = [];
		}
		this.updateSelected();
		this.rowsSelected.emit(this.selectedRows());

		console.log(this.currentData)
	}

	updateSelected(): void {
		this.selectedRows.set(this.apiDataResponse().results.filter(row => row.selected));
	}

	deselectAllRows(): void {
		this.apiDataResponse().results.forEach(row => (row.selected = false));
		this.selectedRows.set([]);
		this.rowsSelected.emit(this.selectedRows());
	}

//#endregion




//#region Delete

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

		for (let record of this.recordsToDelete) {
			if(this.listConfig.unDeleteableIds.includes(record['id'])) {
				this.notificationService.error('You cannot delete the record: ' + record.name, '');
			} else {
				const success = await this.performDelete(record['id']);
				if (!success) {
					allSuccessful = false;
				}
			}
		}

		if (allSuccessful) {
			this.notificationService.success('All records were successfully deleted', '');
			this.selectedRows.set([])
		} else {
			this.notificationService.error('Some records could not be deleted', '');
		}
	}

	performDelete(id: number): Promise<boolean> {
		return new Promise((resolve) => {
			this.crudService.delete(id, this.sectionConfig.model)
			.subscribe({
				next: (res: any) => {
					this.emitRequestRead();
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

//#region Pagination


	onPageChange(page?: number, rows?: number) {
		if (page !== undefined && rows !== undefined) {
			const currentPage = page + 1;
			const perPage = rows;
			// const url = `${this.sectionConfig.model}?page=${currentPage}&list_regs_per_page=${perPage}`;
			localStorage.setItem('perPage', perPage.toString());
			this.requestRead.emit({ page: currentPage })
			this.currentPage = currentPage;
		}
	}

//#endregion Pagination

}



