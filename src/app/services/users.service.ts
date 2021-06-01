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
    return this.http.get<any>(this.apiEndpoint + "/" + username);
  }

  public registerUser(user: User): Observable<any> {
    return this.http.post<User>(this.apiEndpoint + "/api/user/createUser", user);
  }

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiEndpoint + "/api/user");
  }

  public getUserById(userId: number): Observable<User> {
    return this.http.get<User>(this.apiEndpoint + "/api/user/" + userId);
  }

  public deleteUserById(userId: number): Observable<User> {
    return this.http.delete<User>(this.apiEndpoint + "/api/user/" + userId);
  }

  public getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.apiEndpoint + "/api/user/getCurrentUser" );
  }

  public generateTokenApi(): Observable<User> {
    return this.http.get<User>(this.apiEndpoint + "/api/user/generateTokenApi" );
  }

  public updateUserImage(image: string): Observable<User> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.put<User>(this.apiEndpoint + "/api/user/updateUserImage", formData);
  }

  public updatePassword(password: string): Observable<User> {
    const formData = new FormData();
    formData.append('password', password);

    return this.http.put<User>(this.apiEndpoint + "/api/user/updatePassword", formData);
  }

}
