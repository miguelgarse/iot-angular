import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/Project';
import { Sensor } from 'src/app/models/Sensor';
import { ProjectsService } from 'src/app/services/projects.service';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projectList: Project[] = [];

  constructor(private router: Router, 
              private projectService: ProjectsService,
              private toastr: ToastrService,
              private modalService: BsModalService) {
    
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

  formProject(project?: Project): void {
    this.router.navigate(['home/form-project'], { skipLocationChange: true, state: { id: project?project.id:null } });
  }

  deleteProject(project: Project): void{

    let bsModalRef!: BsModalRef;

    let config = {
      ignoreBackdropClick: true,
      initialState: {
        title: 'Borrar Proyecto',
        message: '¿Desea borrar el proyecto ' + project.title + '?'
      }
    };

    bsModalRef = this.modalService.show(ConfirmDialogComponent, config);

    bsModalRef.content.action.subscribe((value: any) => {
      if(value){
        this.projectService.deleteProjectById(project.id).subscribe(() => {
          this.toastr.success("El proyecto " + project.title + " ha sido borrado");
          this.getProjectList();
        }, error => {
          throw error;
        });
      }
    });

  }
}
