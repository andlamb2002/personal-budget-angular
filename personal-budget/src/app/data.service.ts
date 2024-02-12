import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private backendData: any;

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    // Check if backendData is already populated
    if (!this.backendData) {
      // If not populated, make HTTP call to backend
      return this.http.get<any>('http://localhost:3000/budget').pipe(
        tap(data => {
          // Store the data in backendData variable
          this.backendData = data;
        })
      );
    } else {
      // If data already exists, return it as observable
      return of(this.backendData);
    }
  }
}
