import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export interface User {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class NameService {
  constructor(private http: HttpClient) {}

  /** Fetches a list of names */
  getNames(): Observable<string[]> {
    return this.http.get('http://jsonplaceholder.typicode.com/users').pipe(map((users: User[]) => {
      return users.filter(user => user.name.trim().length !== 0).map(user => user.name);
    }));
  }
}
