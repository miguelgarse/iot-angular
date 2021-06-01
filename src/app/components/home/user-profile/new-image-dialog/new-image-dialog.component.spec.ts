import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewImageDialogComponent } from './new-image-dialog.component';

describe('NewImageDialogComponent', () => {
  let component: NewImageDialogComponent;
  let fixture: ComponentFixture<NewImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewImageDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
