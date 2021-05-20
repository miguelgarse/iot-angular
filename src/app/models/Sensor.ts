import { SensorValue } from "./SensorValue";
import { User } from "./User";

export class Sensor {

    id!: number;
    name!: string;
    sensorTypeId!: number;
    sensorValues!: SensorValue[];
    createdUser!: User;
    lastModifieduser!: User;
    dateCreated!: Date;
    dateLastModified!: Date;

    constructor() {
        // Empty constructor
    }


}