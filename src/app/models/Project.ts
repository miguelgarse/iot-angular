import { SensorValue } from "./SensorValue";
import { User } from "./User";

export class Project {
    id!: number;
    title!: string;
    description!: string;
    keywords!: string;
    location!: string;
    sensorValues!: SensorValue[];
    createdUser!: User;
    lastModifieduser!: User;
    dateCreated!: Date;
    dateLastModified!: Date;

    constructor() {
        // Empty constructor
    }

}