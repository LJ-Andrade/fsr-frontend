import { RouterModule } from '@angular/router'
import { Component } from '@angular/core'
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ RouterModule, PanelModule, CardModule ],
    templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.sass']
})

export default class DashboardComponent{

   
 
}
