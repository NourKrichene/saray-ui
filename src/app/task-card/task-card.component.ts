import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../Task';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  @Input() task: any;
  @Output() editTask = new EventEmitter<Task>();

  constructor() { }

  openEditTaskModal(task: Task): void {
    this.editTask.emit(task);
  }
}
