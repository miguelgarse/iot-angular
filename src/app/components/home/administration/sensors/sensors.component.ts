import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { SensorType } from 'src/app/models/SensorType';
import { SensorService } from 'src/app/services/sensor.service';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { SensorDialogComponent } from './sensor-dialog/sensor-dialog.component';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {

  bsModalRef!: BsModalRef;

  public sensorTypeList: SensorType[] = [];
  
  constructor(private sensorService: SensorService,
              private toastr: ToastrService,
              private modalService: BsModalService) {
      this.getSensorTypeList();
  }

  ngOnInit(): void {
  }

  public getSensorTypeList(): void {
    this.sensorService.findAllSensorTypes().subscribe((sensors: SensorType[]) => {
      this.sensorTypeList = sensors;
    }, error => {
      this.toastr.error('Error al obtener todos los tipos de sensor');
      throw error;
    });
  }

  public createSensorType(): void{
    let bsModalRef!: BsModalRef;

    let config = {
      ignoreBackdropClick: true,
      class: 'modal-xl',
      initialState: {
        title: 'Crear nuevo Tipo de Sensor'
      }
    };

    bsModalRef = this.modalService.show(SensorDialogComponent, config);

    bsModalRef.content.action.subscribe((sensorType: SensorType) => {
      if (sensorType) {
        this.sensorService.createSensorType(sensorType).subscribe(response => {
          this.toastr.success("Tipo de sensor creado correctamente: " + response.code);
          this.getSensorTypeList();
        }, (error: any) => {
          throw error;
        });
      }
    });
  }

  public editSensorType(sensorType: SensorType): void{
    let bsModalRef!: BsModalRef;

    this.sensorService.findSensorTypeById(sensorType.id).subscribe((sensorTypeToEdit: SensorType) => {
      let config = {
        ignoreBackdropClick: true,
        class: 'modal-xl',
        initialState: {
          title: 'Editar Tipo de Sensor ' + sensorTypeToEdit.code,
          sensorType: sensorTypeToEdit
        }
      };
  
      bsModalRef = this.modalService.show(SensorDialogComponent, config);
  
      bsModalRef.content.action.subscribe((sensorType: SensorType) => {
        if (sensorType) {
          this.sensorService.updateSensorType(sensorType).subscribe(response => {
            this.toastr.success("Tipo de sensor actualizado correctamente: " + response.code);
            this.getSensorTypeList();
          }, (error: any) => {
           throw error;
          });
        }
      });
    }, error => {
      this.toastr.success("Error al recuperar los datos del tipo de sensor");
      throw error;
    });
  }

  public deleteSensorType(sensorType: SensorType): void{
    let config = {
      ignoreBackdropClick: true,
      initialState: {
        title: 'Borrar Tipo de Sensor',
        message: '¿Desea borrar el Tipo de Sensor ' + sensorType.code + '?'
      }
    };

    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, config);

    this.bsModalRef.content.action.subscribe((value: any) => {
      if(value){
        this.sensorService.deleteSensorTypeById(sensorType.id).subscribe(() => {
          this.sensorService.findAllSensorTypes().subscribe((sensors: SensorType[]) => {
            this.sensorTypeList = sensors;
          }, error => {
            this.toastr.error('Error al obtener todos los tipos de sensor');
            throw error;
          });
        });
      }
    });
  }

}
