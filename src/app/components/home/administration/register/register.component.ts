import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { UserDataDialogComponent } from './user-data-dialog/user-data-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  public usersList: User[] = [];

  constructor(private usersService: UsersService,
    private toastr: ToastrService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.getUserList();
  }

  public createUser(): void {
    let bsModalRef!: BsModalRef;

    let config = {
      ignoreBackdropClick: true,
      class: 'modal-xl',
      initialState: {
        title: 'Crear nuevo usuario'
      }
    };

    bsModalRef = this.modalService.show(UserDataDialogComponent, config);

    bsModalRef.content.action.subscribe((user: User) => {
      if (user) {
        this.usersService.registerUser(user).subscribe((createdUser: User) => {
          this.toastr.success("Usuario registrado correctamente: " + user.username);
          this.getUserList(); // Refrescar tabla de usuarios
        }, (error: any) => {
          if(error.error && error.error.message){
            this.toastr.error(error.error.message);
          } else{
            throw error;
          }
        });
      }
    });
  }

  public getUserList(): void {
    this.usersService.getAllUsers().subscribe((users: User[]) => {
      this.usersList = users;
    }, error => {
      console.error('Error getting all users');
    });
  }

  public editUser(user: User): void{
    let bsModalRef!: BsModalRef;

    this.usersService.getUserById(user.id).subscribe((user: User) => {
      let config = {
        ignoreBackdropClick: true,
        class: 'modal-xl',
        initialState: {
          title: 'Editar usuario ' + user.username,
          user: user
        }
      };
  
      bsModalRef = this.modalService.show(UserDataDialogComponent, config);
  
      bsModalRef.content.action.subscribe((user: User) => {
        if (user) {
          this.usersService.registerUser(user).subscribe(response => {
            this.toastr.success("Usuario actualizado correctamente: " + user.username);
            this.getUserList(); // Refrescar tabla de usuarios
          }, (error: any) => {
           throw error;
          });
        }
      });

      this.getUserList();
    }, error => {
      this.toastr.success("Error al recuperar los datos del usuario");
      throw error;
    });
  }

  public deleteUser(user: User): void{
    let bsModalRef!: BsModalRef;

    let config = {
      ignoreBackdropClick: true,
      initialState: {
        title: 'Borrar usuario',
        message: '¿Desea borrar el usuario ' + user.username + '?'
      }
    };

    bsModalRef = this.modalService.show(ConfirmDialogComponent, config);

    bsModalRef.content.action.subscribe((value: any) => {
      if (value) {
        this.usersService.deleteUserById(user.id).subscribe((user: User) => {
          if(user && user.id){
            this.toastr.success("El usuario " + user.username + " ha sido borrado");
            this.getUserList();
          }
        }, error => {
          throw error;
        });
      }
    });
  }

}
