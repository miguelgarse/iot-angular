import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/Project';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {

  public projectList: Project[] = [];

 
  constructor(private router: Router, 
    private projectsService: ProjectsService,
    private toastr: ToastrService) { }


  ngOnInit() {
    this.projectsService.findProjectsByCurrentUser().subscribe((projectList: Project[]) => {
      this.projectList = projectList;
    }, error => {
      this.toastr.error('El token ha expirado');
      throw error;
    });
  }

  redirectFormProject(projectId: number): void {
    this.router.navigate(['home/form-project'], { skipLocationChange: true, state: { id: projectId } });
  }

}
