import { Injectable, computed, inject, signal } from '@angular/core';
import { Results } from '@src/app/interfaces/results.interface';
import { DataService } from '@src/app/services/data.service';
import { NotificationService } from '@src/app/services/notification.service';
import { environment } from '@src/environments/environment';
import { Observable, of } from 'rxjs';


// export interface CrudOperations {
//     fetch(modelName: string, url?: string ): any;
//     save(data: any, model: string): any;
//     edit(data: any, model: string): any;
//     delete(id: number, model: string): any;
// }


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
    

	save(data: any, model: string): Observable<any>  {

		return new Observable(observer => {
			this.httpPost(`${environment.apiUrl+model}`, data).subscribe({
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


	// edit(data: any, model: string): Observable<any> {

	// 	if (data == undefined) {
	// 		console.error("Data is undefined on save method.")
	// 		return of(null);
	// 	}

	// 	this.#softLoading.set(true);

	// 	let formData = this.getFormData(data, true)

	// 	return new Observable(observer => {
	// 		this.httpPost(`${environment.apiUrl+model+'/'+data.id}`, formData).subscribe({
	// 			next: (res: any) => {
	// 				observer.next(res);
	// 			},
	// 			error: (error: any) => {
	// 				console.log("Error on crudService ", error);
	// 				// this.#state.set({loading: false, results: [], pagination: undefined, error: "Error al cargar los datos. Inténtalo más tarde."});
	// 				observer.error(error);
	// 			},
	// 			complete: () => {
	// 				observer.complete();
	// 				this.#softLoading.set(false);
	// 			}
	// 		});
	// 	});
	// }

	// delete(id: number, route: string) {

	// 	this.#softLoading.set(true);

	// 	return new Observable(observer => {
	// 		this.httpDelete(`${environment.apiUrl+route+'/'+id}`).subscribe({
	// 			next: (res: any) => {
	// 				observer.next(res);
	// 			},
	// 			error: (error: any) => {
	// 				console.log("Error on crudService ", error);
	// 				observer.error(error);
	// 				this.#softLoading.set(false);
	// 			},
	// 			complete: () => {
	// 				this.#softLoading.set(false);
	// 				observer.complete();
	// 			}
	// 		});
	// 	});
	// }

	// batchDelete(ids: number[], model: string) {

	// 	this.#softLoading.set(true);

	// 	return new Observable(observer => {
	// 		this.httpDelete(`${environment.apiUrl+model+'/'+ids}`)
	// 			.subscribe({
	// 				next: (res: any) => {
	// 					observer.next(res);
	// 				},
	// 				error: (error: any) => {
	// 					console.log("Error on crudService ", error);
	// 					observer.error(error);
	// 					this.#softLoading.set(false);
	// 				},
	// 				complete: () => {
	// 					observer.complete();
	// 					this.#softLoading.set(false);
	// 				}
	// 			});
	// 		});

	// }


	// ngOnDestroy() {
	// 	console.log("Destroying crud service")
	// }
}
