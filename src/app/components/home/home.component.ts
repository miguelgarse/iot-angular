import { Component } from '@angular/core';
import { Router, } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router,
    public tokenService: TokenService) {
      // Empty constructor
  }

  ngOnInit() { }

  logout(): void {
    this.tokenService.logOut();

    this.router.navigateByUrl('', { skipLocationChange: true }); // Volvemos a pagina de login
  }

  redirectRegister(): void {
    this.router.navigateByUrl('admin-users', { skipLocationChange: true });
  }

  isAdmin(): boolean {
    return this.tokenService.isAdmin();
  }

  getUserName(): string {
    return this.tokenService.getUserName();
  }

}
