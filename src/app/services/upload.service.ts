import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  
  private endPoint: string = "";
  private apiEndpoint: string = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  recuperarClientes(): any {
    this.endPoint = this.apiEndpoint + "/api/client";
    return this._http.get(this.endPoint);
  }

  recogerSensoresCliente(cliente: String) {
    this.endPoint = this.apiEndpoint + "/api/sensors/client/" + cliente;
    return this._http.get(this.endPoint);
  }

  recogerValoresdeSensor(sensor: string) {
    this.endPoint = this.apiEndpoint + "/api/timeLine/" + sensor;
    return this._http.get(this.endPoint);
  }

  iniciarRangos(): any {
    this.endPoint = this.apiEndpoint + "/recuperarRangos";
    return this._http.get(this.endPoint);
  }

  cambiarRangos(tempMin: string, tempMax: string): any {
    this.endPoint = this.apiEndpoint + "/rangos/".concat(tempMin).concat("/").concat(tempMax);
    return this._http.get(this.endPoint);
  }
}
