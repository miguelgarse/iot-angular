import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { TokenService } from "../services/token.service";

@Injectable()
export class GlobalErrorHandlerService extends ErrorHandler {

    constructor(private router: Router, private tokenService: TokenService, private zone: NgZone) {
        super();
    }

    handleError(error: any): void {

        if (error && error.status === 401 || error.status === 403) {
            // Token expirado => Redirigimos a la pagina de login
            console.info('Expired session. Redirect to login. Error status: ' + error.status, ' Error message: ' + error.message);

            this.tokenService.logOut(); // Limpiamos el local storage

            this.zone.run( () => this.router.navigate(['login']) );
        }

        // Se delega el tratamiento en el manejador de angular porque las trazas de error son más detalladas
        super.handleError(error);
    }

}

export const globalErrorHandlerProvider = [{provide: ErrorHandler, useClass: GlobalErrorHandlerService}];