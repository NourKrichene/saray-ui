import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete-task-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-task-modal.component.html',
  styleUrl: './delete-task-modal.component.css'
})
export class DeleteTaskModalComponent {
  @Output() confirmDelete = new EventEmitter<boolean>();


  confirm(): void {
    this.confirmDelete.emit(true);
  }

  cancel(): void {
    this.confirmDelete.emit(false);
  }

}
