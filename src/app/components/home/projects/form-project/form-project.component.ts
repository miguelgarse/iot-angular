import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/Project';
import { Sensor } from 'src/app/models/Sensor';
import { SensorType } from 'src/app/models/SensorType';
import { ProjectsService } from 'src/app/services/projects.service';
import { SensorService } from 'src/app/services/sensor.service';
import { TokenService } from 'src/app/services/token.service';
import { SensorSelectionDialogComponent } from './sensor-selection-dialog/sensor-selection-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.css']
})
export class FormProjectComponent implements OnInit {

  public isEdition: boolean = false;
  public isCurrentUserCreator: boolean = false;

  public projectFrom: Project = new Project();
  public sensorTypesMasterTable: SensorType[] = [];

  public csvFile!: File;
  public graphsOptions: any;
  public keywordInput: string = "";

  public urlApiRest: string = environment.apiUrl + "/data/mgarcia?token=8cltxPHAQJhYCB4";


  constructor(private projectService: ProjectsService,
    private sensorService: SensorService,
    private tokenService: TokenService,
    private toast: ToastrService,
    private router: Router,
    private modalService: BsModalService,
    public datepipe: DatePipe) {

    let currentNavigation: any = this.router.getCurrentNavigation();

    // Get all sensors types
    this.sensorService.findAllSensorTypes().subscribe((sensorTypes: SensorType[]) => {
      this.sensorTypesMasterTable = sensorTypes;
    }, error => {
      throw error;
    });

    if (currentNavigation != null && currentNavigation.extras.state.id) {
      this.isEdition = true;

      this.projectService.findProjectById(currentNavigation.extras.state.id).subscribe((project: Project) => {
        if(project && project.id){
          this.projectFrom = project;

          if(!this.projectFrom.dashboardIot)
            this.projectFrom.dashboardIot = "";

          if(!this.projectFrom.collaborationPlatorm)
            this.projectFrom.collaborationPlatorm = "";

          if(project.sensors && project.sensors.length > 0){
            this.createGraph(project.sensors);
          }
          
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

  ngOnInit() { }

  isFormDisabled(): boolean {
    return this.isEdition && !this.isCurrentUserCreator && !this.tokenService.isAdmin();
  }

  createGraph(sensors: Sensor[]): void{
    const xAxisData = [];
    const data1 = [];

    for (let i = 0; i < sensors[0].sensorValues.length; i++) {
      let timestamp: Date = sensors[0].sensorValues[i].timestamp;
      xAxisData.push(this.datepipe.transform(timestamp, 'dd/MM/yyyy'));
      data1.push(sensors[0].sensorValues[i].value);
    }

    this.graphsOptions = {
      legend: {
        data: [sensors[0].name],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: true,
        splitLine: {
          show: false,
        },
      },
      yAxis: {},
      series: [
        {
          name: sensors[0].name,
          type: 'line',
          data: data1,
          animationDelay: (idx: number) => idx * 10,
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
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

  getSensorTypeById(sensorTypeId: number): SensorType {
    let sensorTypeResult: SensorType = new SensorType();

    this.sensorTypesMasterTable.forEach((sensorType: SensorType) => {
      if(sensorType.id == sensorTypeId){
        sensorTypeResult = sensorType;
      }
    });
    
    return sensorTypeResult;
  }

  public fileChange(event: any) {
    if(event.target.files != null && event.target.files.length > 0){
      let fileSize: number = event.target.files[0].size;

      this.csvFile = event.target.files[0];

      event.target.value = '';  //Vaciamos el array en el que nos vienen los ficheros que hemos seleccionado con el input
    }
  }

  public uploadFiles(): void {
    this.projectService.uploadFiles(this.csvFile).subscribe(response => {

    }, error => {
      this.toast.error('Error en la subida del fichero');
      throw error;
    });
  }

  public openSensorModal(): void{
    let bsModalRef!: BsModalRef;

    let config = {
      ignoreBackdropClick: true,
      class: 'modal-lg',
      initialState: {
        title: 'Añadir un sensor',
        sensor: new Sensor(),
        sensorTypesMasterTable: this.sensorTypesMasterTable
      }
    };

    bsModalRef = this.modalService.show(SensorSelectionDialogComponent, config);

    bsModalRef.content.action.subscribe((sensor: Sensor) => {
      if (sensor) {
        if(!this.projectFrom.sensors){
          this.projectFrom.sensors = [];
        }
        this.projectFrom.sensors.push(sensor);
      }
    });
  }

  addKeyword(): void {
    if(this.keywordInput && this.keywordInput.trim().length > 0){
      if(this.projectFrom.keywords.includes(this.keywordInput)){
        this.toast.info("La palabra clave " + this.keywordInput + " ya está añadida");
      } else{
        this.projectFrom.keywords.push(this.keywordInput);
  
        this.keywordInput = "";
      }
    }
  }

  deleteKeyword(keyword: string): void {
    const index: number = this.projectFrom.keywords.indexOf(keyword);
    if (index !== -1) {
      this.projectFrom.keywords.splice(index, 1);
    }   
  }

  deleteSensor(sensor: Sensor): void{

  }
}
