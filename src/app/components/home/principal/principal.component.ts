import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login(): void{
    this.router.navigateByUrl('login', { skipLocationChange: true }); // Volvemos a pagina de login
  }

}
