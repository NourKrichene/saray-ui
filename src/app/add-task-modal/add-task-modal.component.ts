import { Component, Output, EventEmitter } from '@angular/core';
import { Task } from '../Task';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'add-task-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task-modal.component.html',
  styleUrl: './add-task-modal.component.css'
})
export class AddTaskModalComponent {
  @Output() taskAdded = new EventEmitter<Task>();
  task: Task = new Task();


  submit(): void {
    this.taskAdded.emit(this.task);
  }

}
