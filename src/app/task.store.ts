import { createStore } from '@ngneat/elf';
import { Task } from './Task';
import { addEntities, deleteEntities, entitiesPropsFactory, selectAllEntities, setEntities, updateEntities } from '@ngneat/elf-entities';
import { Injectable } from '@angular/core';
import { TaskService } from './task.service';


const { toDoEntitiesRef, withToDoEntities } = entitiesPropsFactory('toDo');
const { inProgressEntitiesRef, withInProgressEntities } = entitiesPropsFactory('inProgress');
const { doneEntitiesRef, withDoneEntities } = entitiesPropsFactory('done');

const store = createStore(
    { name: 'tasks' },
    withToDoEntities<Task>(),
    withInProgressEntities<Task>(),
    withDoneEntities<Task>()
);


@Injectable({ providedIn: 'root' })
export class TasksStore {
    constructor(private taskService: TaskService) {
        this.taskService.getTasks().subscribe(tasks => {
            store.update(setEntities(this.getTasksByStatus(tasks, 'NOT_DONE'), { ref: toDoEntitiesRef }),
                setEntities(this.getTasksByStatus(tasks, 'IN_PROGRESS'), { ref: inProgressEntitiesRef }),
                setEntities(this.getTasksByStatus(tasks, 'DONE'), { ref: doneEntitiesRef }));
        });

    }

    public getTasks() {
        return store.combine({
            toDo: store.pipe(selectAllEntities({ ref: toDoEntitiesRef })),
            inProgress: store.pipe(selectAllEntities({ ref: inProgressEntitiesRef })),
            done: store.pipe(selectAllEntities({ ref: doneEntitiesRef }))
        });
    }



    public addTask(task: Task) {
        this.taskService.addTask(task).subscribe(taskAdded => {
            store.update(addEntities([taskAdded], { ref: toDoEntitiesRef }));
        }
        );
    }

    public updateTask(task: Task, previousPriority: number, previousStatus: string) {
        this.taskService.updateTask(task).subscribe(taskUpdated => {
            if (previousPriority != task.priority || previousStatus != task.status) {

                if (previousStatus == taskUpdated.status) {
                    if (taskUpdated.status === 'NOT_DONE')
                        store.update(updateEntities(taskUpdated.id, taskUpdated, { ref: toDoEntitiesRef }));
                    else if (taskUpdated.status === 'IN_PROGRESS')
                        store.update(updateEntities(taskUpdated.id, taskUpdated, { ref: inProgressEntitiesRef }));
                    else if (taskUpdated.status === 'DONE')
                        store.update(updateEntities(taskUpdated.id, taskUpdated, { ref: doneEntitiesRef }));
                }
                else {
                    if (previousStatus === 'NOT_DONE')
                        store.update(deleteEntities([taskUpdated.id], { ref: toDoEntitiesRef }));
                    else if (previousStatus === 'IN_PROGRESS')
                        store.update(deleteEntities([taskUpdated.id], { ref: inProgressEntitiesRef }));
                    else if (previousStatus === 'DONE')
                        store.update(deleteEntities([taskUpdated.id], { ref: doneEntitiesRef }));

                    if (taskUpdated.status == 'NOT_DONE')
                        store.update(addEntities([taskUpdated], { ref: toDoEntitiesRef }));
                    else if (taskUpdated.status == 'IN_PROGRESS')
                        store.update(addEntities([taskUpdated], { ref: inProgressEntitiesRef }));
                    else if (taskUpdated.status == 'DONE')
                        store.update(addEntities([taskUpdated], { ref: doneEntitiesRef }));
                }
            }
            else {
                if (task.status === 'NOT_DONE')
                    store.update(updateEntities(taskUpdated.id, taskUpdated, { ref: toDoEntitiesRef }));
                else if (task.status === 'IN_PROGRESS')
                    store.update(updateEntities(taskUpdated.id, taskUpdated, { ref: inProgressEntitiesRef }));
                else if (task.status === 'DONE')
                    store.update(updateEntities(taskUpdated.id, taskUpdated, { ref: doneEntitiesRef }));
            }
        });
    }



    public deleteTask(task: Task) {
        this.taskService.deleteTask(task).subscribe(() => {
            if (task.status === 'NOT_DONE')
                store.update(deleteEntities([task.id], { ref: toDoEntitiesRef }));
            else if (task.status === 'IN_PROGRESS')
                store.update(deleteEntities([task.id], { ref: inProgressEntitiesRef }));
            else if (task.status === 'DONE')
                store.update(deleteEntities([task.id], { ref: doneEntitiesRef }));
        });
    }


    getTasksByStatus(tasks: Task[], status: string) {
        return tasks.filter(x => x.status === status);
    }
}