import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Jwt } from '../models/Jwt';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private endPoint: string = "";
  private apiEndpoint: string = environment.apiUrl;
 
  constructor(private http: HttpClient) { }

  public login(username: string, password: string): Observable<Jwt> {
    this.endPoint = this.apiEndpoint + "/auth/login";
    return this.http.post<Jwt>(this.endPoint, {username, password});
  }

  public checkUsername(username: string): Observable<any> {
    return this.http.get<any>(this.apiEndpoint + "/" + username, { observe: 'response' } );
  }

  public registerUser(user: User): Observable<any> {
    return this.http.post<any>(this.apiEndpoint + "/api/admin/createUser", user, 
    { 
      observe: 'response' 
    });
  }

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiEndpoint + "/api/admin/getAllUsers");
  }

}
