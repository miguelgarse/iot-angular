import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../models/Project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private apiEndpoint: string = environment.apiUrl;
 
  constructor(private http: HttpClient) { }

  public newProject(project: Project): Observable<any> {
    return this.http.post<any>(this.apiEndpoint + "/api/project", project, 
    { 
      observe: 'response' 
    });
  }

  public updateProject(project: Project): Observable<any> {
    return this.http.put<any>(this.apiEndpoint + "/api/project", project, 
    { 
      observe: 'response' 
    });
  }

  public findAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiEndpoint + "/api/project");
  }

  public findProjectById(projectId: number): Observable<Project> {
    return this.http.get<Project>(this.apiEndpoint + "/api/project/" + projectId);
  }

  public uploadFiles(file: File): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    let headers = new HttpHeaders();

    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http.post<any>(this.apiEndpoint + "/api/client/add-data", formData,
      { headers: headers }
    );
  }
  
}
