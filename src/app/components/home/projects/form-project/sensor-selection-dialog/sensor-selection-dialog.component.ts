import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/Project';
import { Sensor } from 'src/app/models/Sensor';
import { SensorType } from 'src/app/models/SensorType';

@Component({
  selector: 'app-sensor-selection-dialog',
  templateUrl: './sensor-selection-dialog.component.html',
  styleUrls: ['./sensor-selection-dialog.component.css']
})
export class SensorSelectionDialogComponent implements OnInit {
  public title!: string;
  public project!: Project;
  public sensor!: Sensor;

  public sensorTypesMasterTable: SensorType[] = [];

  @Output() action = new EventEmitter();

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.action.emit(this.sensor);
    this.bsModalRef.hide();
  }
 
  decline(): void {
    this.action.emit(false);
    this.bsModalRef.hide();
  }

}
