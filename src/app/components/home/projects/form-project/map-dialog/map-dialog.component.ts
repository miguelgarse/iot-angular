import { Component, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.css']
})
export class MapDialogComponent implements OnInit {

  public title!: string;

  @Output() action = new EventEmitter();

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.action.emit(true);
    this.bsModalRef.hide();
  }
 
  decline(): void {
    this.action.emit(false);
    this.bsModalRef.hide();
  }

}
