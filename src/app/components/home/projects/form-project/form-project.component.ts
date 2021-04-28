import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/Project';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.css']
})
export class FormProjectComponent implements OnInit {

  public projectFrom: Project = new Project();

  constructor(private projectService: ProjectsService,
              private toast: ToastrService,
              private router: Router) { 
      
    let currentNavigation: any = this.router.getCurrentNavigation();
            
    if(currentNavigation != null && currentNavigation.extras.state.id){
      let projectId: number = currentNavigation.extras.state.id;

      this.projectService.findProjectById(projectId).subscribe((project: Project) => {
        this.projectFrom = project;
      });
    }
  }

  ngOnInit() {
  }

  createProject(): void{
    this.projectService.newProject(this.projectFrom).subscribe(arg => {
      this.toast.info('Proyecto creado');
    }, error => {
      this.toast.error('Se ha producido un error al crear un nuevo proyecto');
    });
  }
  
}
