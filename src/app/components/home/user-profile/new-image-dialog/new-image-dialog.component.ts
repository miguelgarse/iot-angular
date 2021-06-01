import { Component, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-new-image-dialog',
  templateUrl: './new-image-dialog.component.html',
  styleUrls: ['./new-image-dialog.component.css']
})
export class NewImageDialogComponent implements OnInit {

  public title!: string;
  public message!: string;
  public imgURL: any;

  @Output() action = new EventEmitter();
 
  constructor(public bsModalRef: BsModalRef) {}
 
  ngOnInit() {
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
