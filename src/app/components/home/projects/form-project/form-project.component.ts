import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/Project';
import { Sensor } from 'src/app/models/Sensor';
import { SensorType } from 'src/app/models/SensorType';
import { SensorValue } from 'src/app/models/SensorValue';
import { ProjectsService } from 'src/app/services/projects.service';
import { SensorService } from 'src/app/services/sensor.service';
import { TokenService } from 'src/app/services/token.service';

// jQuery Sign $
declare let $: any;

@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.css']
})
export class FormProjectComponent implements OnInit {

  public isEdition: boolean = false;
  public isReadOnly: boolean = false;
  public isCurrentUserCreator = false;

  public projectId!: number;
  public projectFrom: Project = new Project();
  public sensorTypesMasterTable: SensorType[] = [];

  public auxSensor: Sensor = new Sensor();
  
  public csvFile!: File;

  public graphsOptions: any;
  
  @ViewChild('mapModal') mapModal!: ElementRef;

  constructor(private projectService: ProjectsService,
    private sensorService: SensorService,
    private tokenService: TokenService,
    private toast: ToastrService,
    private router: Router) {

    let currentNavigation: any = this.router.getCurrentNavigation();

    if (currentNavigation != null && currentNavigation.extras.state.id) {
      this.projectId = currentNavigation.extras.state.id;

      this.isEdition = true;
    }
  }

  ngOnInit() {
    // Get all sensors types
    this.sensorService.findAllSensorTypes().subscribe((sensorTypes: SensorType[]) => {
      this.sensorTypesMasterTable = sensorTypes;
    }, error => {
      throw error;
    });

    if(this.projectId && this.isEdition){
      this.projectService.findProjectById(this.projectId).subscribe((project: Project) => {
        if(project && project.id){
          this.projectFrom = project;
  
          this.createGraph(project.sensors);
          
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

  createGraph(sensors: Sensor[]): void{
    let series: any[] = [];
    let xAxis: Date[] = [];
    let leyend: string[] = [];

    sensors.forEach(sensor => {
      let data: any[] = [];
      sensor.sensorValues.forEach(element => {
        console.info("Sensor name: " + sensor.name + " - " + element.timestamp + " -- " + element.value);
        data.push({
          name: element.timestamp,
          value: element.value
        })
      });

      leyend.push(this.getSensorTypeById(sensor.sensorTypeId).code);

      series.push({
        name: this.getSensorTypeById(sensor.sensorTypeId).code,
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: data
      });
      
    });

    // Creamos los valores del eje X
    sensors[0].sensorValues.forEach(sensorValue => {
      xAxis.push(sensorValue.timestamp);
    });

    // Creamos las opciones de la gráfica
    this.graphsOptions = {
      legend: {
        data: leyend,
        align: 'left',
      },
      title: {
        text: this.projectFrom.title
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          params = params[0];
          const date = new Date(params.name);
          return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + " - " + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' -- ' + params.value;
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        },
        data: xAxis
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: series
    };
  }

  createUpdateProject(): void {
    if(!this.projectFrom.id){
      // Tiene ID => Creación
      this.projectService.createProject(this.projectFrom).subscribe(arg => {
        this.toast.info('Proyecto creado correctamente');
      }, error => {
        this.toast.error('Se ha producido un error al crear un nuevo proyecto');
        throw error;
      });
    } else {
      // No tiene ID => Edición
      this.projectService.updateProject(this.projectFrom, this.csvFile).subscribe(arg => {
        this.toast.info('Proyecto editado correctamente');
      }, error => {
        this.toast.error('Se ha producido un error al crear un nuevo proyecto');
        throw error;
      });
    }
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

  openMapModal(): void{
    $(this.mapModal.nativeElement).modal('show');
  }

}
