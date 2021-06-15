import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/models/Project';
import { Sensor } from 'src/app/models/Sensor';
import { SensorCategory } from 'src/app/models/SensorCategory';
import { SensorType } from 'src/app/models/SensorType';
import { SensorService } from 'src/app/services/sensor.service';

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
  public sensorCategoriesMasterTable: SensorCategory[] = [];
  public manufacturerMasterTable: Set<string> = new Set();

  public sensorTypesList: SensorType[] = [];
  public sensorCategoriesList: SensorCategory[] = [];
  public manufacturerList: Set<string> = new Set();

  public categorySelected: number = 0;
  public manufacturerSelected: string = "0";
  public sensorTypeSelected: number = 0;

  @Output() action = new EventEmitter();

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private sensorService: SensorService) { 
    }

  ngOnInit(): void {
    this.sensorTypesMasterTable = this.sensorTypesMasterTable.sort((a,b) => a.code > b.code ? 1 : -1);

     // Get all sensors categories
    this.sensorService.findAllSensorCategories().subscribe((sensorCategory: SensorCategory[]) => {
      this.sensorCategoriesMasterTable = sensorCategory;
      this.sensorCategoriesList = JSON.parse(JSON.stringify(this.sensorCategoriesMasterTable));
    }, error => {
      throw error;
    });

    // Initial values
    this.sensorTypesMasterTable.forEach((sensorType: SensorType) => {
      this.manufacturerMasterTable.add(sensorType.manufacturer);
      this.manufacturerList.add(sensorType.manufacturer);
    });
    this.sensorTypesList = JSON.parse(JSON.stringify(this.sensorTypesMasterTable));

    this.sensor.sensorType = new SensorType();
    this.sensor.sensorType.id = 0;
  }

  confirm(): void {
    this.action.emit(this.sensor);
    this.bsModalRef.hide();
  }
 
  decline(): void {
    this.action.emit(false);
    this.bsModalRef.hide();
  }

  categoryChanged(): void{
    this.manufacturerList = new Set();
    this.sensorTypesList = [];
    this.manufacturerSelected = "0";
    this.sensorTypeSelected = 0;
    this.sensor.sensorType = new SensorType();

    this.sensorTypesMasterTable.forEach((sensorType: SensorType) => {
      if(sensorType.category.id == this.categorySelected){
        this.manufacturerList.add(sensorType.manufacturer);
      }
    });
    
    this.sensorTypesMasterTable.forEach((sensorType: SensorType) => {
      if(sensorType.manufacturer == this.manufacturerSelected){
        this.sensorTypesList.push(sensorType);
      }
    });
  }

  manufacturerChanged(): void{
    this.sensorTypesList = [];
    this.sensorTypeSelected = 0;
    this.sensor.sensorType = new SensorType();
    
    this.sensorTypesMasterTable.forEach((sensorType: SensorType) => {
      if(this.categorySelected){
        if(sensorType.category.id == this.categorySelected 
          && sensorType.manufacturer == this.manufacturerSelected){
          this.sensorTypesList.push(sensorType);
        }
      } else {
        if(sensorType.manufacturer == this.manufacturerSelected){
          this.sensorTypesList.push(sensorType);
        }
      }
    });   
  }

  sensorTypeChanged(): void{
    this.sensorTypesMasterTable.forEach((sensorType: SensorType) => {
      if(sensorType.id == this.sensorTypeSelected){
        this.sensor.sensorType = new SensorType();
        this.sensor.sensorType.url  = sensorType.url;
        this.sensor.sensorType.id   = sensorType.id;
        this.sensor.sensorType.code = sensorType.code;
        this.sensor.sensorType.manufacturer = sensorType.manufacturer;
        this.sensor.sensorType.category.category = sensorType.category.category;
      }
    });   
  }

}
