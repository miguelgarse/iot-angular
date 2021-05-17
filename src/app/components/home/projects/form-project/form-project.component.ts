import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class FormProjectComponent implements OnInit, OnDestroy {

  public isEdition: boolean = false;
  public isCurrentUserCreator = false;

  public projectFrom: Project = new Project();
  public sensorsMasterTable: Sensor[] = [];
  public sensorTypesMasterTable: SensorType[] = [];

  public auxSensor: Sensor = new Sensor();
  
  public csvFile!: File;

  options: any;
  updateOptions: any;
  private oneDay = 24 * 3600 * 1000;
  private now!: Date;
  private value!: number ;
  private data!: any[];
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
    
    



    // ******************

    // generate some random testing data:
    this.data = [];
    this.now = new Date(1997, 9, 3);
    this.value = Math.random() * 1000;

    for (let i = 0; i < 1000; i++) {
      this.data.push(this.randomData());
    }

    // initialize chart options:
    this.options = {
      title: {
        text: 'Sensor'
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
        data: this.data
      }]
    };

   
    for (let i = 0; i < 5; i++) {
      this.data.shift();
      this.data.push(this.randomData());
    }

    

  }


  ngOnDestroy() {
    clearInterval(this.timer);
  }


  randomData() {
    this.now = new Date(this.now.getTime() + this.oneDay);
    this.value = this.value + Math.random() * 21 - 10;
    return {
      name: this.now.toString(),
      value: [
        [this.now.getFullYear(), this.now.getMonth() + 1, this.now.getDate()].join('/'),
        Math.round(this.value)
      ]
    };
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
