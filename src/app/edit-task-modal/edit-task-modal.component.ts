import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../Task';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'edit-task-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-task-modal.component.html',
  styleUrl: './edit-task-modal.component.css'
})
export class EditTaskModalComponent {
  @Output() taskEdited = new EventEmitter<Task>();
  editedTask: Task;

  constructor(@Inject(MAT_DIALOG_DATA) public task: Task) {
    this.editedTask = { ...task }; // Copy task object to editedTask
  }

  submit(): void {
    this.taskEdited.emit(this.editedTask);
  }

}
