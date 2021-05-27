import { Component, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  public title!: string;
  public message!: string;

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
