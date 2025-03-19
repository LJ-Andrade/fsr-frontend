import { Component, computed, EventEmitter, inject, Input, Output, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { ToolbarModule } from 'primeng/toolbar';
import { Results } from '@src/app/interfaces/results.interface';
import { SectionConfig } from './old/crud.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { Badge } from 'primeng/badge';
import { NotificationService } from '@src/app/services/notification.service';
import { CrudService } from '@src/app/services/crud/crud.service';

@Component({
	selector: 'app-crud-manager',
	templateUrl: './crud-manager.component.html',
	standalone: true,
	imports: [ CommonModule, SkeletonComponent,	 ToolbarModule, CheckboxModule, 
		FormsModule, PaginatorModule, ButtonModule, DialogModule, PanelModule, Badge 
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

	@Output() rowsSelected = new EventEmitter<any[]>();
	@Output() requestCreationForm = new EventEmitter<void>();
	@Output() requestList = new EventEmitter<void>();
	@Output() requestRead = new EventEmitter<number>();
	@Output() requestEdit = new EventEmitter<any>();
	
	
	selectedRows = signal<any[]>([]);
	selectedRowsCount = computed(() => this.selectedRows().length);
	activeData: any = {}
	currentData: any[] = [];
	displayDeleteConfirmation: boolean = false;
	recordsToDelete: any[] = [];
	creationFormTitle: string = 'Creating ' + this.sectionConfig.nameSingular;
	currentPage: number = 1;
	// ngOnInit() {
	// 	this.
	// }
	
	emitRequestRead() {
		this.requestRead.emit(this.currentPage)
	}

	emitRequestList() {
		this.requestList.emit()
	}

	emitRequestCreationForm() {
		this.requestCreationForm.emit()
		this.creationFormTitle = 'Creating ' + this.sectionConfig.nameSingular;	
	}
	
	emitRequestEdit(record: any) {
		this.requestEdit.emit(record);
		this.creationFormTitle = 'Editing ' + this.sectionConfig.nameSingular;	
	}
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
		}
		this.updateSelected();
		this.rowsSelected.emit(this.selectedRows());
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


//#region Edit


// editRecord(record: any) {
// 	console.log(record)
// 	this.activeData = record;
// 	this.requestEdit.emit(this.activeData);
// 	// this.displayEdit = true;
// }

//#endregion Edit


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
			const url = `${this.sectionConfig.model}?page=${currentPage}&list_regs_per_page=${perPage}`;
			localStorage.setItem('perPage', perPage.toString());
			this.currentPage = currentPage;
			this.requestRead.emit(currentPage)
		}
	}

//#endregion Pagination

}



