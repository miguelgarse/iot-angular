import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';
import { HttpStatusCodes } from 'src/app/utils/http-status-codes';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  public user: User = new User();
  public repeatedPassword: string = "";
  public usersList: User[] = [];

  constructor(private usersService: UsersService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getUserList();
  }

  public register(): void {
    if (this.user.username && this.user.username.length > 0
      && this.user.email && this.user.email.length > 0
      && this.user.password && this.user.password.length > 0) {

      this.usersService.registerUser(this.user).subscribe(response => {

        switch (response.status) {
          case HttpStatusCodes.CREATED:
            console.log("Usuario creado correctamente: " + this.user.username);
            this.toastr.success("Usuario registrado correctamente: " + this.user.username);
            this.getUserList(); // Refrescar tabla de usuarios
            break;
        }

      }, (error: any) => {
        switch (error.status) {
          case HttpStatusCodes.BAD_REQUEST:
            this.toastr.error("No se ha enviado el usuario, el correo o la contraseña");
            break;
          case HttpStatusCodes.CONFLICT:
            this.toastr.error("Nombre de usuario duplicado");
            break;
          case HttpStatusCodes.INTERNAL_SERVER_ERROR:
            this.toastr.error("Error interno del servidor");
            break;
        }
      });
    } else {
      if (!this.user.username || this.user.username.length < 1) {
        this.toastr.error("Debe introducir un usuario");
      }
      if (!this.user.email || this.user.email.length < 1) {
        this.toastr.error("Debe introducir un correo");
      }
      if (!this.user.password || this.user.password.length < 1) {
        this.toastr.error("Debe introducir una contraseña");
      }
    }
  }

  /**
   * Permite comporbar si un nombre de usuario ya existe en la base de datos.
   */
  public checkExistingUsername() {
    this.usersService.checkUsername(this.user.username).subscribe(response => {

     if (response.status == HttpStatusCodes.OK) { // Usuario ya existe
        console.log("Usuario ya existe");
        this.toastr.warning("El usuario " + this.user.username + " ya existe");
      }

    }, (error: any) => {
      if (error.status == HttpStatusCodes.NOT_FOUND) { // Usuario no existe
        console.log("Usuario no existe");
        this.toastr.info("El usuario " + this.user.username + " está disponible");
      } else if (error.status == HttpStatusCodes.INTERNAL_SERVER_ERROR) {
        console.log("Error en el servidor");
        this.toastr.error("Error al comporbar existencia del usuario " + this.user.username);
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

}
