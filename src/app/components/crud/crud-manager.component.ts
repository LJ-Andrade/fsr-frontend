import { Component, computed, ContentChild, EventEmitter, Input, Output, Signal, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { ToolbarModule } from 'primeng/toolbar';
import { Results } from '@src/app/interfaces/results.interface';
import { SectionConfig } from './old/crud.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { Badge } from 'primeng/badge';

@Component({
    selector: 'app-crud-manager',
    templateUrl: './crud-manager.component.html',
    standalone: true,
    imports: [ CommonModule, SkeletonComponent,	 ToolbarModule, CheckboxModule, 
		FormsModule, PaginatorModule, ButtonModule, DialogModule, PanelModule, Badge ]
})

export class CrudManagerComponent {

	@Input() sectionConfig: SectionConfig = { model: '', icon: '', nameSingular: '', namePlural: '', formSize: 'LARGE' };
    @Input() listData: any[] = [];
    @Input() listConfig: any = {};
    @Input() apiDataResponse!: Signal<Results<any>>
	@Input() listVisibility: boolean = true;
	@Input() creationFormVisibility: boolean = true;

	@Output() rowsSelected = new EventEmitter<any[]>();
	@Output() requestCreationForm = new EventEmitter<void>();
	@Output() toggleList = new EventEmitter<void>();
	@Output() requestRead = new EventEmitter<string>();
	
    selectedRows = signal<any[]>([]);
    selectedRowsCount = computed(() => this.selectedRows().length);
	activeData: any = {}
    currentData: any[] = [];
	displayDeleteConfirmation: boolean = false;
	recordsToDelete: any[] = [];

	emitRequestCreationForm() {
		this.requestCreationForm.emit();
		this.toggleListVisibility(false)
	}

    //#region  Row Selection

	// toggleRowSelection(row: any): void {
	// 	if(this.selectedRowsCount() === 1) {
	// 		this.activeData = row;
	// 	} else {
	// 		this.activeData = {}
	// 	}
	// 	this.updateSelected();
	// }

	toggleListVisibility(visibility: boolean = true): void {
		if (visibility) {
			this.listVisibility = true;
			this.toggleList.emit();
		} else {
			this.listVisibility = false;
		}
	}
	
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
		console.log("Selected Rows ", this.selectedRows())
	}

	deselectAllRows(): void {
		this.apiDataResponse().results.forEach(row => (row.selected = false));
		this.selectedRows.set([]);
		this.rowsSelected.emit(this.selectedRows());
	}

    // deselectAllRows(): void {

	// 	this.currentData.forEach(row => {
	// 		row.selected = false;
	// 	});

	// 	this.selectedRows.set([]);
	// }

//#region Delete


    addSelectedToDeleteQueue() {
		this.recordsToDelete = []
		this.recordsToDelete = this.selectedRows()
		// this.showDeleteConfirmation()
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
				// this.crudService.notificationService.error('You cannot delete the record: ' + record.name, '');
			} else {
				const success = await this.performDelete(record['id']);
				if (!success) {
					allSuccessful = false;
				}
			}
		}

		if (allSuccessful) {
			// this.crudService.notificationService.success('All records were successfully deleted', '');
			this.selectedRows.set([])
		} else {
			// this.crudService.notificationService.error('Some records could not be deleted', '');
		}
	}

	performDelete(id: number): Promise<boolean> {
		return new Promise((resolve) => {
			// this.crudService.delete(id, this.sectionConfig.model)
			// .subscribe({
			// 	next: (res: any) => {
			// 		this.crudService.read(this.sectionConfig.model);
			// 		resolve(true);
			// 	},
			// 	error: (error: any) => {
			// 		this.crudService.notificationService.error('Error deleting the record', '');
			// 		resolve(false);
			// 	},
			// 	complete: () => {
			// 		this.closeDeleteConfirmation();
			// 	}
			// });
		});

	}
	
	closeDeleteConfirmation() {
		this.displayDeleteConfirmation = false;
	}

	showDeleteConfirmation() {
		this.displayDeleteConfirmation = true;
	}

//#endregion Delete

	onPageChange(event: PaginatorState) {
		if (event.page !== undefined && event.rows !== undefined) {
			const page = event.page + 1;
			const perPage = event.rows;
			const url = `${this.sectionConfig.model}?page=${page}&per_page=${perPage}`;
			this.requestRead.emit(url)
		}
	}

}



