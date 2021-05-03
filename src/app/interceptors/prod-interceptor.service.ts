import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ProdInterceptorService implements HttpInterceptor{

  public requestCounter = 0;  // Contador de peticiones 

  constructor(private tokenService: TokenService, private spinner: NgxSpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let intReq = req;
    this.requestCounter++;

    this.spinner.show(); 
    
    const token = this.tokenService.getToken();

    if(token){
      intReq = req.clone({headers: req.headers.set('Authorization', 'Bearer '+token)});
    }

    return next.handle(intReq).pipe(
      // retry(1),
      tap (), finalize(() => {
        this.requestCounter--;
        if ( this.requestCounter == 0 ){
            this.spinner.hide ();
        }
      }),
      catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
              // client-side error
              errorMessage = `Error: ${error.error.message}`;

              // TODO Mandar mensaje al servidor para registrar cualquier error en el cliente
          } else {
              // server-side error
              errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
          }
          console.log(errorMessage);
          return throwError(error);
      })
    );
  }  
}


export const interceptorProvider = [{provide: HTTP_INTERCEPTORS, useClass: ProdInterceptorService, multi: true}];
