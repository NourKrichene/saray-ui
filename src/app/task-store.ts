import { Store, createState } from '@ngneat/elf';
import { Task } from './Task';
import { addEntities, deleteEntities, selectAllEntities, setEntities, updateEntities, withEntities } from '@ngneat/elf-entities';
import { Injectable } from '@angular/core';
import { TaskService } from './task.service';



const { state, config } = createState(
    withEntities<Task>()
);


const store = new Store({ name: 'tasks', state, config });

@Injectable({ providedIn: 'root' })
export class TasksStore {
    constructor(private taskService: TaskService) {
        this.taskService.getTasks().subscribe(tasks => {
            store.update(setEntities(tasks));
        });

    }

    public getTasks() {
        return store.pipe(selectAllEntities());
    }

    public addTask(task: Task) {

        this.taskService.addTask(task).subscribe(taskAdded => {

            store.update(addEntities([taskAdded]));
        }
        );
    }

    public updateTask(task: Task) {
        this.taskService.updateTask(task).subscribe(taskUpdated => {
            store.update(updateEntities(taskUpdated.id, taskUpdated));
        });

    }

    public deleteTask(task: Task) {
        this.taskService.deleteTask(task).subscribe(() => {
            store.update(deleteEntities([task.id]));
        });
    }
}