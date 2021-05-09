import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Sensor } from '../models/Sensor';
import { SensorType } from '../models/SensorType';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private apiEndpoint: string = environment.apiUrl;
 
  constructor(private http: HttpClient) { }

  public newSensor(sensor: Sensor): Observable<any> {
    return this.http.post<any>(this.apiEndpoint + "/api/sensor", sensor, 
    { 
      observe: 'response' 
    });
  }

  public updateSensor(project: Sensor): Observable<any> {
    return this.http.put<any>(this.apiEndpoint + "/api/sensor", project, 
    { 
      observe: 'response' 
    });
  }

  public findAllSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(this.apiEndpoint + "/api/sensor");
  }

  public findSensorById(sensorId: number): Observable<Sensor> {
    return this.http.get<Sensor>(this.apiEndpoint + "/api/sensor/" + sensorId);
  }

  public findAllSensorsByProjectId(projectId: number): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(this.apiEndpoint + "/api/sensor/byProject" + projectId);
  }

  public findAllSensorTypes(): Observable<SensorType[]> {
    return this.http.get<SensorType[]>(this.apiEndpoint + "/api/sensorType");
  }
  
}
