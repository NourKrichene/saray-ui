import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../Task';

@Component({
  selector: 'app-task-line',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-line.component.html',
  styleUrl: './task-line.component.css'
})
export class TaskLineComponent {
  @Input() task: Task;
  @Output() editTask = new EventEmitter<Task>();

  constructor() { }
  openEditTaskModal(task: Task): void {
    this.editTask.emit(task);
  }

  notOpenEditTaskModal() { }
}