import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private http = inject(HttpClient);

    httpFetch(url: string): Observable<any> {
        return this.http.get(url);
    }

    httpPost(url: string, data: any): Observable<any> {
        return this.http.post(url, data);
    }

    httpPut(url: string, data: any): Observable<any> {
        return this.http.put(url, data);
    }

    httpDelete(url: string): Observable<any> {
        return this.http.delete(url);
    }
}
