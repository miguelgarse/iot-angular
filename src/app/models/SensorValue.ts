import { Sensor } from './Sensor';
import { User } from './User';

export class SensorValue {
    id!: string;
    value!: number;
    timestamp!: Date;
    createdUser!: User;
    lastModifieduser!: User;
    dateCreated!: Date;
    dateLastModified!: Date;

    constructor() {
        // Empty constructor
    }

}