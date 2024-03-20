import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../Task';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'edit-task-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './edit-task-modal.component.html',
  styleUrl: './edit-task-modal.component.css'
})
export class EditTaskModalComponent implements OnInit {
  @Output() taskEdited = new EventEmitter<Task>();
  @Output() taskArchived = new EventEmitter<Task>();
  editedTask: Task;
  editTaskForm: FormGroup = new FormGroup({});


  constructor(@Inject(MAT_DIALOG_DATA) public task: Task, private formBuilder: FormBuilder) {
    this.editedTask = new Task(task.id, task.name, task.description, task.status, task.creationDate, task.priority);
  }

  ngOnInit(): void {
    this.editTaskForm = this.formBuilder.group({
      name: [this.editedTask.name, Validators.required],
      description: [this.editedTask.description],
    });
  }

  confirmEdit(): void {
    if (this.editTaskForm.valid && this.editTaskForm.dirty) {
      this.taskEdited.emit(
        new Task(
          this.editedTask.id,
          this.editTaskForm.value.name,
          this.editTaskForm.value.description,
          this.editedTask.status,
          this.editedTask.creationDate,
          this.editedTask.priority
        )
      );
    }
  }

  archive(): void {
    this.taskArchived.emit(this.editedTask);
  }

}
