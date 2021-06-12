import { Sensor } from "./Sensor";
import { User } from "./User";

export class Project {
    id!: number;
    title!: string;
    description!: string;
    keywords: string[] = [];
    location!: string;
    sensors!: Sensor[];
    dashboardIot!: string;
    collaborationPlatorm!: string;
    createdUser: User;
    lastModifieduser: User;
    dateCreated!: Date;
    dateLastModified!: Date;

    constructor() {
        this.title = "";
        this.description = "";
        this.location = "";
        this.dashboardIot = "";
        this.createdUser = new User();
        this.lastModifieduser = new User();
    }

}