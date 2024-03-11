import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from './Task';
import { TaskService } from './task.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskModalComponent } from './add-task-modal/add-task-modal.component';
import { EditTaskModalComponent, } from './edit-task-modal/edit-task-modal.component';
import { DeleteTaskModalComponent } from './delete-task-modal/delete-task-modal.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DragDropModule, CdkDropList, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TaskService]
})

export class AppComponent implements OnInit {
  tasks: Task[] = [];
  tasksToDo: Task[] = [];
  tasksInProgress: Task[] = [];
  tasksDone: Task[] = [];
  addTaskForm: FormGroup = this.formBuilder.group({
    name: [''],
    description: [''],
    status: ['NOT_DONE']
  });
  loading = signal(true);
  constructor(
    private http: HttpClient,
    protected taskService: TaskService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.getTasks();
  }

  isLoading() {
    return this.loading();
  }

  getTasks(): void {
    this.taskService.getTasks()
      .subscribe(tasks => {
        this.loading.set(false);
        this.tasks = tasks;
        this.divideTasksByStatus();
      }
      );
  }

  filter(event: Event) {
    let filterWord = (event.target as HTMLInputElement).value.toLowerCase();
    this.tasksToDo = this.getTasksByStatus('NOT_DONE').filter(t => t.name.toLowerCase().includes(filterWord));
    this.tasksInProgress = this.getTasksByStatus('IN_PROGRESS').filter(t => t.name.toLowerCase().includes(filterWord));
    this.tasksDone = this.getTasksByStatus('DONE').filter(t => t.name.toLowerCase().includes(filterWord));
  }

  private divideTasksByStatus() {
    this.tasksToDo = this.getTasksByStatus('NOT_DONE');
    this.tasksInProgress = this.getTasksByStatus('IN_PROGRESS');
    this.tasksDone = this.getTasksByStatus('DONE');
  }

  addTask(): void {
    const task: Task = this.addTaskForm.value;
    task.setCreationDate(new Date());
    this.http.post<Task>('http://localhost:8081/tasks', task)
      .subscribe(task => {
        this.tasks.push(task);
        this.addTaskForm.reset();
      });
  }

  editTask(task: Task): void {
    this.http.put<Task>('http://localhost:8081/tasks/' + task.id, task)
      .subscribe((task) => {

        switch (task.status) {
          case 'NOT_DONE':
            this.tasksToDo[this.tasksToDo.findIndex(t => t.id === task.id)] = task;
            break;
          case 'IN_PROGRESS':
            this.tasksInProgress[this.tasksInProgress.findIndex(t => t.id === task.id)] = task;
            break;
          case 'DONE':
            this.tasksDone[this.tasksDone.findIndex(t => t.id === task.id)] = task;
            break;
          default:
            console.log(`Sorry, we are out of ${task.status}.`);
        }

      }

      );

  }

  deleteTask(task: Task, status: string): void {
    const dialogRef = this.dialog.open(DeleteTaskModalComponent, {
      height: '200px',
      width: '300px'
    });

    dialogRef.componentInstance.confirmDelete.subscribe((confirmDelete: boolean) => {
      if (confirmDelete) {
        this.http.delete<Task>('http://localhost:8081/tasks/' + task.id)
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
      dialogRef.close();

    });

  }

  getTasksByStatus(status: string) {
    return this.tasks.filter(x => x.status == status);
  }

  openEditTaskModal(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskModalComponent, {
      height: '360px',
      width: '400px',
      data: task
    });

    dialogRef.componentInstance.taskEdited.subscribe((editedTask: Task) => {
      this.editTask(editedTask);
      dialogRef.close();
    });
  }


  openAddTaskModal(): void {
    const dialogRef = this.dialog.open(AddTaskModalComponent, {
      height: '360px',
      width: '400px'
    });

    dialogRef.componentInstance.taskAdded.subscribe((task: Task) => {
      this.http.post<Task>('http://localhost:8081/tasks', task)
        .subscribe(task => {
          this.tasksToDo.unshift(task);
        });
      dialogRef.close();
    });
  }

  drop(event: CdkDragDrop<Task[]>, status: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      event.container.data[event.currentIndex].status = status;
      this.editTask(event.container.data[event.currentIndex]);
    }
  }
}
