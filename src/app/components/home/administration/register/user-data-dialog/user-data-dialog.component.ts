import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/models/Role';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';
import { HttpStatusCodes } from 'src/app/utils/http-status-codes';

@Component({
  selector: 'app-user-data-dialog',
  templateUrl: './user-data-dialog.component.html',
  styleUrls: ['./user-data-dialog.component.css']
})
export class UserDataDialogComponent implements OnInit {

  public title!: string;
  public user: User = new User();

  public imgURL!: string;

  @Output() action = new EventEmitter();

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private usersService: UsersService) { }

  ngOnInit(): void {
    if(!this.user.id){
      // Estamos en creación
      this.user.roles = [];
      let defaultRole: Role = new Role;
    } else {
      if (this.user.profileImage) {
        this.imgURL = this.user.profileImage;
      } else {
        this.imgURL = "../../../../../assets/avatar.png";
      }
    }
  }

  confirm(): void {
    if (this.user.username && this.user.username.length > 0
      && this.user.email && this.user.email.length > 0
      && this.user.password && this.user.password.length > 0) {


        this.action.emit(this.user);
        this.bsModalRef.hide();
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
 
  decline(): void {
    this.action.emit(false);
    this.bsModalRef.hide();
  }

  /**
   * Permite comporbar si un nombre de usuario ya existe en la base de datos.
   */
   public existsUsername(): boolean {
    let exists: boolean = false;

    this.usersService.checkUsername(this.user.username).subscribe(response => {
      if (response.status == HttpStatusCodes.OK) { // Usuario ya existe
        console.log("Usuario ya existe");
        this.toastr.warning("El usuario " + this.user.username + " ya existe");
        exists = true;
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

    return exists;
  }

  public autocompleteFields(): void {
    if((!this.user || !this.user.id)
        && this.user.name && this.user.lastname){
      // Estamos en creacion => Ejecutamos la ayuda
      let date: Date = new Date();

      let autousername: string = this.user.name.trim()
                                    .toLowerCase()
                                    .slice(0, 1)
                                    .concat(this.user.lastname.trim()
                                                  .toLowerCase()
                                                  .split(" ")[0])
                                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
      this.user.username = autousername;
      this.user.password = autousername + date.getFullYear() + "%";
    }
  }

}
