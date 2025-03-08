import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

interface User {
  id: number;
  name: string;
  email: string;
  // ... otros campos
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService {
  private endpoint = 'users';

  getUsers(): Observable<User[]> {
    return this.get<User[]>(this.endpoint);
  }

  getUser(id: number): Observable<User> {
    return this.get<User>(`${this.endpoint}/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.post<User>(this.endpoint, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.put<User>(`${this.endpoint}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
} 