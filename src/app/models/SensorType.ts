import { SensorCategory } from "./SensorCategory";
import { User } from "./User";

export class SensorType {

    id!: number;
    description!: string;
    code!: string;
	category: SensorCategory;
	manufacturer!: string;
	url!: string;
    createdUser!: User;
    lastModifieduser!: User;
    dateCreated!: Date;
    dateLastModified!: Date;

    constructor() { 
       this.category = new SensorCategory(); 
    }

}