import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from './Task';

@Injectable({
    providedIn: 'root',
})
export class TaskService {
    private apiUrl = 'http://localhost:8081/';

    constructor(private http: HttpClient) { }

    public getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}tasks`).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'Something went wrong.';
                if (error.error instanceof ErrorEvent) {
                    // Client-side error
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    // Server-side error
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
                console.error(errorMessage);
                return throwError(() => error);
            })
        );
    }
}
