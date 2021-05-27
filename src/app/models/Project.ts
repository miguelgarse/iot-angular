import { Sensor } from "./Sensor";
import { User } from "./User";

export class Project {
    id!: number;
    title!: string;
    description!: string;
    keywords!: string;
    location!: string;
    sensors!: Sensor[];
    latitude!: number;
    longitude!: number;
    rating!: number;
    createdUser!: User;
    lastModifieduser!: User;
    dateCreated!: Date;
    dateLastModified!: Date;

    constructor() {
        // Empty constructor
    }

}