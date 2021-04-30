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

  public sensorList: Sensor[] = [];

  constructor(private router: Router, 
              private projectService: ProjectsService,
              private toastr: ToastrService) {

    this.sensorList.push(new Sensor("C02 troposfera", 39.260534, -4.880009));
    this.sensorList.push(new Sensor("Humedad relativa", 39.792023, -1.655515));
    this.sensorList.push(new Sensor("Contaminazion sonora 2ZX.34", 39.057930, -2.840172));
    this.sensorList.push(new Sensor("Radiación solar", 39.653511, -5.453604));
    this.sensorList.push(new Sensor("Presión atmosferica", 40.303243, -3.711627));
    this.sensorList.push(new Sensor("Luminosidad parque", 40.366240, -3.730039));
    this.sensorList.push(new Sensor("Temperatura de la costa de Denia", 38.891631, 0.117911));
    
  }

  ngOnInit() {
    this.projectService.findAllProjects().subscribe((projectList: Project[]) => {
      this.projectList = projectList;
    }, error => {
      this.toastr.error('El token ha expirado');
     // this.router.navigate(['login'], { skipLocationChange: true });
    });
  }

  redirectFormProject(projectId: number): void {
    this.router.navigate(['home/form-project'], { skipLocationChange: true, state: { id: projectId } });
  }
}
