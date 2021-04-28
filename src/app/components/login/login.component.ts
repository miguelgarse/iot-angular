import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Jwt } from 'src/app/models/Jwt';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';

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
    private userService: UsersService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private toastr: ToastrService) {

  }

  ngOnInit( ) { 
    if(this.tokenService.getToken()){
      this.router.navigateByUrl('home', { skipLocationChange: true });
    }
  }

  login() {
    let username: string = this.loginForm.controls.usuario.value;
    let password: string = this.loginForm.controls.password.value;

    this.userService.login(username, password).subscribe((jwt: Jwt) => {
      this.tokenService.setToken(jwt.token);
      this.tokenService.setUserName(jwt.username);
      this.tokenService.setAuthorities(jwt.authorities);

      this.router.navigateByUrl('home', { skipLocationChange: true });
    }, error => {
      this.toastr.error("Usuario o contraseña incorrecto");
    });
  }
}
