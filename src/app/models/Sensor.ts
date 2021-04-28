import { User } from "./User";

export class Sensor {

    id!: number;
    name!: string;
    sensorTypeId!: string;
    createdUser!: User;
    lastModifieduser!: User;
    dateCreated!: Date;
    dateLastModified!: Date;

    constructor() { }

}