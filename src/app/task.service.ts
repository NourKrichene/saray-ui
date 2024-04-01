import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from './Task';
import { environment } from '../environments/environment';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
    providedIn: 'root',
})
export class TaskService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private readonly keycloakService: KeycloakService) { }

    public getTasks(): Observable<Task[]> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.keycloakService.getKeycloakInstance().token}` })
        return this.http.get<Task[]>(`${this.apiUrl}`, { headers }).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage;
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

    public addTask(task: Task): Observable<Task> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.keycloakService.getKeycloakInstance().token}` })
        return this.http.post<Task>(`${this.apiUrl}`, task, { headers }).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage;
                if (error.error instanceof ErrorEvent) {
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
                console.error(errorMessage);
                return throwError(() => error);
            })
        );
    }


    public updateTask(task: Task): Observable<Task> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.keycloakService.getKeycloakInstance().token}` })
        return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task, { headers }).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage;
                if (error.error instanceof ErrorEvent) {
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
                console.error(errorMessage);
                return throwError(() => error);
            })
        );
    }

    public deleteTask(task: Task): Observable<Task> {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.keycloakService.getKeycloakInstance().token}` })
        return this.http.delete<Task>(`${this.apiUrl}/${task.id}`, { headers }).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage;
                if (error.error instanceof ErrorEvent) {
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
                console.error(errorMessage);
                return throwError(() => error);
            })
        );
    }
}