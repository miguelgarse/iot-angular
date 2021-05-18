import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/Project';
import { Sensor } from 'src/app/models/Sensor';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projectList: Project[] = [];

  constructor(private router: Router, 
              private projectService: ProjectsService,
              private toastr: ToastrService) {
    
  }

  ngOnInit() {
    this.getProjectList();
  }

  getProjectList(): void{
    this.projectService.findAllProjects().subscribe((projectList: Project[]) => {
      this.projectList = projectList;
    }, error => {
      this.toastr.error('El token ha expirado');
      throw error;
    });
  }

  formProject(projectId?: number): void {
    this.router.navigate(['home/form-project'], { skipLocationChange: true, state: { id: projectId } });
  }

  deleteProject(projectId: number): void{
    this.projectService.deleteProjectById(projectId).subscribe((project: Project) => {
      if(project && project.id){
        this.toastr.success("El proyecto " + project.title + " ha sido borrado");
        this.getProjectList();
      }
    }, error => {
      throw error;
    });
  }
}
