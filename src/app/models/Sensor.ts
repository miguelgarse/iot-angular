import { User } from "./User";

export class Sensor {

    id!: number;
    name!: string;
    sensorTypeId!: number;
    createdUser!: User;
    lastModifieduser!: User;
    dateCreated!: Date;
    dateLastModified!: Date;
    latitude!: number;
    longitude!: number;

    constructor(name: string, latitude: number, longitude: number) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }


}