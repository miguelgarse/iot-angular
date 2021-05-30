import { Byte } from '@angular/compiler/src/util';
import { Role } from 'src/app/models/Role';

export class User {
    id!: number;
    name!: string;
    lastname!: string;
    username!: string;
    password!: string;
    email!: string;
    roles!: Role[];
    createdUser!: User;
	dateCreated!: Date;
    githubAccount!: string;
	tokenApi!: string;
	profileImage!: Byte[];
    
    constructor(){ }

    public isAdmin(): boolean{
        let isAdmin: boolean = false;

        this.roles.forEach(role => {
            if(role.name == 'ADMIN'){
                isAdmin = true;
            }
        });

        return isAdmin;
    }

}