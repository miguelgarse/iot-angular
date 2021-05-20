import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/Project';
import { Sensor } from 'src/app/models/Sensor';
import { SensorType } from 'src/app/models/SensorType';
import { SensorValue } from 'src/app/models/SensorValue';
import { ProjectsService } from 'src/app/services/projects.service';
import { SensorService } from 'src/app/services/sensor.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.css']
})
export class FormProjectComponent implements OnInit, OnDestroy {

  public isEdition: boolean = false;
  public isCurrentUserCreator = false;

  public projectFrom: Project = new Project();
  public sensorsMasterTable: Sensor[] = [];
  public sensorTypesMasterTable: SensorType[] = [];

  public auxSensor: Sensor = new Sensor();
  
  public csvFile!: File;

  public graphsOptions: any[] = [];
  
  private timer: any;

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
          this.router.navigate(['home'], { skipLocationChange: true });
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
    
    
    this.sensorService.findAllSensorValuesByProjectId(this.projectFrom.id).subscribe((sensors: Sensor[]) => {
      sensors.forEach(sensor => {
        this.createGraph(sensor);
      });
    }, error => {
      throw error;
    });
  }


  ngOnDestroy() {
    clearInterval(this.timer);
  }

  createGraph(sensor: Sensor): void{
 // ******************

    // generate some random testing data:
    let data: any[] = [];

    sensor.sensorValues.forEach(element => {
      data.push({
        name: element.timestamp,
        value: element.value
      })
    });

    // initialize chart options:
    this.graphsOptions.push({
      title: {
        text: sensor.name
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          params = params[0];
          const date = new Date(params.name);
          return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [{
        name: 'Mocking Data',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: data
      }]
    });
  }


  createProject(): void {
    this.projectService.newProject(this.projectFrom, this.csvFile).subscribe(arg => {
      this.toast.info('Proyecto creado');
    }, error => {
      this.toast.error('Se ha producido un error al crear un nuevo proyecto');
      throw error;
    });
  }

  cancelProject(): void {
    this.router.navigate(['home'], { skipLocationChange: true });
  }

  addSensor(): void{
    if(!this.projectFrom.sensors){
      this.projectFrom.sensors = [];
    }
    
    this.projectFrom.sensors.push(this.auxSensor);
    this.auxSensor = new Sensor();
  }

  getSensorTypeById(sensorTypeId: number): SensorType {
    let sensorTypeResult: SensorType = new SensorType();

    this.sensorTypesMasterTable.forEach((sensorType: SensorType) => {
      if(sensorType.id == sensorTypeId){
        sensorTypeResult = sensorType;
      }
    });
    
    return sensorTypeResult;
  }

  fileChange(event: any) {
    if(event.target.files != null && event.target.files.length > 0){
      let fileSize: number = event.target.files[0].size;

      this.csvFile = event.target.files[0];

      event.target.value = '';  //Vaciamos el array en el que nos vienen los ficheros que hemos seleccionado con el input
    }
  }

  uploadFiles(): void {
    this.projectService.uploadFiles(this.csvFile).subscribe(response => {

    }, error => {
      this.toast.error('Error en la subida del fichero');
      throw error;
    });
  }

}
