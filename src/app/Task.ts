export class Task {
    id: string;
    name: string;
    description: string;
    status: string;
    creationDate: Date;
    priority: number;

    constructor(id: string, name: string, description: string, status: string, creationDate: Date, priority: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.creationDate = creationDate;
        this.priority = priority;
    }

    setStatus(status: string) {
        this.status = status;
    }

    setCreationDate(creationDate: Date) {
        this.creationDate = creationDate;
    }

    setPriority(priority: number) {
        this.priority = priority;
    }

}