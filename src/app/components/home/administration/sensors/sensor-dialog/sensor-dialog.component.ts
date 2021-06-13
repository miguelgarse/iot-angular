import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { SensorCategory } from 'src/app/models/SensorCategory';
import { SensorType } from 'src/app/models/SensorType';
import { SensorService } from 'src/app/services/sensor.service';

@Component({
  selector: 'app-sensor-dialog',
  templateUrl: './sensor-dialog.component.html',
  styleUrls: ['./sensor-dialog.component.css']
})
export class SensorDialogComponent implements OnInit {

  public title!: string;
  public sensorType: SensorType = new SensorType();
  public sensorCategoriesMasterTable: SensorCategory[] = [];

  @Output() action = new EventEmitter();

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private sensorService: SensorService) { 

    // Get all sensors categories
    this.sensorService.findAllSensorCategories().subscribe((sensorCategory: SensorCategory[]) => {
      this.sensorCategoriesMasterTable = sensorCategory;
    }, error => {
      throw error;
    });
  }

  ngOnInit(): void {
  }

  confirm(): void {
    if (this.sensorType.code && this.sensorType.code.length > 0
        && this.sensorType.category && this.sensorType.category.id) {
        this.action.emit(this.sensorType);
        this.bsModalRef.hide();
    } else {
      if (!this.sensorType.code || this.sensorType.code.length < 1) {
        this.toastr.error("Debe introducir un código");
      }
      if (!this.sensorType || this.sensorType.category.category.length < 1) {
        this.toastr.error("Debe introducir una categoría");
      }
    }
  }
 
  decline(): void {
    this.action.emit(false);
    this.bsModalRef.hide();
  }

}
