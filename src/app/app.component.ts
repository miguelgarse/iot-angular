import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'iot-angular';

  constructor(private router: Router) {

    // Evita que aparezca la url al acceder a la pagina inicial
    this.router.events.subscribe(routerEvent => {
        if (routerEvent instanceof NavigationStart) {
            if (routerEvent.url == "/") {
                this.router.navigate(["login"], {skipLocationChange: true})
            }
        }
    });
}
}
