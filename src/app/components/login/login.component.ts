import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Jwt } from 'src/app/models/Jwt';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup  = this.fb.group({
    usuario: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private router: Router,
    private usersService: UsersService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService) {

  }

  ngOnInit( ) { 
    if(this.tokenService.getToken()){
      this.router.navigateByUrl('home', { skipLocationChange: true });
    }
  }

  login() {
    let username: string = this.loginForm.controls.usuario.value;
    let password: string = this.loginForm.controls.password.value;

    this.usersService.login(username, password).subscribe((jwt: Jwt) => {
      this.tokenService.setToken(jwt.token);
      this.tokenService.setUserName(jwt.username);
      this.tokenService.setAuthorities(jwt.authorities);

      if(!jwt.dateLastLogin){
        // Usuario que nunca ha accedido
        this.openSetPasswordDialog();
      } else {
        this.router.navigateByUrl('home', { skipLocationChange: true });
      }

    }, error => {
      this.toastr.error("Usuario o contraseña incorrecto");
    });
  }

  openSetPasswordDialog(): void {
    let bsModalRef!: BsModalRef;

    let config = {
      ignoreBackdropClick: true,
      class: 'modal-md',
      initialState: {
        title: 'Cambiar contraseña'
      }
    };

    bsModalRef = this.modalService.show(ChangePasswordDialogComponent, config);

    bsModalRef.content.action.subscribe((password: string) => {
      if (password) {
        this.usersService.updatePassword(password).subscribe(response => {
          this.router.navigateByUrl('home', { skipLocationChange: true });
          this.toastr.success("Contraseña guardada correctamente");
        }, (error: any) => {
         throw error;
        });
      }
    });
  }

}
