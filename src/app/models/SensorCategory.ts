import { User } from "./User";

export class SensorCategory {

    id!: number;
    category!: string;
    description!: string;
    createdUser!: User;
    lastModifieduser!: User;
    dateCreated!: Date;
    dateLastModified!: Date;

    constructor() { }

}