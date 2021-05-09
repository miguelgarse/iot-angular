import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Sensor } from 'src/app/models/Sensor';
import { SensorService } from 'src/app/services/sensor.service';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {

  public sensorList: Sensor[] = [];
  
  constructor(private sensorService: SensorService,
    private toastr: ToastrService) {
      this.getUserList();
     }

  ngOnInit(): void {
  }

  public getUserList(): void {
    this.sensorService.findAllSensors().subscribe((sensors: Sensor[]) => {
      this.sensorList = sensors;
    }, error => {
      this.toastr.error('Error al obtener todos los sensores');
      throw error;
    });
  }

}
