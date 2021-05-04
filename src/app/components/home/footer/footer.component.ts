import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  
  public verticalOffset: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll($event: Event) {
    console.info("Vertical: " + this.verticalOffset);

    this.verticalOffset = window.pageYOffset 
          || document.documentElement.scrollTop 
          || document.body.scrollTop || 0;
  }


    /**
   * Permite hacer scroll a la parte de arriba de la pagina en la que se encuentra.
   */
     goToTheTop(): void {
      window.scroll(0, 0);
    }

}
