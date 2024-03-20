import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Task } from '../Task';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'add-task-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-task-modal.component.html',
  styleUrl: './add-task-modal.component.css'
})
export class AddTaskModalComponent implements OnInit {
  @Output() taskAdded = new EventEmitter<Task>();
  addTaskForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.addTaskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  submit(): void {
    if (this.addTaskForm.valid) {
      this.taskAdded.emit(
        new Task(
          '',
          this.addTaskForm.value.name,
          this.addTaskForm.value.description,
          'NOT_DONE',
          new Date(),
          this.addTaskForm.value.priority
        )
      );
    }

  }

}
