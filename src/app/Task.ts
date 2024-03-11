export class Task {
    id: string;
    name: string;
    description: string;
    status: string;
    creationDate: Date;

    constructor(id: string, name: string, description: string, status: string, creationDate: Date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.creationDate = creationDate;
    }

    setStatus(status: string) {
        this.status = status;
    }

    setCreationDate(creationDate: Date) {
        this.creationDate = creationDate;
    }

}