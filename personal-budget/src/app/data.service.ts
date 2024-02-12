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

    if (!this.backendData) {
      return this.http.get<any>('http://localhost:3000/budget').pipe(
        tap(data => {
          this.backendData = data;
        })
      );
    } else {
      return of(this.backendData);
    }

  }
}
