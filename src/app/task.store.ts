import { createStore, emitOnce } from '@ngneat/elf';
import { Task } from './Task';
import { EntitiesRef, addEntities, deleteEntities, entitiesPropsFactory, moveEntity, selectAllEntities, setEntities, updateEntities } from '@ngneat/elf-entities';
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

    public addTask(task: Task, previousIndex: number) {
        this.taskService.addTask(task).subscribe(taskAdded => {
            emitOnce(() => {
                store.update(addEntities([taskAdded], { ref: toDoEntitiesRef }));
                store.update(moveEntity({ fromIndex: previousIndex, toIndex: 0, ref: toDoEntitiesRef }));
            });
        }
        );
    }


    public updateTaskPriority(task: Task, previousPriority: number) {
        if (previousPriority != task.priority) {
            store.update(moveEntity({ fromIndex: previousPriority, toIndex: task.priority, ref: toDoEntitiesRef }));
        }
        this.taskService.updateTask(task).subscribe(taskUpdated => {
        });
    }

    public updateTaskPriorityAndStatus(task: Task, previousStatus: string, newContainerLength: number) {
        emitOnce(() => {
            store.update(deleteEntities([task.id], { ref: this.getRefFromStatus(previousStatus) }));
            store.update(addEntities([task], { ref: this.getRefFromStatus(task.status) }));
            store.update(moveEntity({ fromIndex: newContainerLength, toIndex: task.priority, ref: this.getRefFromStatus(task.status) }));
        });
        this.taskService.updateTask(task).subscribe();
    }

    public updateTask(task: Task) {
        store.update(updateEntities(task.id, task, { ref: this.getRefFromStatus(task.status) }));
        this.taskService.updateTask(task).subscribe();
    }

    public deleteTask(task: Task) {
        store.update(deleteEntities([task.id], { ref: this.getRefFromStatus(task.status) }));
        this.taskService.deleteTask(task).subscribe();
    }

    private getRefFromStatus(status: string): EntitiesRef {
        switch (status) {
            case 'NOT_DONE':
                return toDoEntitiesRef;
            case 'IN_PROGRESS':
                return inProgressEntitiesRef;
            case 'DONE':
                return doneEntitiesRef;
            default:
                throw new Error(`Invalid status: ${status}`);
        }
    }

    private getTasksByStatus(tasks: Task[], status: string) {
        return tasks.filter(x => x.status === status);
    }
}