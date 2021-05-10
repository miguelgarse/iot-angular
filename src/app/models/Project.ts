import { Sensor } from "./Sensor";
import { User } from "./User";

export class Project {
    id!: number;
    title!: string;
    description!: string;
    keywords!: string;
    location!: string;
    sensors!: Sensor[];
    createdUser!: User;
    lastModifieduser!: User;
    dateCreated!: Date;
    dateLastModified!: Date;

    constructor() {
        // Empty constructor
    }

}