import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Task } from './Task';
import { TaskService } from './task.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, ReactiveFormsModule, DragDropModule, CdkDropList, CdkDrag, CdkDropListGroup],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TaskService]
})

export class AppComponent implements OnInit {
  tasks: Task[] = [];
  tasksToDo: Task[] = [];
  tasksInProgress: Task[] = [];
  tasksDone: Task[] = [];
  addTaskForm!: FormGroup;

  constructor(private http: HttpClient, protected taskService: TaskService) {
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
    this.taskService.getTasks()
      .subscribe(tasks => {
        this.tasks = tasks;
        this.divideTasksByStatus();
      }
      );
  }

  private divideTasksByStatus() {
    this.tasksToDo = this.getTasksByStatus('NOT_DONE');
    this.tasksInProgress = this.getTasksByStatus('IN_PROGRESS');
    this.tasksDone = this.getTasksByStatus('DONE');
  }

  addTask(): void {
    const task: Task = this.addTaskForm.value;
    task.creationDate = new Date();
    this.http.post<Task>('http://localhost:8081/task', task)
      .subscribe(task => {
        this.tasks.push(task);
        this.addTaskForm.reset();
      });
  }

  deleteTask(task: Task, status: string): void {
    this.http.delete<Task>('http://localhost:8081/task/' + task.id)
      .subscribe(() => {

        switch (status) {
          case 'NOT_DONE':
            this.tasksToDo = this.tasksToDo.filter(t => t.id !== task.id);
            break;
          case 'IN_PROGRESS':
            this.tasksInProgress = this.tasksInProgress.filter(t => t.id !== task.id);
            break;
          case 'DONE':
            this.tasksDone = this.tasksDone.filter(t => t.id !== task.id);
            break;
          default:
            console.log(`Sorry, we are out of ${status}.`);
        }

        this.tasks = this.tasks.filter(t => t.id !== task.id);
      });
  }

  getTasksByStatus(status: string) {
    return this.tasks.filter(x => x.status == status);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
