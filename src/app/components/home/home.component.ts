import { Component, HostListener } from '@angular/core';
import { Router, } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service'
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public verticalOffset: number = 0;

  constructor(private router: Router,
    private service: UploadService,
    public tokenService: TokenService) {
      // Empty constructor
  }

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

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll($event: Event) {
    this.verticalOffset = window.pageYOffset 
          || document.documentElement.scrollTop 
          || document.body.scrollTop || 0;
  }

}
