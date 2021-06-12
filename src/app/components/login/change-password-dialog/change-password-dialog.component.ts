import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {

  public title!: string;
  public password!: string;
  public repeatedPassword!: string;
  public showCancel: boolean = false;

  @Output() action = new EventEmitter();

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.action.emit(this.password);
    this.bsModalRef.hide();
  }

  decline(): void {
    this.action.emit(false);
    this.bsModalRef.hide();
  }

  isPasswordNotEqual(): boolean{
    return this.password != this.repeatedPassword || !this.password;
  }

}
