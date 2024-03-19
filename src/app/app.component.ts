import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from './Task';
import { TaskService } from './task.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskModalComponent } from './add-task-modal/add-task-modal.component';
import { EditTaskModalComponent } from './edit-task-modal/edit-task-modal.component';
import {
  DragDropModule,
  CdkDragDrop,
  CdkDropList
} from '@angular/cdk/drag-drop';
import { TasksStore } from './task.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DragDropModule, CdkDropList, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TaskService]
})
export class AppComponent implements OnInit {
  tasksToDo: Task[] = [];
  tasksInProgress: Task[] = [];
  tasksDone: Task[] = [];
  loading = true;

  constructor(
    private dialog: MatDialog,
    private tasksStore: TasksStore,
  ) { }

  ngOnInit() {
    this.getTasks();
  }

  getTasks(): void {
    this.tasksStore.getTasks().subscribe(({ toDo, inProgress, done }) => {
      this.tasksToDo = toDo;
      this.tasksInProgress = inProgress;
      this.tasksDone = done;
      this.loading = false;
    });

  }

  openEditTaskModal(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskModalComponent, {
      height: '380px',
      width: '420px',
      data: task
    });

    dialogRef.componentInstance.taskEdited.subscribe((editedTask: Task) => {
      this.tasksStore.updateTask(editedTask);
      dialogRef.close();
    });

    dialogRef.componentInstance.taskArchived.subscribe((editedTask: Task) => {
      this.tasksStore.deleteTask(editedTask);
      dialogRef.close();
    });
  }

  openAddTaskModal(): void {
    const dialogRef = this.dialog.open(AddTaskModalComponent, {
      height: '360px',
      width: '400px'
    });

    dialogRef.componentInstance.taskAdded.subscribe((task: Task) => {
      this.tasksStore.addTask(task, this.tasksToDo.length);
      dialogRef.close();
    });
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      const task = event.container.data[event.previousIndex];
      task.priority = event.currentIndex;
      this.tasksStore.updateTaskPriority(task, event.previousIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const previousStatus = task.status;
      const newContainerLength = event.container.data.length;
      task.status = newStatus;
      task.priority = event.currentIndex;
      this.tasksStore.updateTaskPriorityAndStatus(task, previousStatus, newContainerLength);
    }
  }

  filter(event: Event) {
    const filterWord = (event.target as HTMLInputElement).value.toLowerCase();
    this.tasksToDo = this.tasksToDo.filter(x => x.status === 'NOT_DONE' && x.name.toLowerCase().includes(filterWord));
    this.tasksInProgress = this.tasksInProgress.filter(x => x.status === 'IN_PROGRESS' && x.name.toLowerCase().includes(filterWord));
    this.tasksDone = this.tasksDone.filter(x => x.status === 'DONE' && x.name.toLowerCase().includes(filterWord));
  }

}