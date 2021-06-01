import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { NewImageDialogComponent } from './new-image-dialog/new-image-dialog.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public currentUser!: User;
  public imagePath: any;
  public imgURL: any;

  constructor(private usersService: UsersService,
    private toastr: ToastrService,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.usersService.getCurrentUser().subscribe((user: User) => {
      this.currentUser = user;

      if (this.currentUser.profileImage) {
        this.imgURL = this.currentUser.profileImage;
      } else {
        this.imgURL = "../../../assets/avatar.png";
      }
    });
  }

  public generateNewApiToken(): void {
    let bsModalRef!: BsModalRef;

    let config = {
      ignoreBackdropClick: true,
      initialState: {
        title: 'Generar nuevo token de acceso',
        message: '¿Desea generar un nuevo token de acceso a la API? Este cambio no será reversible'
      }
    };

    bsModalRef = this.modalService.show(ConfirmDialogComponent, config);

    bsModalRef.content.action.subscribe((value: any) => {
      if (value) {
        this.usersService.generateTokenApi().subscribe((user: User) => {
          this.currentUser = user;
          this.toastr.success("Token generado correctamente");
        });
      }
    });
  }

  public loadNewProfileImage(files: any): void {
    if (files.length === 0) {
      return; // Exit
    }

    let file: File = files[0];
    if (file.type.match(/image\/*/) == null) {
      this.toastr.warning("Solo se permite cargar imagenes. Seleccione otro archivo");
      return; // Exit
    } else if (files[0].size > 1048576) {
      this.toastr.warning("La imagen de perfil no puede ser superior a 1 MB");
      return; // Exit
    }

    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      let bsModalRef!: BsModalRef;
      let config = {
        ignoreBackdropClick: true,
        initialState: {
          title: 'Actualizar imagen de perfil',
          message: '¿Desea guardar esta imagen de perfil?',
          imgURL: reader.result
        }
      };

      bsModalRef = this.modalService.show(NewImageDialogComponent, config);

      bsModalRef.content.action.subscribe((value: any) => {
        if (value) {
          this.imgURL = reader.result;

          this.usersService.updateUserImage(this.imgURL).subscribe((user: User) => {
            this.currentUser = user;
            this.toastr.success("Imagen actualizada correctamente");
          });
        }
      });
    }
  }

}
