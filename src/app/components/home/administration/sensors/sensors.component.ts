import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Sensor } from 'src/app/models/Sensor';
import { SensorType } from 'src/app/models/SensorType';
import { SensorService } from 'src/app/services/sensor.service';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {

  public sensorTypeList: SensorType[] = [];
  
  constructor(private sensorService: SensorService,
    private toastr: ToastrService) {
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

}
