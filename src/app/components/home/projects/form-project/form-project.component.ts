import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/Project';
import { Sensor } from 'src/app/models/Sensor';
import { SensorType } from 'src/app/models/SensorType';
import { ProjectsService } from 'src/app/services/projects.service';
import { SensorService } from 'src/app/services/sensor.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.css']
})
export class FormProjectComponent implements OnInit {

  public isEdition: boolean = false;
  public isCurrentUserCreator = false;

  public projectFrom: Project = new Project();
  public sensorsMasterTable: Sensor[] = [];
  public sensorTypesMasterTable: SensorType[] = [];

  public auxSensor: Sensor = new Sensor();
  
  constructor(private projectService: ProjectsService,
    private sensorService: SensorService,
    private tokenService: TokenService,
    private toast: ToastrService,
    private router: Router) {

    let currentNavigation: any = this.router.getCurrentNavigation();

    if (currentNavigation != null && currentNavigation.extras.state.id) {
      let projectId: number = currentNavigation.extras.state.id;

      this.isEdition = true;

      this.projectService.findProjectById(projectId).subscribe((project: Project) => {
        if(project && project.id){
          this.projectFrom = project;

          if(project.createdUser.username == this.tokenService.getUserName()){
            this.isCurrentUserCreator = true;
          }
        } else {
          // Project not found
          this.toast.error('Error al recuperar los datos del proyecto seleccionado');
          this.router.navigate(['home']);
        }
      }, error => {
        this.toast.error('Error al recuperar los datos del proyecto seleccionado');
        throw error;
      });
    }
  }

  ngOnInit() {

    this.sensorService.findAllSensors().subscribe((sensors: Sensor[]) => {
      this.sensorsMasterTable = sensors;
    }, error => {
      throw error;
    });

    this.sensorService.findAllSensorTypes().subscribe((sensorTypes: SensorType[]) => {
      this.sensorTypesMasterTable = sensorTypes;
    }, error => {
      throw error;
    });
    
  }

  createProject(): void {
    this.projectService.newProject(this.projectFrom).subscribe(arg => {
      this.toast.info('Proyecto creado');
    }, error => {
      this.toast.error('Se ha producido un error al crear un nuevo proyecto');
      throw error;
    });
  }

  cancelProject(): void {
    this.router.navigate(['home']);
  }

  addSensor(): void{
    if(!this.projectFrom.sensors){
      this.projectFrom.sensors = [];
    }
    
    this.projectFrom.sensors.push(this.auxSensor);
    this.auxSensor = new Sensor();
  }
}
