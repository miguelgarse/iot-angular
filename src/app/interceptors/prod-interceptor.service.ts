import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProdInterceptorService implements HttpInterceptor{

  constructor(private tokenService: TokenService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let intReq = req;

    const token = this.tokenService.getToken();

    if(token){
      intReq = req.clone({headers: req.headers.set('Authorization', 'Bearer '+token)});
    }

    return next.handle(intReq).pipe(
      // retry(1),
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
