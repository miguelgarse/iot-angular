import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router,
    public tokenService: TokenService) { }

  ngOnInit() { }


  logout(): void {
    this.tokenService.logOut();

    this.router.navigateByUrl('', { skipLocationChange: true }); // Volvemos a pagina de login
  }

  redirectRegister(): void {
    this.router.navigateByUrl('register', { skipLocationChange: true });
  }

  isAdmin(): boolean {
    return this.tokenService.isAdmin();
  }

  getUserName(): string {
    return this.tokenService.getUserName();
  }
}
