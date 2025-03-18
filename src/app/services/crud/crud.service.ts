import { Injectable, computed, inject, signal } from '@angular/core';
import { Results } from '@src/app/interfaces/results.interface';
import { DataService } from '@src/app/services/data.service';
import { NotificationService } from '@src/app/services/notification.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class CrudService extends DataService  {

	notificationService: NotificationService = inject(NotificationService);
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

	public apiDataResponse = this.#state;
	
	public clearResults() {
		this.#state.set({loading: true, results: [], pagination: undefined, error: ''})
	}

	public read(modelName: string, url: string | null = null) {
		if (!url)
			url = modelName
		
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
				}
			});
	}

	save(data: any, model: string): Observable<any>  {

		return new Observable(observer => {
			this.httpPost(model, data).subscribe({
				next: (res: any) => {
					observer.next(res);
					console.log(res)
				},
				error: (error: any) => {
					console.log("Error on crudService ", error);
					observer.error(error);
				},
				complete: () => {
					observer.complete();
					console.log('completed')
				}
			});
		});
	}

	delete(id: number, route: string) {

		return new Observable(observer => {
			this.httpDelete(route+'/'+id).subscribe({
				next: (res: any) => {
					observer.next(res);
				},
				error: (error: any) => {
					console.log("Error on crudService ", error);
					observer.error(error);
				},
				complete: () => {
					observer.complete();
				}
			});
		});
	}


	getFormData(data: any, isEdit: boolean = false): any {
		let formData = new FormData();

		if (data == undefined) {
			console.error("Data is undefined on save method.")
			return formData
		}

		for(let key in data) {
			let value = data[key]

			if (Array.isArray(value)) {
				formData.append(key, JSON.stringify(data[key]))
			} else {
				formData.append(key, value);
			}
		}

		if(isEdit) {
			formData.append('_method', 'PUT')
		}

		return formData
	}


}
