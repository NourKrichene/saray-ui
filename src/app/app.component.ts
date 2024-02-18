import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Task } from './Task';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  tasks: Task[] = [];
  addTaskForm!: FormGroup;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getTasks();
    this.addTaskForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      status: new FormControl('NOT_DONE')
    });
  }

  getTasks(): void {
    this.http.get<Task[]>('http://localhost:8081/tasks')
      .subscribe(tasks => this.tasks = tasks);
  }

  addTask(): void {
    const task: Task = this.addTaskForm.value;
    task.creationDate = new Date();
    console.log(task);
    this.http.post<Task>('http://localhost:8081/task', task)
      .subscribe(task => {
        this.tasks.push(task);
        this.addTaskForm.reset();
      });
  }

  deleteTask(task: Task): void {
    this.http.delete<Task>('http://localhost:8081/task/' + task.id)
      .subscribe(() => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
      });
  }
}
