import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { SensorType } from 'src/app/models/SensorType';
import { SensorService } from 'src/app/services/sensor.service';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';

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

  public editSensorType(sensorType: SensorType): void{

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
