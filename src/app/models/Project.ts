import { Sensor } from "./Sensor";
import { User } from "./User";

export class Project {
    id!: number;
    title!: string;
    description!: string;
    keywords: string[] = [];
    location!: string;
    sensors!: Sensor[];
    urlThingsboard!: string;
    createdUser: User;
    lastModifieduser: User;
    dateCreated!: Date;
    dateLastModified!: Date;

    constructor() {
        this.title = "";
        this.description = "";
        this.location = "";
        this.urlThingsboard = "";
        this.createdUser = new User();
        this.lastModifieduser = new User();
    }

}