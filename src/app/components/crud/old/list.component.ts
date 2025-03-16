

import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonComponent } from '../../skeleton/skeleton.component';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-list-component',
    templateUrl: './list.component.html',
    standalone: true,
    imports: [ CommonModule, ToolbarModule, SkeletonComponent, CheckboxModule, FormsModule, ButtonModule ]
})

export class ListComponent {

    @Input() listData: any[] = [];
    @Input() listConfig: any = {};
    @Input() results = signal<any[]>([]);
    @Input() loading: boolean = false;
    @Output() showDeleteConfirmation = new EventEmitter<void>();
    
    selectedRows = signal<any[]>([]);
    selectedRowsCount = computed(() => this.selectedRows().length);
	activeData: any = {}
    data: any[] = [];
	recordsToDelete: any[] = [];


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
				this.data = this.results().filter(row => {
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
		this.selectedRows.set(this.results().filter(row => row.selected));
		console.log("Selected Rows ", this.selectedRows())
	}

    deselectAllRows(): void {

		this.data.forEach(row => {
			row.selected = false;
		});

		this.selectedRows.set([]);
	}

//#region Delete


    addSelectedToDeleteQueue() {
		this.recordsToDelete = []
		this.recordsToDelete = this.selectedRows()
		// this.showDeleteConfirmation()
	}

	deleteSingleRecord(record: {}) {
		this.recordsToDelete = []
		this.recordsToDelete.push(record)
		// this.showDeleteConfirmation()
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


//#endregion Delete

}



