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
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/User';

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
  public componentsInput: string = "";
  
  public urlApiRest: string = environment.apiUrl + "/data/";

  constructor(private projectService: ProjectsService,
    private sensorService: SensorService,
    private tokenService: TokenService,
    private toast: ToastrService,
    private router: Router,
    private modalService: BsModalService,
    public datepipe: DatePipe,
    private usersService: UsersService) {

    let currentNavigation: any = this.router.getCurrentNavigation();

    // Get all sensors types
    this.sensorService.findAllSensorTypes().subscribe((sensorTypes: SensorType[]) => {
      this.sensorTypesMasterTable = sensorTypes;
    }, error => {
      throw error;
    });

    if (currentNavigation != null && currentNavigation.extras.state.id) {
      this.isEdition = true;

      this.getProjectById(currentNavigation.extras.state.id);
    }
  }

  ngOnInit() { }

  getProjectById(projectId: number): void{
    this.projectService.findProjectById(projectId).subscribe((project: Project) => {
      if(project && project.id){
        this.projectFrom = project;

        if(!this.projectFrom.keywords)
          this.projectFrom.keywords = [];
        if(!this.projectFrom.components)
          this.projectFrom.components = [];

        if(project.sensors && project.sensors.length > 0){
          this.createGraph(project.sensors);
        }
        
        if(project.createdUser.username == this.tokenService.getUserName()){
          this.isCurrentUserCreator = true;
        }

        // Construimos la url de la API
        this.usersService.getCurrentUser().subscribe((user: User) => {
          this.urlApiRest = this.urlApiRest + project.createdUser.username + "?token=" + user.tokenApi;
        });
        
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

  isFormDisabled(): boolean {
    return this.isEdition && !this.isCurrentUserCreator && !this.tokenService.isAdmin();
  }

  createGraph(sensors: Sensor[]): void{
    const xAxisData = [];
    const series: Object[] = [];
    const legends: string[] = [];

    // Generate X Axis
    for (let i = 0; i < sensors[0].sensorValues.length; i++) {
      let timestamp: Date = sensors[0].sensorValues[i].timestamp;
      xAxisData.push(this.datepipe.transform(timestamp, 'dd/MM/yyyy'));
    }

    // Generate series
    sensors.forEach(sensor => {
      let dataArray = [];
      for (let i = 0; i < sensor.sensorValues.length; i++) {
        dataArray.push(sensor.sensorValues[i].value);
      }
      
      series.push({
          name: sensor.name,
          type: 'line',
          data: dataArray,
          animationDelay: (idx: number) => idx * 10,
      });

      legends.push(sensor.name);
    });
    
    this.graphsOptions = {
      legend: {
        data: legends,
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
      series: series,
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };
  }

  createUpdateProject(): void {
    if(!this.projectFrom.id){
      // No tiene ID => Creación
      this.projectService.createProject(this.projectFrom).subscribe((project: Project) => {
        this.toast.success('Proyecto creado correctamente');
        this.getProjectById(project.id);
        window.scroll(0, 0);
      }, error => {
        this.toast.error('Se ha producido un error al crear un nuevo proyecto');
        throw error;
      });
    } else {
      // Tiene ID => Edición
      this.projectService.updateProject(this.projectFrom, this.csvFile).subscribe((project: Project) => {
        this.toast.success('Proyecto editado correctamente');
        this.getProjectById(project.id);
        window.scroll(0, 0);
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
      if(this.projectFrom.keywords && this.projectFrom.keywords.includes(this.keywordInput)){
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

  addComponent(): void {
    if(this.componentsInput && this.componentsInput.trim().length > 0){
      if(this.projectFrom.components && this.projectFrom.components.includes(this.componentsInput)){
        this.toast.info("La palabra clave " + this.componentsInput + " ya está añadida");
      } else{
        this.projectFrom.components.push(this.componentsInput);
  
        this.componentsInput = "";
      }
    }
  }

  deleteComponent(component: string): void {
    const index: number = this.projectFrom.components.indexOf(component);
    if (index !== -1) {
      this.projectFrom.components.splice(index, 1);
    }   
  }

  deleteSensor(sensor: Sensor): void{
    const index: number = this.projectFrom.sensors.indexOf(sensor);
    if (index !== -1) {
      this.projectFrom.sensors.splice(index, 1);
    }  
  }
  
}
