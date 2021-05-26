import { User } from "./User";

export class SensorType {

    id!: number;
    description!: string;
    code!: string;
	type!: string;
	manufacturer!: string;
	url!: string;
    createdUser!: User;
    lastModifieduser!: User;
    dateCreated!: Date;
    dateLastModified!: Date;

    constructor() { }

}