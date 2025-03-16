import { Component, OnInit, inject, signal } from '@angular/core';
import { DataService } from '@src/app/services/data.service';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
	selector: 'app-crud-base',
	imports: [ ToolbarModule ],
	standalone: true,
	template: `<div>Do not instantiate this class</div>`,
})

export class Crud implements OnInit {
    
    dataService: DataService = inject(DataService);

    roles = signal<any[]>([])

	creationFormVisible: boolean = false;

    ngOnInit(): void {
        
    }

}