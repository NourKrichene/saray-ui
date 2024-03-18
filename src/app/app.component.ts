import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from './Task';
import { TaskService } from './task.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskModalComponent } from './add-task-modal/add-task-modal.component';
import { EditTaskModalComponent } from './edit-task-modal/edit-task-modal.component';
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
  loading = true;
  addTaskForm: FormGroup = this.formBuilder.group({
    name: [''],
    description: [''],
    status: ['NOT_DONE']
  });

  constructor(
    protected taskService: TaskService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.loading = false;
      this.tasks = tasks;
      this.divideTasksByStatus();
    });
  }

  editTask(task: Task): void {
    this.taskService.updateTask(task).subscribe(updatedTask => {
      const taskList = this.getTaskListByStatus(updatedTask.status);
      const index = taskList.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        taskList[index] = updatedTask;
      }
    });
  }

  openEditTaskModal(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskModalComponent, {
      height: '380px',
      width: '420px',
      data: task
    });

    dialogRef.componentInstance.taskEdited.subscribe((editedTask: Task) => {
      this.editTask(editedTask);
      dialogRef.close();
    });

    dialogRef.componentInstance.taskArchived.subscribe((editedTask: Task) => {
      this.deleteTask(editedTask, editedTask.status);
      dialogRef.close();
    });
  }

  openAddTaskModal(): void {
    const dialogRef = this.dialog.open(AddTaskModalComponent, {
      height: '360px',
      width: '400px'
    });

    dialogRef.componentInstance.taskAdded.subscribe((task: Task) => {
      this.taskService.addTask(task).subscribe(addedTask => {
        this.tasksToDo.unshift(addedTask);
      });
      dialogRef.close();
    });
  }

  deleteTask(task: Task, status: string): void {
    this.taskService.deleteTask(task).subscribe(() => {
      const taskList = this.getTaskListByStatus(status);
      this.tasks = this.tasks.filter(t => t.id !== task.id);
      taskList.splice(taskList.findIndex(t => t.id === task.id), 1);
    });
  }

  drop(event: CdkDragDrop<Task[]>, status: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      const task = event.container.data[event.currentIndex];
      task.priority = event.currentIndex;
      this.editTask(event.container.data[event.currentIndex]);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      event.container.data[event.currentIndex].status = status;
      const task = event.container.data[event.currentIndex];
      task.priority = event.currentIndex;
      this.editTask(event.container.data[event.currentIndex]);
    }
  }

  filter(event: Event) {
    const filterWord = (event.target as HTMLInputElement).value.toLowerCase();
    this.tasksToDo = this.getTasksByStatus('NOT_DONE').filter(t => t.name.toLowerCase().includes(filterWord));
    this.tasksInProgress = this.getTasksByStatus('IN_PROGRESS').filter(t => t.name.toLowerCase().includes(filterWord));
    this.tasksDone = this.getTasksByStatus('DONE').filter(t => t.name.toLowerCase().includes(filterWord));
  }

  divideTasksByStatus() {
    this.tasksToDo = this.getTasksByStatus('NOT_DONE');
    this.tasksInProgress = this.getTasksByStatus('IN_PROGRESS');
    this.tasksDone = this.getTasksByStatus('DONE');
  }

  getTasksByStatus(status: string) {
    return this.tasks.filter(x => x.status === status);
  }

  getTaskListByStatus(status: string) {
    switch (status) {
      case 'NOT_DONE':
        return this.tasksToDo;
      case 'IN_PROGRESS':
        return this.tasksInProgress;
      case 'DONE':
        return this.tasksDone;
      default:
        return [];
    }
  }
}